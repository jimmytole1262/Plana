import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardService } from '../../../services/admin-dashboard.service';
import { ChartModule } from 'primeng/chart';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  numberOfUsers: number = 0;
  numberOfEvents: number = 0;
  totalRevenue: number = 0;

  userChartData: any;
  userRolesOptions: any;
  eventChartData: any;
  revenueChartData: any;
  userRolesData: any;
  userRoles: { [key: string]: number } = {};

  constructor(private adminDashboardService: AdminDashboardService) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.adminDashboardService.getUserCount().subscribe(
      (response) => {
        this.numberOfUsers = response.numberOfUsers;
        this.updateUserChart();
      },
      (error) => {
        console.error('Error fetching user count:', error);
      }
    );

    this.adminDashboardService.getEventCount().subscribe(
      (response) => {
        this.numberOfEvents = response.numberOfEvents;
        this.updateEventChart();
      },
      (error) => {
        console.error('Error fetching event count:', error);
      }
    );

    this.adminDashboardService.getTotalRevenue().subscribe(
      (response) => {
        this.totalRevenue = response.totalRevenue;
        this.updateRevenueChart();
      },
      (error) => {
        console.error('Error fetching total revenue:', error);
      }
    );

    this.adminDashboardService.getUserCountRole().subscribe(
      (response) => {
        this.userRoles = response;
        this.updateUserRolesChart(response);
      },
      (error) => {
        console.error('Error fetching user roles count:', error);
      }
    );
  }

  updateUserChart() {
    this.userChartData = {
      labels: ['Users'],
      datasets: [
        {
          label: 'Number of Users',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: [this.numberOfUsers]
        }
      ]
    };
  }

  updateUserRolesChart(data: any) {
    const roles = Object.keys(data);
    const counts = Object.values(data);

    this.userRolesData = {
      labels: roles,
      datasets: [
        {
          data: counts,
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
          hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D']
        }
      ]
    };

    // Chart options for responsiveness
    this.userRolesOptions = {
      maintainAspectRatio: false, // Allow chart to adjust to container
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 12
            }
          }
        }
      }
    };
  }

  updateEventChart() {
    this.eventChartData = {
      labels: ['Events'],
      datasets: [
        {
          label: 'Number of Events',
          backgroundColor: '#9CCC65',
          borderColor: '#7CB342',
          data: [this.numberOfEvents]
        }
      ]
    };
  }

  updateRevenueChart() {
    this.revenueChartData = {
      labels: ['Revenue'],
      datasets: [
        {
          label: 'Total Revenue',
          backgroundColor: '#FF7043',
          borderColor: '#F4511E',
          data: [this.totalRevenue]
        }
      ]
    };
  }

  generatePDF() {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text('Admin Dashboard Analytics Report', 10, 10);

    // Date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, 20);

    // Analytics Summary Table
    doc.setFontSize(14);
    doc.text('Analytics Summary', 10, 30);

    autoTable(doc, {  // Use autoTable directly
      startY: 35,
      head: [['Metric', 'Value']],
      body: [
        ['Number of Users', this.numberOfUsers.toString()],
        ['Number of Events', this.numberOfEvents.toString()],
        ['Total Revenue', `KSH ${this.totalRevenue.toLocaleString()}`]
      ],
      theme: 'striped',
      headStyles: { fillColor: [54, 194, 206] }, // #36C2CE
      styles: { fontSize: 12, cellPadding: 3 }
    });

    // User Roles Breakdown Table
    doc.setFontSize(14);
    const finalY = (doc as any).lastAutoTable.finalY + 10; // Still needs 'any' for lastAutoTable
    doc.text('User Roles Breakdown', 10, finalY);

    const userRolesData = Object.entries(this.userRoles).map(([role, count]) => [role, count.toString()]);
    autoTable(doc, {  // Use autoTable directly
      startY: finalY + 5,
      head: [['Role', 'Count']],
      body: userRolesData,
      theme: 'striped',
      headStyles: { fillColor: [54, 194, 206] }, // #36C2CE
      styles: { fontSize: 12, cellPadding: 3 }
    });

    // Save the PDF
    doc.save('Admin_Dashboard_Report.pdf');
  }
}