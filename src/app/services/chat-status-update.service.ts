import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { ModalController } from '@ionic/angular';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})

export class ChatStatusUpdateService {

  tokenUpdation = firebase.database().ref('/TokenUpdation/');
  private mutationObserver!: MutationObserver;

  constructor(
    private http: HttpClient,
    private helper: HelperService,
    private modal : ModalController, ) { 
  }

  async scrollToBottomMutation(contentEle: any, targetNode: any) {
    try {
      this.mutationObserver = new MutationObserver((mutations) => {
        contentEle.scrollToBottom();
      });
      this.mutationObserver?.observe(targetNode, { attributes: true, childList: true, subtree: true });
    } catch (e) {}
  }

  snapshotToArray = (snapshot: any) => {
    const returnArr: any = [];
    const item = snapshot.val();
    if (item) {
      _.forEach(item, childSnapshot => {
        returnArr.push(childSnapshot);
      });
    }
    return returnArr;
  }

  async sendMail(message: any){
    let messageParts = [ 
      `To: ${message.to}`,
      `From: ${message.from}`,
      `Subject: ${message.subject}`,
      '',
      message.body
    ];
    let messageRaw = btoa(messageParts.join('\n'));
    let http = new XMLHttpRequest();
    let url = 'https://www.googleapis.com/gmail/v1/users/me/messages/send';
    let accessToken = await this.getAccessToken();
    let messageData = JSON.stringify({
      raw: messageRaw
    });
    http.open('POST', url, true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    http.send(messageData);
    http.onreadystatechange = async (res) => {
      if (http.readyState === 4) {
          if (http.status === 401) {
            await this.refreshToken(message);
          }
        }
    }
  }

  async sendMailForReport(message: any){
    let messageParts = [ 
      `To: ${message.to}`,
      `From: ${message.from}`,
      `Subject: ${message.subject}`,
      '',
      message.body
    ];
    let messageRaw = btoa(messageParts.join('\n'));
    let http = new XMLHttpRequest();
    let url = 'https://www.googleapis.com/gmail/v1/users/me/messages/send';
    let accessToken = await this.getAccessToken();
    let messageData = JSON.stringify({
      raw: messageRaw
    });
    http.open('POST', url, true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    http.send(messageData);
    http.onreadystatechange = async (res) => {
      if (http.readyState === 4) {
        if (http.status === 200) 
        {
          this.helper.presentToast('Thank you for reporting. We will take a look into your report as soon as possible.','2000','top',2)
          this.helper.popPage();
        } 
        else 
        {
          if (http.status === 401) {
            await this.refreshTokenForReport(message);
          }
        }
      }
    }
  }

  async refreshTokenForReport(msg: any){
    let clientSecret;
    try {
      clientSecret = await this.getClientSecret();
    } catch (error) {
    }
    
    let url = 'https://oauth2.googleapis.com/token';
    let clientId = '879444462671-tjkbgm6t5f6g61q6dqnvptk64chcfl8c.apps.googleusercontent.com';
    let refreshToken = await this.getRefreshToken();
    
    let redirectUri = 'http://localhost/gmail.php';
    let body = `client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${refreshToken}&redirect_uri=${encodeURIComponent(redirectUri)}&grant_type=refresh_token&access_type=offline`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    this.http.post(url, body, { headers }).subscribe(
      async (response : any ) => {
        let res = response;
        if(res.error)
        {
          this.helper.presentToast(res.error_description,"3000");
        }
        if(res.access_token)
        {
          try {
            let token = await this.getAccessToken();
            if (token !== res.access_token) {
                this.updateAccessTokenForReport(res.access_token, msg);
            }
          } catch (error) {
          }
        }
      },
      (error) => {
      }
    );
  }

  async updateAccessTokenForReport(token : any, msg : any){
    if(token)
    {
      await this.tokenUpdation.child('accessToken').update({
        token: token
      })
      this.sendMailForReport(msg)
    }
  }

  async refreshToken(msg: any){
    let clientSecret;
    try {
      clientSecret = await this.getClientSecret();
    } catch (error) {
    }
    
    let url = 'https://oauth2.googleapis.com/token';
    let clientId = '879444462671-tjkbgm6t5f6g61q6dqnvptk64chcfl8c.apps.googleusercontent.com';
    let refreshToken = await this.getRefreshToken();
    
    let redirectUri = 'http://localhost/gmail.php';
    let body = `client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${refreshToken}&redirect_uri=${encodeURIComponent(redirectUri)}&grant_type=refresh_token&access_type=offline`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    this.http.post(url, body, { headers }).subscribe(
      async (response : any ) => {
        let res = response;
        if(res.error)
        {
          this.helper.presentToast(res.error_description,"3000");
          this.modal.dismiss();
        }
        if(res.access_token)
        {
          try {
            let token = await this.getAccessToken();
            if (token !== res.access_token) {
                this.updateAccessToken(res.access_token, msg);
            }
          } catch (error) {
          }
        }
      },
      (error) => {
      }
    );
  }

  async updateAccessToken(token : any, msg : any){
    if(token)
    {
      await this.tokenUpdation.child('accessToken').update({
        token: token
      })
      this.sendMail(msg)
    }
  }

  async getRefreshToken(){
    return new Promise((resolve, reject) => {
      this.tokenUpdation.child('refreshToken').once('value', snapshot => {
        let item = snapshot.val();
        resolve(item.token);
      }, error => {
        reject(error);
      });
    });
  }

  async getClientSecret(){
    return new Promise((resolve, reject) => {
      this.tokenUpdation.child('clientSecret').once('value', snapshot => {
        let item = snapshot.val();
        resolve(item.key);
      }, error => {
        reject(error);
      });
    });
  }

  async getAccessToken(){
    return new Promise((resolve, reject) => {
      this.tokenUpdation.child('accessToken').once('value', snapshot => {
        let item = snapshot.val();
        resolve(item.token);
      }, error => {
        reject(error);
      });
    });
  }

}

