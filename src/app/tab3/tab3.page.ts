import { ChangeDetectorRef, Component } from '@angular/core';
import { IMG, VALIDATION_MSG } from '../services/constant.service';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import * as _ from 'lodash';
import { HelperService } from '../services/helper.service';
import { AlertController,  } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  img = IMG;
  grade : any;
  errorMessages = VALIDATION_MSG;
  selectboxtouchgender! :Boolean;
  hideButtomKeyboardOpen = false;
  showPasswordField : boolean = false;
  users = firebase.database().ref('/UserData/');
  valueCheck : boolean = false;
  lastRecord : any;
  emailMatch : boolean = false;
  usernameMatch : boolean = false;
  recordFoundKey : any;
  disableGrade : boolean = true;
  chatID: any = [];
  userData : any;
  gradeRef = firebase.database().ref('/Groups/Grades/');
  deleteChat = firebase.database().ref('/RIS_Chat/GroupChats/');

  constructor(
    private cdRef: ChangeDetectorRef,
    public alertController: AlertController,
    private helper: HelperService,
    private auth: AuthenticationService,) {

    window.addEventListener('keyboardDidShow', (event) => {
      this.hideButtomKeyboardOpen = true;
      this.cdRef.detectChanges(); 
  });

  window.addEventListener('keyboardDidHide', () => {
    this.hideButtomKeyboardOpen = false;
    this.cdRef.detectChanges();
  });
  }

  async navigate(text : any){
    if(text == 'delete')
    {
      this.helper.pushPage('delete-account',"");
    }
    if(text == 'guideline')
    {
      this.helper.pushPage('guideline','');
    }
    if(text == 'report')
    {
      this.helper.pushPage('report','');
    }
    if(text == 'logout')
    {
      this.alertController.create({
        header: 'Confirmation',
        message: 'Are you sure you want to logout?',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
            }
          },
          {
            text: 'Yes',
            handler: async () => {
              this.auth.logout();
            }
          }
        ]
      }).then(res => {
        res.present();
      });
    }
    if(text == 'edit')
    {
      this.helper.pushPage('edit-profile',"");
    }
  }

}