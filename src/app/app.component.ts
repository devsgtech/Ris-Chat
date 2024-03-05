import { Component } from '@angular/core';
import { HelperService } from './services/helper.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private helper: HelperService,
    private Statusbar: StatusBar,
    private db: DatabaseService,
    private screenOrientation: ScreenOrientation,
    private platform : Platform
    ) {
    this.initializeApp();
    this.login();
  }

  login(){
    this.platform.ready().then(() => {
      this.db.getLoggedInStatus().then( async res => {
        if(res) 
        {
          this.helper.pushRootPage('tab1', "");
        }
        else{
          this.helper.pushRootPage('login', "");
        }
      })
      .catch( err => {
      })
    })
  }

  initializeApp(){
    this.platform.ready().then(() => {
    this.Statusbar.styleDefault();
    this.Statusbar.overlaysWebView(false);
    this.Statusbar.styleLightContent();
    this.Statusbar.backgroundColorByHexString('#000000');
    this.Statusbar.show();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    });
  }
}
