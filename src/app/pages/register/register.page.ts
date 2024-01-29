import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NavController, Platform } from '@ionic/angular';
import { IMG, VALIDATION_MSG } from 'src/app/services/constant.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  img = IMG;
  profileFORM!: FormGroup;
  errorMessages = VALIDATION_MSG;
  selectboxtouch! :Boolean;
  hideButtomKeyboardOpen = false;
  constructor(private navCtrl: NavController,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private platform : Platform,
    private helper: HelperService) {
      // this.selectboxvalid = true;
    this.profileform();

    window.addEventListener('keyboardDidShow', (event) => {
      this.hideButtomKeyboardOpen = true;
      this.cdRef.detectChanges();
      console.log("oppeennnnn");
  });

  window.addEventListener('keyboardDidHide', () => {
    this.hideButtomKeyboardOpen = false;
    this.cdRef.detectChanges();
    console.log("HHIIDDEEE");
    // Describe your logic which will be run each time keyboard is closed.
  });
   }

  ngOnInit() {
  }
  profileform(){
    this.profileFORM = this.fb.group({
      first_name: new FormControl("", Validators.compose([Validators.required,Validators.minLength(3)])),
      last_name: new FormControl("", Validators.compose([Validators.required])),
      username: new FormControl("", Validators.compose([Validators.required,Validators.minLength(5)])),
      email: new FormControl("", Validators.compose([Validators.required])),
      phone_number: new FormControl("", Validators.compose([Validators.required,Validators.minLength(9),Validators.maxLength(10)])),
      gender: new FormControl("", Validators.compose([Validators.required])),
      dob: new FormControl("", Validators.compose([Validators.required])),
      password: new FormControl("", Validators.compose([Validators.required,Validators.minLength(6)])),
      confirm_password: new FormControl("", Validators.compose([Validators.required,Validators.minLength(6),this.myCustomValidator('password')])),
    }, { 
      validators: this.password.bind(this)
    });

    // this.profileFORM.controls['first_name'].setValue('karanpreet');
    // this.profileFORM.controls['last_name'].setValue('Singh');
    // this.profileFORM.controls['username'].setValue('karan1104');
    // this.profileFORM.controls['email'].setValue('karanroxx1104@gmail.com');
    // this.profileFORM.controls['phone_number'].setValue('9876200895');
    // this.profileFORM.controls['gender'].setValue('male');
    // this.profileFORM.controls['dob'].setValue('2000-04-11');
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
  updateProfile(){
    // this.selectbox();
    this.selectboxtouch = true;
    this.profileFORM.markAllAsTouched();
    console.log("this.profileForm.valid",this.profileFORM.valid);
    console.log("this.profileForm.validetgfd",this.profileFORM);
    this.cdRef.detectChanges();
    if(this.profileFORM.valid){
      this.helper.presentToast("Account creted Successfully","2000","top",2);
    }else{
      this.helper.presentToast("Please enter valid fields","2000","top",3);
    }

    // formData.append('user_api_token', USER_DETAILS.DATA.data.api_token);
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
  // selectbox(){
  //   console.log("wertyui333333")
  //   this.selectboxvalid =  this.profileFORM.get('gender')?.value == '' ? true: false;
  // }
  forfont(){
    if(this.platform.is('ios')){
      if(this.selectboxtouch){
        if(this.profileFORM.get('gender')?.value == ''){return "iosinvalid";}
        else{return "iosvalid";}
      }else{return "iosvalid";}
    }else{
      if(this.selectboxtouch){
        if(this.profileFORM.get('gender')?.value == ''){return "androidinvalid";}
        else{return "androidvalid";}
      }else{return "androidvalid";}
    }
  }
}
