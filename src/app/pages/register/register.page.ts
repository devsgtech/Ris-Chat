import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NavController, Platform } from '@ionic/angular';
import { IMG, VALIDATION_MSG } from 'src/app/services/constant.service';
import { HelperService } from 'src/app/services/helper.service';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import * as _ from 'lodash';
import { AuthenticationService } from 'src/app/services/authentication.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  img = IMG;
  profileFORM!: FormGroup;
  errorMessages = VALIDATION_MSG;
  selectboxtouchgender! :Boolean;
  selectboxtouchgrade! :Boolean;
  hideButtomKeyboardOpen = false;
  users = firebase.database().ref('/UserData/');
  valueCheck : boolean = false;
  lastRecord : any;
  emailMatch : boolean = false;
  usernameMatch : boolean = false;
  platform1 : any;
  Grades = [
    {value : 1,grade : 'Grade 1'},
    {value : 2,grade : 'Grade 2'},
    {value : 3,grade : 'Grade 3'},
    {value : 4,grade : 'Grade 4'},
    {value : 5,grade : 'Grade 5'},
    {value : 6,grade : 'Grade 6'},
    {value : 7,grade : 'Grade VII'},
    {value : 8,grade : 'Grade VIII'},
    {value : 9,grade : 'Grade IX'},
    {value : 10,grade : 'Grade X'}
  ]

  constructor(private navCtrl: NavController,
    private auth: AuthenticationService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private platform : Platform,
    private helper: HelperService) {
    this.profileform();
    this.platform1 = platform;
    window.addEventListener('keyboardDidShow', (event) => {
      this.hideButtomKeyboardOpen = true;
      this.cdRef.detectChanges();
  });

  window.addEventListener('keyboardDidHide', () => {
    this.hideButtomKeyboardOpen = false;
    this.cdRef.detectChanges();
  });
  }
  ngOnInit() {

  }
  profileform(){
    console.log("NEW CHANGES UPDATED NOW 15:")
    this.profileFORM = this.fb.group({
      first_name: new FormControl("", Validators.compose([Validators.required,Validators.minLength(3)])),
      last_name: new FormControl("", Validators.compose([Validators.required])),
      username: new FormControl("", Validators.compose([Validators.required,Validators.minLength(5)])),
      email: new FormControl("", Validators.compose([Validators.required])),
      phone_number: new FormControl("", Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(11)])),
      gender: new FormControl("", Validators.compose([Validators.required])),
      dob: new FormControl("", Validators.compose([Validators.required, this.dateValidator1()])),
      grade: new FormControl("", Validators.compose([Validators.required])),
      password: new FormControl("", Validators.compose([Validators.required,Validators.minLength(6)])),
      confirm_password: new FormControl("", Validators.compose([Validators.required,Validators.minLength(6),this.myCustomValidator('password')])),
    }, { 
      validators: this.password.bind(this)
    });
  }
  myCustomValidator(fieldNameOrVal:any, valType = 'equalTo'): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const input = control.value;
      const isValid = (valType === 'equalTo') ? (control.root.value[fieldNameOrVal] === input) : (valType === 'greaterThan') ? (input > fieldNameOrVal) : (valType === 'lessThan') ? (input < fieldNameOrVal) : false;
      if (!isValid) {
        return {[valType]: {isValid}};
      } else {
        return {[valType]: null};
      }
    };
  }
  clearconfirmpass(){
    this.profileFORM.controls['confirm_password'].setValue('');
  }
  async updateProfile(){
    this.selectboxtouchgender = true;
    this.selectboxtouchgrade = true;
    this.valueCheck = false;
    this.emailMatch = false;
    this.usernameMatch = false;
    this.profileFORM.markAllAsTouched();
    this.cdRef.detectChanges();
    if(this.profileFORM.valid){
      await this.checkFirstTimeUser();
    }else{
      this.helper.presentToast("Please enter valid fields","2000","top",3);
    }
  }
  dateValidator1(fieldNameOrVal ?: any, valType = 'equalTo'): ValidatorFn {
   
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      if (selectedDate > today) {
        return { futureDate: true };
      }
      return null;
    };
  }
  ionViewDidLeave(){
    this.valueCheck = false;
  }
  async checkFirstTimeUser(){
    this.helper.presentLoading("Please Wait")
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
          if(ss.userName == this.profileFORM.value.username.toLowerCase())
          {
            this.valueCheck = true;
            this.usernameMatch = true;
          }
          if(ss.email == this.profileFORM.value.email.toLowerCase())
          {
            this.valueCheck = true;
            this.emailMatch = true;
          }
          if(this.lastRecord == val1)
          {
            if(ss.userName == this.profileFORM.value.username.toLowerCase())
            {
              this.helper.dismissLoading(2);
              this.helper.presentToast("This username already exists. ","2000");
            }
            else if(ss.email == this.profileFORM.value.email.toLowerCase())
              {
                this.helper.dismissLoading(2);
                this.helper.presentToast("This E-mail already exists. ","2000");
              }
            else{
              await this.auth.createUser(this.valueCheck,this.profileFORM.value,this.usernameMatch);
              this.helper.dismissLoading(2);
            }
          }
        })
      })
    })
  }
  back(){
    this.navCtrl.back();
  }
  password(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirm_password')?.value;
    if(password === confirmPassword && password.length >= 6 && confirmPassword.length >= 6){
      formGroup.controls['confirm_password'].setErrors(null);
    }
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }
  forfontgender(){
    if(this.profileFORM.get('gender')?.value == undefined){
      this.profileFORM.controls['gender'].setValue('');
    }
    if(this.platform.is('ios')){
      if(this.selectboxtouchgender){
        if(this.profileFORM.get('gender')?.value == ''){return "iosinvalid";}
        else{return "iosvalid";}
      }else{return "iosvalid";}
    }else{
      if(this.selectboxtouchgender){
        if(this.profileFORM.get('gender')?.value == ''){return "androidinvalid";}
        else{return "androidvalid";}
      }else{return "androidvalid";}
    }
  }
  forfontgrade(){
    if(this.profileFORM.get('grade')?.value == undefined){
      this.profileFORM.controls['grade'].setValue('');
    }
    if(this.platform.is('ios')){
      if(this.selectboxtouchgrade){
        if(this.profileFORM.get('grade')?.value == ''){return "iosinvalid";}
        else{return "iosvalid";}
      }else{return "iosvalid";}
    }else{
      if(this.selectboxtouchgrade){
        if(this.profileFORM.get('grade')?.value == ''){return "androidinvalid";}
        else{return "androidvalid";}
      }else{return "androidvalid";}
    }
  }
}
