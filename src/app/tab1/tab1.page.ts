import { Component, Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { AuthenticationService } from '../services/authentication.service';
import { DatabaseService } from '../services/database.service';
import { IMG, USER_DETAILS } from '../services/constant.service';
import { HelperService } from '../services/helper.service';
import * as _ from 'lodash';
import { Platform } from '@ionic/angular';
import { ChatStatusUpdateService } from '../services/chat-status-update.service';

@Injectable({
  providedIn: 'root'
}) 
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  img = IMG;
  user: any;
  onScreen : boolean = false;
  users = firebase.database().ref('/UserData/');
  groups = firebase.database().ref('/Groups/');
  chats = firebase.database().ref('/RIS_Chat/GroupChats');
  schoolGroupID = 1001;                                
  gradeGroupID : any;
  chatID : any =[];
  grade : any;
  isLoading : boolean = true;
  allChats : any =[];
   
  constructor(
    private platform: Platform,
    private db: DatabaseService,
    private helper: HelperService,
  ) {
    this.onScreen = true;
  }

  ionViewDidEnter(){
    this.onScreen = true;
    this.platform.ready().then(async () => {
      await this.db.setUserDetails(await this.db.getUserData());
      this.user = USER_DETAILS.DATA;
      if(this.user){
      this.isLoading = true;
        await this.getGradeID();
      }
    })
  }

  ionViewDidLeave(){
    this.allChats = [];
    this.chatID = [];
    this.users.off();
    this.groups.off();
    this.chats.off();
    this.onScreen = false;
  }

  async getGradeID()
  {
    this.chatID.push({ id : this.schoolGroupID, name : 'Whole School' })
    this.grade = USER_DETAILS.DATA?.grade;
    this.allChats = [];
    await this.groups.child('Grades/Grade-'+this.grade).once('value', async snapshot => {
      let item = snapshot.val();
      this.gradeGroupID = item?.groupID;
      this.chatID.push({ id : this.gradeGroupID, name : item?.name })
      this.getChats();
    })
  }

  async getChats(){
    await _.forEach(this.chatID, async (val ,key) => {  
      this.chats.child(val.id).on('value', async snapshot => { 
        if(this.onScreen)
        {
          await this.updateChat(val);
        }
      })
    })
    this.isLoading = false;
  }

  async updateChat(val1: any){                                                 
    const snapshot = await this.chats.child(val1.id).once('value');
    const item = snapshot.val();
    const rev_key : any = [];
     await  _.forEach(item, (val ,key) => { 
        rev_key.push(key);
      })
      const reversedKeys = rev_key.reverse();
     let lastItem;
      for (const i of reversedKeys) {
        const snapshot = await this.chats.child(val1.id).child(i).once('value');
        const ss = snapshot.val();
        lastItem = ss;
        break; 
      }
        const existingChat =  this.allChats.findIndex( (item: any) => item.key.id == val1.id);
        if (existingChat !== -1) {
          this.allChats[existingChat] = {
            key: val1,
            value: lastItem?.message,
            sentBy: lastItem?.sentby,
            timeStamp : lastItem?.timestamp,
          }; 
        } else {
          this.allChats.push({
            key: val1,
            value: lastItem?.message,
            sentBy: lastItem?.sentby,
            timeStamp : lastItem?.timestamp,
          });
        }
        this.allChats.sort((a:any, b:any) => b.timeStamp - a.timeStamp);
  }

  viewChat(item : any){
      let data = {
        group_id : item.key.id,
        group_name : item.key.name
      }
      this.helper.pushPage('chat-detail',data);
  }

}
