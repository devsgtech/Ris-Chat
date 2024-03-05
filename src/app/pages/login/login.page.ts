import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IMG, VALIDATION_MSG } from 'src/app/services/constant.service';
import { HelperService } from 'src/app/services/helper.service';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import * as _ from 'lodash';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
img = IMG;
uUsername: string = '';
uPass: string = '';
loginForm!: FormGroup;
errorMessages = VALIDATION_MSG;

users = firebase.database().ref('/UserData/');
lastRecord : any;
usernameMatch : boolean = false;
recordFound : any;
recordFoundKey : any;

  constructor( 
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private db: DatabaseService,
    private helper: HelperService,) {
    this.loginForm = this.fb.group({
      uUsername: new FormControl("", Validators.compose([Validators.required])),
      uPass: new FormControl("", Validators.compose([Validators.required])),
    });
  }
  ngOnInit() {
  }

  ionViewDidLeave(){
    this.loginForm.reset();
  }
 
  async firebaseCheckData(){
    this.helper.presentLoading()
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
          if(ss.userName == this.loginForm.value.uUsername.toLowerCase())
          {
            this.recordFoundKey = val1;
            this.recordFound = ss;
            this.usernameMatch = true;
          }
          if(this.lastRecord == val1)
          {
            await this.auth.signIn(this.usernameMatch,this.recordFound,this.loginForm.value.uPass.toLowerCase(),this.recordFoundKey );
            this.helper.dismissLoading(2);
          }
        })
      })
    })
  } 
  
  async login() {
    this.usernameMatch = false;
    if(this.loginForm.value.uUsername)
    {
      if(this.loginForm.value.uPass)
      {
        await this.firebaseCheckData();
      }
      else
      {
        this.helper.presentToast('Please enter valid password','2000')
      }
    }
    else{
      this.helper.presentToast('Please enter valid username','2000')
    }
  } 
  resetPage(num: any){
    this.helper.pushPage('reset-password',num);
  }
  validationCheck(formControlName: string) {
    let formControls = this.loginForm.controls;
    if (
      !formControls[formControlName].valid &&
      formControls[formControlName].touched
    ) {
      return true;
    } else {
      return false;
    }
  }
  register(){
    this.helper.pushPage('register', "");
  }
  navigate(text :any){
    if(text == 'guideline')
    {
      this.helper.pushPage('guideline','');
    }
    if(text == 'report')
    {
      this.helper.pushPage('report','');
    }
  }
}
