import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuidelinePage } from './guideline.page';

describe('GuidelinePage', () => {
  let component: GuidelinePage;
  let fixture: ComponentFixture<GuidelinePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GuidelinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
