import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, NavController, ToastController } from '@ionic/angular';
import * as _ from "lodash";
import { FILE_VAR } from './constant.service';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  toast: any;
  loading: any;
  alertEl: any;
  constructor(private navController: NavController,
    private loadingController: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController) { }


  pushRootPage(page:any, navData :any) {
    return new Promise((resolve) => {
      navData ? this.navController.navigateRoot(page, { state: navData }).then(() => {
        return resolve(true);
      }).catch((error) => {
        return resolve(false);
      }) : this.navController.navigateRoot(page).then(() => {
        return resolve(true);
      }).catch((error) => {
        return resolve(false);
      });
    });
  }
  pushPage(page:any, navData :any) {
    return new Promise(resolve => {
      navData ? this.navController.navigateForward(page, {state: navData }).then(() => {
        return resolve(true);
      }).catch((e) => {
        return resolve(false);
      }) : this.navController.navigateForward(page).then(() => {
        return resolve(true);
      }).catch((e) => {
        return resolve(false);
      });
    });
  }
  popPage() {
    return new Promise((resolve) => {
      this.navController.pop().then(() => {
          return resolve(true);
      })
      .catch((e) => {
        return resolve(false);
      });
    });
  }
  getNavData() {
    let data: any;
    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        data = this.router.getCurrentNavigation()?.extras.state;
      }
    });
    return data;
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
  async presentLoading(msg: string = 'Please wait...', customCssClass: string = 'loading') {
    this.dismissLoading();
    const loading = await this.loadingController.create({
      cssClass: customCssClass,
      message: msg,
      spinner: 'bubbles',
      mode: 'ios',
      translucent: true
    });
    await loading.present();
  }
  dismissLoading(type = 0) {
    if (!type) {
      try {
        if (this.loading) {
          this.loading.dismiss().catch(() => {});
        }
      } catch (e) {}
    }
    if (type === 1) {
      try {
        this.alertEl.dismiss().catch(() => {});
      } catch (e) {}
    }
    if (type === 2) {
      try {
        if (this.loadingController) {
          this.loadingController.dismiss().catch(() => {});
        }
      } catch (e) {}
    }
  }
  uploadFile(subHeader: any = FILE_VAR.SUB_HEADER, 
    otherOptions: any = {},
     multipleSelect: number = FILE_VAR.MULTIPLE_SELECT_DEFAULT,
      chooseFile = false, title = 'Upload File(s)',
       isRemove = false, cancelText = 'Cancel',
        isPhoto = true, downloadFileUrl = null,
         downloadTitle = null,chooseFromgallery=true , ) {
            if (!Object.keys(otherOptions).length) {
              otherOptions.acceptFiles = FILE_VAR.ALLOWED_FILE_TYPE;
              otherOptions.maxFileSize = FILE_VAR.MAX_FILE_SIZE_DEFAULT;
            }
            return new Promise(async (resolve, reject) => {
              const buttonsArray: any = [];
              if (isRemove) {
                buttonsArray.push({
                  icon: 'trash',
                  cssClass: 'iconRed',
                  text: 'Remove photo',
                  handler: () => {
                    return resolve(false);
                  }
                });
              }
              if (isPhoto) {
                buttonsArray.push({
                  icon: 'camera',
                  cssClass: 'icon',
                  text: 'Take a photo',
                  handler: () => {
                    const options: CameraOptions = {
                      quality: 100,
                      destinationType: this.camera.DestinationType.DATA_URL,
                      encodingType: this.camera.EncodingType.PNG,
                      mediaType: this.camera.MediaType.PICTURE,
                      correctOrientation: true,
                      targetWidth: 720,
                      targetHeight: 720
                    };
                    try {
                      this.camera.getPicture(options).then((base64: any) => {
                        var obj = {base64: "data: image/png; base64,"+base64};
                        return resolve(obj);
                      }).catch((e) => {});
                    } catch (e) {}
                  }
                });
                if(chooseFromgallery){
                    buttonsArray.push({
                      icon: 'images',
                      cssClass: 'icon',
                      text: 'Choose from gallery',
                      handler: () => {
                        const options: CameraOptions = {
                          quality: 100,
                          destinationType: this.camera.DestinationType.DATA_URL,
                          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                          encodingType: this.camera.EncodingType.PNG,
                          mediaType: this.camera.MediaType.PICTURE,
                          targetWidth: 720,
                          targetHeight: 720
                        };
                        try {
                          this.camera.getPicture(options).then((base64: any) => {
                            var obj = {base64: "data: image/png; base64,"+base64};
                            return resolve(obj);
                            }).catch((e) => { });
                          } catch (e) {}
                      }
                    });
                }
              }
              buttonsArray.push({
                icon: 'close',
                cssClass: 'icon',
                text: cancelText,
                role: 'cancel',
                handler: () => {
                  return reject('Canceled');
                }
              });
              const actionSheet = await this.actionSheetCtrl.create({
                header: title,
                subHeader,
                buttons: buttonsArray,
                cssClass:'action-sheet'
              });
              setTimeout(async () => {
                await actionSheet.present();
              }, 200);
            });
  }
}
