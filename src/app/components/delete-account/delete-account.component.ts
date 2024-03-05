import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss'],
})
export class DeleteAccountComponent  implements OnInit {

  mail: any = '';

  constructor(private modalController : ModalController,
    private helper : HelperService,) { }

  ngOnInit() {}

  async close(action: any) {
    if(action == 1){
        this.modalController.dismiss({
         'success': true,
        });
    this.helper.dismissLoading(2);
    }
    if(action == 0){
      this.modalController.dismiss({
        'success': false,
       });
    }
  }

}
