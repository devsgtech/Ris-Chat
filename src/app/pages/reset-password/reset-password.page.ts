import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { IMG, VALIDATION_MSG } from 'src/app/services/constant.service';
import { HelperService } from 'src/app/services/helper.service';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import * as _ from 'lodash';
import { ChatStatusUpdateService } from 'src/app/services/chat-status-update.service';
import { ModalController } from '@ionic/angular';
import { AlertOTPComponent } from 'src/app/components/alert-otp/alert-otp.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  img = IMG;
  mail: string = '';
  uUsername: string = '';
  selected : boolean = false;
  btnText = 'Next'
  disableUsername : boolean = true;
  mailpswd : string = '';
  resetForm!: FormGroup;
  resetPassword!: FormGroup;
  lastRecord : any;
  mailFoundKey : any;
  recordFoundKey : any;
  recordFound : boolean = false;
  usernameMatch : any;
  errorMessages = VALIDATION_MSG;
  users = firebase.database().ref('/UserData/');
  dataRecieve : any;

  constructor(
    private auth : AuthenticationService,
    private helper : HelperService,
    private chatUpdate: ChatStatusUpdateService,
    private modalController: ModalController,
    private fb: FormBuilder,
  ) { 
    this.dataRecieve = this.helper.getNavData();
    if(this.dataRecieve == 1){
      this.selected = false;
    }
    else{
      this.selected = true;
    }
    this.resetForm = this.fb.group({
      mail: new FormControl("",Validators.compose([Validators.required,])),
      uUsername: new FormControl("",Validators.compose([Validators.required,Validators.minLength(5)])),
    });
    this.resetForm.removeControl('uUsername');
    this.resetPassword = this.fb.group({
      mailpswd: new FormControl("",Validators.compose([Validators.required,Validators.minLength(6)]))
    });
  }
  ngOnInit() {

  }

  change(){
    this.selected = !this.selected;
    this.resetPassword.reset();
    this.resetForm.reset();
    this.mail = '';
    this.disableUsername = true;
    if(this.selected)
    {
      this.resetPassword.addControl('mailpswd', this.fb.control("", Validators.compose([Validators.required,Validators.minLength(5)])));
    }
  }
  async checkEmail(){
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
          if(ss.email == this.resetForm.value.mail.toLowerCase())
          {
            this.recordFoundKey = val1;
          }
          if(this.lastRecord == val1)
          {
            await this.sendOtpMail(this.recordFoundKey, this.usernameMatch)
            
          }
        })
      })
    })
  }
  async checkUsername(){
    this.recordFound = false;
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
          if(ss.userName == this.resetForm.value.uUsername.toLowerCase())
          {
            this.recordFound = true;
            this.recordFoundKey = val1;
          }
          if(ss.email == this.resetForm.value.mail.toLowerCase())
          {
            this.mailFoundKey = val1;
          }
          if(this.lastRecord == val1)
          {
            await this.updateUserName(this.recordFound,this.recordFoundKey, this.mailFoundKey)
          }
        })
      })
    })
  }
  updateUserName(record: any, key : any, username : any){
    if(!record)
    {
      this.users.child(username).update({
      userName: this.resetForm.value.uUsername,
      })
      this.helper.pushRootPage('login','')
      this.helper.presentToast("The Username has been updated successfully.",'3000','top',2); 
        
    }
    else{
      this.helper.presentToast("This username already exists.",'3000','top');
    }
  } 
  async reset(){
    this.resetForm.markAllAsTouched();
      if(this.resetForm.valid){
        this.recordFoundKey = "";
        this.usernameMatch = false;
        this.helper.presentLoading();
        if(!this.disableUsername)
        {
          await this.checkUsername()
        }
        else{
          await this.checkEmail();
        }
        this.helper.dismissLoading(2);
      }else{
        this.helper.presentToast("Please enter valid fields","2000","top",3);
      }
  }
  async sendOtpMail(key : any, username : any){
    let number = await this.generateRandomNumber()
    if(key){
        this.users.child(key).update({ confirmation_code : number })
      let message = 
      {
        to : this.resetForm.value.mail,
        from : 'rischatdev@gmail.com',
        subject : 'OTP for username reset',
        body : "Your username reset request is received. Please use "+number+" code to reset your username securely. Thank you for choosing our service."
      }
      await this.chatUpdate.sendMail(message)
        this.confirmOtpMail(key)
    }
    else{
      this.helper.presentToast("This E-mail does not exist.")
    }
  }
  pop() {
    this.helper.popPage();
  }
  async confirmOtpMail(key: any){
    const modal = await this.modalController.create({
      component: AlertOTPComponent,
      componentProps: {
        key : key
      },
      cssClass: 'custom-alert',
      backdropDismiss: false,
    });

    modal.onDidDismiss().then(async (result) => {
        let otp = result.data.success
        if(otp){
          this.disableUsername = false;
          this.resetForm.addControl('uUsername', this.fb.control("", Validators.compose([Validators.required,Validators.minLength(5)])));
        }
    });

    return await modal.present();
  }
  validationCheck(formControlName: string) {
    let formControls = this.resetForm.controls;
    if (
      !formControls[formControlName].valid &&
      formControls[formControlName].touched
    ) {
      return true;
    } else {
      return false;
    }
  }
  validationCheck1(formControlName: string) {
    let formControls = this.resetPassword.controls;
    if (
      !formControls[formControlName].valid &&
      formControls[formControlName].touched
    ) {
      return true;
    } else {
      return false;
    }
  }
  async storeCode(){
    this.helper.presentLoading('Please wait');
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
          if(ss.email == this.resetPassword.value.mailpswd.toLowerCase())
          {
            this.recordFoundKey = val1;
          }
          if(this.lastRecord == val1)
          {
            await this.sendCode(this.recordFoundKey, this.resetPassword.value.mailpswd);
            this.helper.dismissLoading(2);
          }
        })
      })
    })
  }
  async sendCode(key: any, mail: any){
    let number = await this.generateRandomNumber()
    if(key){
        this.users.child(key).update({ confirmation_code : number })
      let message = 
      {
        to : mail,
        from : 'rischatdev@gmail.com',
        subject : 'OTP for password reset',
        body : "Your password reset request is received. Please use "+number+" code to reset your password securely. Thank you for choosing our service."
      }
      await this.chatUpdate.sendMail(message)
        this.getOtpConfirm(key)
    }
    else{
      this.helper.presentToast("This E-mail does not exists.")
    }
  }
  async getOtpConfirm(key: any){
    const modal = await this.modalController.create({
      component: AlertOTPComponent,
      componentProps: {
        key : key
      },
      cssClass: 'custom-alert',
      backdropDismiss: false,
    });

    modal.onDidDismiss().then(async (result) => {
        let otp = result.data.success
        if(otp){
          this.helper.pushPage('password-confirmation',key);
        }
    });

    return await modal.present();
  }
  async nextPasswordConfirmation(){
    this.resetPassword.markAllAsTouched();
    if(this.resetPassword.valid){
      this.storeCode()
    }
    else{
      this.helper.presentToast("Please enter valid fields","2000","top",3);
    }
  }
  generateRandomNumber(){
   return Math.floor(100000 + Math.random() * 900000);
  }

}
