import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentModule } from './components/component.module';
import * as firebase from 'firebase/app';
import { firebaseConfig } from './services/constant.service';
import { Storage } from '@ionic/storage';
import { IonTabs } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import {Camera} from '@ionic-native/camera/ngx';
import { HttpClientModule } from '@angular/common/http';
import { AlertOTPComponent } from './components/alert-otp/alert-otp.component';
import { FormsModule } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Chooser } from '@ionic-native/chooser/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';

@NgModule({
  declarations: [AppComponent, AlertOTPComponent, DeleteAccountComponent],
  imports: [BrowserModule, IonicModule.forRoot(), HttpClientModule, FormsModule, AppRoutingModule,ComponentModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },IonTabs, 
    Camera, File, ImagePicker, FileTransfer, BackgroundMode, Chooser, FileOpener,
    GooglePlus, Storage,StatusBar,ScreenOrientation],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(){
    firebase.initializeApp(firebaseConfig);
  }
}
