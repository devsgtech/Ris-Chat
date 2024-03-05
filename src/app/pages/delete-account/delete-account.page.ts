import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { DeleteAccountComponent } from 'src/app/components/delete-account/delete-account.component';
import { IMG, VALIDATION_MSG } from 'src/app/services/constant.service';
import { DatabaseService } from 'src/app/services/database.service';
import { HelperService } from 'src/app/services/helper.service';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import * as _ from 'lodash';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.page.html',
  styleUrls: ['./delete-account.page.scss'],
})
export class DeleteAccountPage implements OnInit {

  deleteForm : any;
  errorMessages = VALIDATION_MSG;
  img = IMG;
  mail: string = '';
  grade : any;
  chatID: any = [];
  userData: any;
  lastRecord: any;
  recordFound: any;
  recordFoundKey: any;
  usernameMatch: any;
  hideButtomKeyboardOpen = false;
  gradeRef = firebase.database().ref('/Groups/Grades/');
  users = firebase.database().ref('/UserData/');
  deletedAccounts = firebase.database().ref('/DeletedUser/accounts/');

  constructor(private fb: FormBuilder,
    private auth: AuthenticationService,
    private db: DatabaseService,
    private cdRef: ChangeDetectorRef,
    private modalController : ModalController,
    private platform: Platform,
    private helper: HelperService,) {
      this.prepareForm();
    this.platform.ready().then(async () => {
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

  back(){
    this.helper.popPage();
  }

  ngOnInit() {

  }

  async prepareForm(){
    this.deleteForm = this.fb.group({
      mail: new FormControl("",Validators.compose([Validators.required])),
      reason: new FormControl("",Validators.compose([Validators.required,Validators.minLength(10)])),
      username: new FormControl("",Validators.compose([Validators.required,Validators.minLength(5)])),
    }); 
    this.userData = await this.db.getUserData()
  }

  validationCheck(formControlName: string) {
    let formControls = this.deleteForm.controls;
      if (
        !formControls[formControlName].valid &&
        formControls[formControlName].touched
      ) {
        return true;
      } else {
        return false;
      }
  }

  async delete(){
    this.deleteForm.markAllAsTouched();
    this.usernameMatch = false;
    this.recordFoundKey = '';
    this.recordFound = '';
    if(this.deleteForm.valid)
    {
        const modal = await this.modalController.create({
        component: DeleteAccountComponent,
        cssClass: 'delete-alert',
        backdropDismiss: false,
      });
  
      modal.onDidDismiss().then(async (result) => {
          let confirm = result.data.success
          if(confirm){
            this.validateDetails();
          }
      });
      return await modal.present();
    }
    else{
      this.helper.presentToast("Please enter valid fields","2000","top",3);
    }
  }

  async validateDetails(){
    this.helper.presentLoading('Validating Details')
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
          if(ss.email == this.deleteForm.value.mail.toLowerCase())
          {
            this.recordFoundKey = val1;
            this.recordFound = ss;

            if(ss.userName == this.deleteForm.value.username.toLowerCase())
            {
              this.usernameMatch = true;
            }
            else
            {
              this.helper.presentToast('This username does not match','3000');
              this.helper.dismissLoading(2);
              return;
            }
          }
          if(this.lastRecord == val1)
          {
            this.storeReason(this.recordFoundKey, this.recordFound, this.usernameMatch);
            this.helper.dismissLoading(2);
          }
        })
      })
    })
  }

  storeReason(key: any, record: any, username: any){
    if(record){
      this.deletedAccounts.push({ 
        mail: this.deleteForm.value.mail.toLowerCase(),
        username: this.deleteForm.value.username.toLowerCase(),
        reason: this.deleteForm.value.reason.toLowerCase(),
      })
      this.deleteData();
    }
    else{
      this.helper.presentToast('This Email address does not exist','3000');
    }
  }

  getData(){
    this.chatID.push({ id : '1001', name : 'Whole School' })                                 
    this.grade = this.userData.grade;                                                  
    this.gradeRef.child('Grade-'+this.grade).once('value', async snapshot => {
      let gradeID = snapshot.val().groupID;
      this.chatID.push({ id : gradeID.toString(), name : 'Grade-'+this.grade });
    })
    return this.chatID;
  }

  async deleteData(){
    let data = await this.getData();
    await this.users.once('value', async snapshot => {
      let item = snapshot.val();
      await _.forEach(item, async (val ,key) => {  
        if(val.userName == this.userData.userName)
        {
          await this.auth.deleteAccount(this.userData,key,data);
          return;
        }
      })
    })
  }

}
