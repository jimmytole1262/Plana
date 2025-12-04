import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminIssueResponsesComponent } from './admin-issue-responses.component';

describe('AdminIssueResponsesComponent', () => {
  let component: AdminIssueResponsesComponent;
  let fixture: ComponentFixture<AdminIssueResponsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminIssueResponsesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminIssueResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
