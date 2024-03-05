import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { IMG, VALIDATION_MSG } from 'src/app/services/constant.service';
import { HelperService } from 'src/app/services/helper.service';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import * as _ from 'lodash';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
@Component({
  selector: 'app-password-confirmation',
  templateUrl: './password-confirmation.page.html',
  styleUrls: ['./password-confirmation.page.scss'],
})
export class PasswordConfirmationPage implements OnInit {

  img = IMG;
  recordFoundKey: any;
  key : any;
  lastRecord : any;
  resetForm!: FormGroup;
  errorMessages = VALIDATION_MSG;
  users = firebase.database().ref('/UserData/');

  constructor(
    private auth : AuthenticationService,
    private helper : HelperService,
    private fb: FormBuilder,
  ) {
    this.key = this.helper.getNavData()
    this.resetForm = this.fb.group({
      password: new FormControl("", Validators.compose([Validators.required,Validators.minLength(6)])),
      confirm_password: new FormControl("", Validators.compose([Validators.required,Validators.minLength(6),this.myCustomValidator('password')])),
    }, { 
      validators : this.password.bind(this)
    });
   }
  ngOnInit() {

  }
  back(){
    this.helper.popPage();
  }
  password(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirm_password')?.value;
    if(password === confirmPassword && password.length >= 6 && confirmPassword.length >= 6){
      formGroup.controls['confirm_password'].setErrors(null);
    }
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }
  async reset(){
    if(this.resetForm.valid){
      await this.auth.updateprofile(this.resetForm.value,this.key,3 );
      this.helper.pushRootPage('login','');
    }
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
  clearconfirmpass(){
    this.resetForm.controls['confirm_password'].setValue('');
  }

}
