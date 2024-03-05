import { Injectable } from '@angular/core';
import { USER_DETAILS, VARS } from './constant.service';
import { Storage } from '@ionic/storage';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor( 
    private storage : Storage,
    private helper : HelperService,) { 

  }

  setUserData(userData: any) {
    return new Promise(async (resolve, reject) => {
      this.storage.create();
      this.storage.set(VARS.USER_DATA, userData).then(() => {
        this.setUserDetails(userData);
        resolve(userData);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  async setUserDetails(userDetails: any){
    USER_DETAILS.DATA = userDetails;
  }

  async getUserData() {
    this.storage.create();
    return new Promise((resolve, reject) => {
      this.storage.get(VARS.USER_DATA).then((value) => {
        resolve(value);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  async setLoggedInStatus(value: any){
    this.storage.create();
    this.storage.set(VARS.IS_USER_LOGGED_IN, value);
  }

  getLoggedInStatus(){
    this.storage.create();
    return new Promise((resolve, reject) => {
      this.storage.get(VARS.IS_USER_LOGGED_IN).then((value) => {
        resolve(value);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  clearStorage() {
    return new Promise((resolve, reject) => {
      this.storage.remove(VARS.USER_DATA).then(() => {
        resolve(true);
      }).catch((error) => {
        this.helper.presentToast('Something is wrong with clearing storage');
        reject(error);
      });
    });
  }
  
}
