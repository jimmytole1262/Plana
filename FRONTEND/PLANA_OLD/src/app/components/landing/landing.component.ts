import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { EventsService, Event } from '../../services/events.service';
import { CommonModule } from '@angular/common';
import { IssuesService } from '../../services/issues.service';
import { Issue } from '../interfaces/issues';
import { ThreeSceneComponent } from '../three-scene/three-scene.component';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, NavbarComponent, CommonModule, ThreeSceneComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, AfterViewInit {
  @ViewChild('heroSection') heroSection!: ElementRef;
  @ViewChild('heroContent') heroContent!: ElementRef;
  @ViewChild(ThreeSceneComponent) threeScene!: ThreeSceneComponent;
  @ViewChildren('eventCard') eventCards!: QueryList<ElementRef>;

  events: Event[] = [];
  issues: Issue[] = [];
  loginMessage: string = '';

  constructor(
    private eventsService: EventsService,
    private issuesService: IssuesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchEvents();
    this.fetchIssues();
  }

  ngAfterViewInit(): void {
    // Wait for data to load before setting up animations
    setTimeout(() => {
      this.setupScrollAnimations();
    }, 100);
  }

  private setupScrollAnimations(): void {
    // Hero section fade and blur on scroll
    if (this.heroContent) {
      gsap.to(this.heroContent.nativeElement, {
        scrollTrigger: {
          trigger: this.heroSection.nativeElement,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        },
        opacity: 0,
        filter: 'blur(10px)',
        y: -100
      });
    }

    // 3D object movement on scroll
    if (this.threeScene) {
      const geometry = this.threeScene.getGeometry();
      const camera = this.threeScene.getCamera();

      gsap.to(geometry.position, {
        scrollTrigger: {
          trigger: this.heroSection.nativeElement,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        },
        x: 3,
        y: 2,
        z: -2
      });

      gsap.to(camera.position, {
        scrollTrigger: {
          trigger: this.heroSection.nativeElement,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        },
        z: 8
      });
    }

    // Event cards staggered animation
    if (this.eventCards && this.eventCards.length > 0) {
      this.eventCards.forEach((card, index) => {
        gsap.from(card.nativeElement, {
          scrollTrigger: {
            trigger: card.nativeElement,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: 50,
          scale: 0.9,
          duration: 0.6,
          delay: index * 0.1
        });
      });
    }
  }

  fetchEvents(): void {
    this.eventsService.fetchAllEvents().subscribe((response) => {
      this.events = response.events;
    });
  }

  fetchIssues(): void {
    this.issuesService.getAllIssues().subscribe((response) => {
      this.issues = response.issues.slice(0, 3);
    });
  }

  bookEvent(eventId: string): void {
    this.loginMessage = 'Redirecting to login page';
    setTimeout(() => {
      this.loginMessage = '';
      this.router.navigate(['/login']);
    }, 3000);
  }
}