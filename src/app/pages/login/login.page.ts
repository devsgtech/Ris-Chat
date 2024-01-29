import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IMG, VALIDATION_MSG } from 'src/app/services/constant.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
img = IMG;
uUsername: string = "";
uPass: string = "";
loginForm!: FormGroup;
errorMessages = VALIDATION_MSG;
  constructor(
    private fb: FormBuilder,
    private helper: HelperService,) {
    this.loginForm = this.fb.group({
      uUsername: new FormControl("", Validators.compose([Validators.required])),
      uPass: new FormControl("", Validators.compose([Validators.required])),
    });
   }

  ngOnInit() {
  }
  login() {
    console.log("wertyui")
  }
  forgot_pass(){

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
}
