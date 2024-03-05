import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { HelperService } from 'src/app/services/helper.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-alert-otp',
  templateUrl: './alert-otp.component.html',
  styleUrls: ['./alert-otp.component.scss'],
})
export class AlertOTPComponent  implements OnInit {

  ngOnInit() {}

  otp : any;
  dataGot: any;
  users = firebase.database().ref('/UserData/');
  disableConfirm : boolean = true;

  constructor(private modalController: ModalController,
    private helper : HelperService,
    private nav : NavParams,) {
      this.dataGot = this.nav.get('key');
    }

    changeField(e: any){
      if(this.otp.length == 6)
      {
        this.disableConfirm = false;
      }
      else
      {
        this.disableConfirm = true;
      }
    }

  async close(action: any) {
    if(action == 1){
    this.helper.presentLoading('Validating OTP')
    await this.users.child(this.dataGot).once('value', async snapshot => {
      let item = snapshot.val();
      if(item.confirmation_code == this.otp){
        this.modalController.dismiss({
         'success': true,
        });
      }
      else{
        this.helper.presentToast("The OTP code does not match.",'3000')
      }
    })
    this.helper.dismissLoading(2);
    }
    if(action == 0){
      this.modalController.dismiss({
        'success': false,
       });
    }
  }

}
