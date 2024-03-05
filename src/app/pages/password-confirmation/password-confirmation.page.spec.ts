import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordConfirmationPage } from './password-confirmation.page';

describe('PasswordConfirmationPage', () => {
  let component: PasswordConfirmationPage;
  let fixture: ComponentFixture<PasswordConfirmationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PasswordConfirmationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
