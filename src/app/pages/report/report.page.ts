import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ChatStatusUpdateService } from 'src/app/services/chat-status-update.service';
import { IMG, VALIDATION_MSG } from 'src/app/services/constant.service';
import { HelperService } from 'src/app/services/helper.service';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import * as _ from 'lodash';
import { IonRadioGroup, Platform } from '@ionic/angular';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  img = IMG;
  type : any;
  username: any;
  bugForm : any;
  userForm : any;
  issue: any;
  my_name : any;
  usernameControl: any;
  ownUsername : boolean = false;
  errorMessages = VALIDATION_MSG;
  recordFound : any;
  usernameFound : any;
  disableReport : boolean = true;
  hideButtomKeyboardOpen = false;
  lastRecord : any;
  users = firebase.database().ref('/UserData/');
  @ViewChild('radioGroup', { static: true }) radioGroup!: IonRadioGroup;

  constructor(private helper : HelperService,
    private platform : Platform,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private chatUpdate : ChatStatusUpdateService,) {
    this.platform.ready().then(async () => {
      this.radioGroup.value = 'bug';
      this.type = 'bug';
      this.prepareForm();
      window.addEventListener('keyboardDidShow', (event) => {
        this.hideButtomKeyboardOpen = true;
        this.cdRef.detectChanges(); 
    });
    
    window.addEventListener('keyboardDidHide', () => {
      this.hideButtomKeyboardOpen = false;
      this.cdRef.detectChanges(); 
    });
  })
  }

  prepareForm(){
    this.bugForm = this.fb.group({
      mail: new FormControl("",Validators.compose([Validators.required,])),
      issueControl: new FormControl("",Validators.compose([Validators.required,])),
    });
    this.userForm = this.fb.group({
      mail: new FormControl("",Validators.compose([Validators.required,])),
      issueControl: new FormControl("",Validators.compose([Validators.required,])),
      usernameControl: new FormControl("",Validators.compose([Validators.required,Validators.minLength(5)])),
    });
  }

  ngOnInit() {
    
  }

  select(event : any){
    this.type = event.detail.value;
    this.type == 'user' ?  this.userForm.reset() : this.bugForm.reset();
  }

  back(){
    this.helper.popPage();
  }

  async report(text : any){
    if(text == 'bug')
    {
      this.bugForm.markAllAsTouched();
      if(this.bugForm.valid)
      {
        this.validatemail(this.bugForm)
      }
      else{
        this.helper.presentToast("Please enter valid fields","2000","top",3);
      }
    }
    if(text == 'user')
    {
      this.userForm.markAllAsTouched();
      if(this.userForm.valid)
      {
        this.validatemail(this.userForm)
      }
      else{
        this.helper.presentToast("Please enter valid fields","2000","top",3);
      }
    }
  }
  async validatemail(form: any){
    this.recordFound = false;
    this.usernameFound = false;
    this.ownUsername = false;
    if(form == this.bugForm)
    {
      this.helper.presentLoading('Sending Report')
      await this.users.once('value', async snapshot => {
        let keyList : any = [];
        let item = snapshot.val();
        await _.forEach(item, (val, key) => {
          keyList.push(key);
          this.lastRecord = key;
        })
        await _.forEach(keyList, async (val1, i) => {
          await this.users.child(val1).once('value', async snapShot1 => {
            const ss =  snapShot1.val();
            if(ss.email == form.value.mail.toLowerCase())
            {
              this.recordFound = true;
            }
            if(this.lastRecord == val1)
            {
              await this.sendBugReport(this.recordFound,form);
              this.helper.dismissLoading(2);
            }
          })
        })
      })
    }
    else{
      this.helper.presentLoading('Sending Report')
      await this.users.once('value', async snapshot => {
        let keyList : any = [];
        let item = snapshot.val();
        await _.forEach(item, (val, key) => {
          keyList.push(key);
          this.lastRecord = key;
        })
        await _.forEach(keyList, async (val1, i) => {
          await this.users.child(val1).once('value', async snapShot1 => {
            const ss =  snapShot1.val();
            if(ss.email == form.value.mail.toLowerCase())
            {
              this.recordFound = true;
              if(ss.userName == form.value.usernameControl.toLowerCase())
              {
                this.ownUsername = true;
              }
            }
            if(ss.userName == form.value.usernameControl.toLowerCase())
            {
              this.usernameFound = true;
            }
            if(this.lastRecord == val1)
            {
              if(this.ownUsername)
              {
                this.helper.presentToast('You can not report your own username.','3000');
                this.helper.dismissLoading(2);
              }
              else
              {
              await this.sendUserReport(this.recordFound,form,this.usernameFound);
              this.helper.dismissLoading(2);
              }
            }
          })
        })
      })
    }
  }
  async sendBugReport(record: any, form: any){
    if(record)
    {
      let message = 
      {
        to : 'rischatdev@gmail.com',
        from : 'rischatdev@gmail.com',
        subject : 'New Bug Reported',
        body : "Email Address: "+form.value.mail.toLowerCase()+"\nReported Bug: "+form.value.issueControl.trim()+"\n\nBest Regards,\nRIS Chat Team"
      }
      await this.chatUpdate.sendMailForReport(message)
    }
    else
    {
      this.helper.presentToast('This email does not exist.','3000');
    }
  }
  async sendUserReport(record: any, form: any, username: any)
  {
    if(record)
    {
      if(username)
      {
        let message = 
      {
        to : 'rischatdev@gmail.com',
        from : 'rischatdev@gmail.com',
        subject : 'New User Reported',
        body : "Email Address: "+form.value.mail.toLowerCase()+"\nReported Username: "+form.value.usernameControl.trim()+"\nReported Issue: "+form.value.issueControl.trim()+"\n\nBest Regards,\nRIS Chat Team"
      }
      await this.chatUpdate.sendMailForReport(message)
      
      }
      else
      {
        this.helper.presentToast('This username does not exist.')
      }
    }
    else
    {
      this.helper.presentToast('This email does not exist.')
    }
  }
  validationCheck(formControlName: string, num: any) {
    if(num == 1)
    {
      let formControls = this.userForm.controls;
      if (
        !formControls[formControlName].valid &&
        formControls[formControlName].touched
      ) {
        return true;
      } else {
        return false;
      }
    }
    else
    {
      let formControls = this.bugForm.controls;
      if (
        !formControls[formControlName].valid &&
        formControls[formControlName].touched
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

}
