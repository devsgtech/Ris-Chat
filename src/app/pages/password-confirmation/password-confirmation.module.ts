import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswordConfirmationPageRoutingModule } from './password-confirmation-routing.module';

import { PasswordConfirmationPage } from './password-confirmation.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentModule,
    PasswordConfirmationPageRoutingModule
  ],
  declarations: [PasswordConfirmationPage]
})
export class PasswordConfirmationPageModule {}
