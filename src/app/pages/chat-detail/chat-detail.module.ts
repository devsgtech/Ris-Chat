import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChatDetailPageRoutingModule } from './chat-detail-routing.module';
import { ChatDetailPage } from './chat-detail.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    ChatDetailPageRoutingModule
  ],
  declarations: [ChatDetailPage]
})
export class ChatDetailPageModule {}
