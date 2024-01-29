import { Injectable } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  toast: any;
  loading: any;
  alertEl: any;
  constructor(private navController: NavController,
    private toastCtrl: ToastController) { }


  pushRootPage(page:any, navData :any) {
    return new Promise((resolve) => {
      navData ? this.navController.navigateRoot(page, { state: navData }).then(() => {
        return resolve(true);
      }).catch((error) => {
        // console.log('ePage', error);
        return resolve(false);
      }) : this.navController.navigateRoot(page).then(() => {
        return resolve(true);
      }).catch((error) => {
        // console.log('ePage', error);
        return resolve(false);
      });
    });
  }
  pushPage(page:any, navData :any) {
    return new Promise(resolve => {
      navData ? this.navController.navigateForward(page, {state: navData }).then(() => {
        return resolve(true);
      }).catch((e) => {
        console.log('Page push error - ', e);
        return resolve(false);
      }) : this.navController.navigateForward(page).then(() => {
        return resolve(true);
      }).catch((e) => {
        console.log('Page push error - ', e);
        return resolve(false);
      });
    });
  }

  async presentToast(msg: any,dur = "1000",pos = "top",workInProgress = 0) {
    if (msg) {
      let COLOR;
      if (workInProgress == 1) {COLOR = "primary";}
      else if (workInProgress == 2) {COLOR = "success";}
      else if (workInProgress == 3) {COLOR = "warning" }
      this.dismissLoading();
      try {
        this.toastCtrl.dismiss().catch(() => {});
      } catch (e) {}
      this.toast = await this.toastCtrl.create({
        message: msg,
        duration: _.toNumber(dur),
        position:
          pos === "center" ? "middle" : pos === "bottom" ? "bottom" : "top",
        color: COLOR,
        mode: "ios",
      });
      return await this.toast.present();
    }
  }
  dismissLoading(type = 0) {
    if (!type) {
      try {
        if (this.loading) {
          this.loading.dismiss().catch(() => {});
        }
      } catch (e) {}
    } else if (type === 1) {
      try {
        this.alertEl.dismiss().catch(() => {});
      } catch (e) {}
    }
  }
}
