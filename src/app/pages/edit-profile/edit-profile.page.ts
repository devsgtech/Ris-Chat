import { OnInit } from '@angular/core';

import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/database';
import 'firebase/auth';
import * as _ from 'lodash';
import { Platform } from '@ionic/angular';
import { FILE_VAR, IMG, USER_DETAILS, VALIDATION_MSG } from 'src/app/services/constant.service';
import { DatabaseService } from 'src/app/services/database.service';
import { HelperService } from 'src/app/services/helper.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  ngOnInit() {
  }

  img = IMG;
  profileFORM!: FormGroup;
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
  usernameKey : any;
  profile_pic: any;
  disableGrade : boolean = true;
  testVariable : any;
  base64text : any;
  userDetails : any;
  isAndroid : any;
  isIOS: any;
  platform1 : any;
  imageData : any;

  constructor(
    private cdRef: ChangeDetectorRef,
    private platform: Platform,
    private db: DatabaseService,
    private helper: HelperService,
    private auth: AuthenticationService,
    private fb: FormBuilder,) {
      if(this.platform.is('ios'))
      {
        this.platform1 = 'ios'
      }
      else{
        this.platform1 = 'android'
      }
    this.profileform();
    window.addEventListener('keyboardDidShow', (event) => {
      this.hideButtomKeyboardOpen = true;
      this.cdRef.detectChanges(); 
    });
    window.addEventListener('keyboardDidHide', () => {
      this.hideButtomKeyboardOpen = false;
      this.cdRef.detectChanges();
    });
  this.getProfilePhoto()
  }
  
  async getProfilePhoto(){
    this.helper.presentLoading('Please wait')
    this.userDetails = await this.db.getUserData();
    this.users.once('value', async (snapshot) => {
      let item = snapshot.val();
      let keyList : any = [];
      await _.forEach(item, (val, key) => {
        keyList.push(key);
        this.lastRecord = key; 
      })
      await _.forEach(keyList, async (val1, i) => {
        await this.users.child(val1).once('value', async snapShot1 => {
          const ss =  snapShot1.val();
          if(ss.uID.toLowerCase() == this.userDetails.uID.toLowerCase())
          {
            this.recordFoundKey = val1;
          }
          if(this.lastRecord == val1)
          {
            this.users.child(this.recordFoundKey).once('value', async snapShot1 => {
              this.base64text = snapShot1.val().picture.base64;
              this.imageData = snapShot1.val().picture;
            })
            this.helper.dismissLoading(2);
          }
        })
      })
    });
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
  back(){
    this.helper.popPage();
  }
  async getValues(){
    let values: any;
    values = await this.db.getUserData()
    this.profileFORM.controls['first_name'].setValue(values.first_name)
    this.profileFORM.controls['last_name'].setValue(values.lastName)
    this.profileFORM.controls['username'].setValue(values.userName)
    this.profileFORM.controls['email'].setValue(values.email)
    this.profileFORM.controls['phone_number'].setValue(values.phone_number)
    this.profileFORM.controls['gender'].setValue(values.gender)
    this.profileFORM.controls['dob'].setValue(values.dob)
    if(values.grade < 7)
    {
      this.grade = "Grade - "+values.grade;
    }
    else
    {
      if(values.grade == 7)
      this.grade = "Grade - VII";
      if(values.grade == 8)
      this.grade = "Grade - VIII";
      if(values.grade == 9)
      this.grade = "Grade - IX";
      if(values.grade == 10)
      this.grade = "Grade - X";


    }
    this.cdRef.detectChanges();
  }
  pop(){
    this.helper.popPage();
  }
  async profileform(){
    this.profileFORM = this.fb.group({
      first_name: new FormControl("", Validators.compose([Validators.required,Validators.minLength(3)])),
      last_name: new FormControl("", Validators.compose([Validators.required])),
      username: new FormControl("", Validators.compose([Validators.required,Validators.minLength(5)])),
      email: new FormControl("", Validators.compose([Validators.required])),
      phone_number: new FormControl("", Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(11)])),
      gender: new FormControl("", Validators.compose([Validators.required])),
      dob: new FormControl("", Validators.compose([Validators.required, this.dateValidator1()])),
      password: new FormControl("", Validators.compose([Validators.required,Validators.minLength(6)])),
      confirm_password: new FormControl("", Validators.compose([Validators.required,Validators.minLength(6),this.myCustomValidator('password')])),
    }, { 
      validators: this.password.bind(this)
    });
    this.profileFORM.removeControl('password');
    this.profileFORM.removeControl('confirm_password'); 
    this.getValues();
    this.userDetails = await this.db.getUserData();
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
  async upload_photo() {
    let isPhotoAvailable = (this.base64text && this.imageData ) ? true : false;
     this.helper.uploadFile(
      FILE_VAR.JourneyPhotoHintHeader,
      {
        acceptFiles: FILE_VAR.JourneyPhotoFileType,
        maxFileSize: FILE_VAR.JourneyPhotoFileSize,
      },
      1,
      true,
      'Upload Profile Photo',
      isPhotoAvailable
    )
      .then(async (filesP : any) => {
        if(filesP){
          this.base64text = filesP.base64;
          this.imageData = filesP;
        }
        else{
          this.base64text = '';
          this.imageData = '';
        }
      })
      .catch(() => {});
  }
  async checkUserName(){
    this.helper.presentLoading("Please wait")
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
          if(ss.userName == this.profileFORM.value.username)
          {
            if(ss.uID.toLowerCase() !== this.userDetails.uID.toLowerCase())
            {
              this.recordFoundKey = val1;
            }
          }
          if(ss.uID.toLowerCase() == this.userDetails.uID.toLowerCase())
          {
            this.usernameKey = val1;
          }
          if(this.lastRecord == val1)
          {
            if(this.recordFoundKey)
            {
              this.helper.presentToast("This username already exist.",'3000')
              this.helper.dismissLoading(2);
            }
            else
            {
              if(this.usernameKey)
              {
                if(this.profileFORM.value.password)
                {
                  let data = {
                    dob : this.profileFORM.value.dob,
                    email :  this.profileFORM.value.email,
                    first_name : this.profileFORM.value.first_name,
                    gender  :   this.profileFORM.value.gender,
                    last_name  : this.profileFORM.value.last_name,
                    password : this.profileFORM.value.password,
                    phone_number : this.profileFORM.value.phone_number,
                    username : this.profileFORM.value.username,
                    picture : this.imageData,
                  }
                  await this.auth.updateprofile(data,this.usernameKey,4 );
                }
                else{
                  let data = {
                    dob : this.profileFORM.value.dob,
                    email :  this.profileFORM.value.email,
                    first_name : this.profileFORM.value.first_name,
                    gender  :   this.profileFORM.value.gender,
                    last_name  : this.profileFORM.value.last_name,
                    password : '',
                    phone_number : this.profileFORM.value.phone_number,
                    username : this.profileFORM.value.username,
                    picture : this.imageData,
                  }
                  await this.auth.updateprofile(data,this.usernameKey,4 );
                }
                this.helper.dismissLoading(2);
              }
            }
          }
        })
      })
    })
  }
  async updateProfile(){
    this.selectboxtouchgender = true;
    this.recordFoundKey = '';
    this.usernameMatch = false;
    this.valueCheck = false;
    this.emailMatch = false;
    this.usernameMatch = false;
    this.profileFORM.markAllAsTouched();
    this.cdRef.detectChanges(); 
    if(this.profileFORM.valid){
      if(this.userDetails.userName == this.profileFORM.value.username.toLowerCase())
      {
        await this.firebaseCheckData();
      }
      else{
        this.checkUserName();
      }
    }else{
      this.helper.presentToast("Please enter valid fields","2000","top",3);
    }
  }
  async firebaseCheckData(){
    this.recordFoundKey = '';
    this.usernameMatch = false;
    this.helper.presentLoading()
    this.users.once('value', snapshot => {
      let keyList : any = [];
      let item = snapshot.val();
      _.forEach(item, (val, key) => {
        keyList.push(key);
        this.lastRecord = key;
      })
      _.forEach(keyList, (val1, i) => {
         this.users.child(val1).once('value',  async snapShot1 => {
          const ss =  snapShot1.val();
          if(ss.uID.toLowerCase() == this.userDetails.uID.toLowerCase())
          {
            this.recordFoundKey = val1;
            this.usernameMatch = true;
          }
          if(this.lastRecord == val1)
          {
            this.helper.dismissLoading(2);
            if(this.profileFORM.value.password)
            {
              let data = {
                dob : this.profileFORM.value.dob,
                email :  this.profileFORM.value.email,
                first_name : this.profileFORM.value.first_name,
                gender  :   this.profileFORM.value.gender,
                last_name  : this.profileFORM.value.last_name,
                password : this.profileFORM.value.password,
                phone_number : this.profileFORM.value.phone_number,
                username : this.profileFORM.value.username,
                picture : this.imageData,
              }
              await this.auth.updateprofile(data,this.recordFoundKey,2 );
              this.helper.dismissLoading(2);
            }
            else{
              let data = {
                dob : this.profileFORM.value.dob,
                email :  this.profileFORM.value.email,
                first_name : this.profileFORM.value.first_name,
                gender  :   this.profileFORM.value.gender,
                last_name  : this.profileFORM.value.last_name,
                phone_number : this.profileFORM.value.phone_number,
                username : this.profileFORM.value.username,
                picture : this.imageData,
              }
              await this.auth.updateprofile(data,this.recordFoundKey,1 );
              this.helper.dismissLoading(2);
            }
          }
        })
      })
    })
  } 
  deleteImg(){
    this.base64text = '';
    this.imageData = '';
  }
  password(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirm_password')?.value;
    if(password === confirmPassword && password?.length >= 6 && confirmPassword?.length >= 6){
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
  changePswd(event: any){
    if(event.detail.checked)
    {
      this.profileFORM.addControl('password', 
       this.fb.control("", Validators.compose([Validators.required,Validators.minLength(6)])));
      this.profileFORM.addControl('confirm_password',
       this.fb.control("", Validators.compose([Validators.required,Validators.minLength(6),this.myCustomValidator('password')])))
       this.showPasswordField = true;
    }
    else
    {
      this.showPasswordField = false;
      this.profileFORM.removeControl('password');
      this.profileFORM.removeControl('confirm_password');
    }
  }

}
