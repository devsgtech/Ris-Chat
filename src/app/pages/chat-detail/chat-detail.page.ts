import { Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { IMG, USER_DETAILS } from 'src/app/services/constant.service';
import { HelperService } from 'src/app/services/helper.service';
import { DateTime } from 'luxon';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonContent, IonList, IonTextarea, Platform } from '@ionic/angular';
import { ChatStatusUpdateService } from 'src/app/services/chat-status-update.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.page.html',
  styleUrls: ['./chat-detail.page.scss'],
})
export class ChatDetailPage implements OnInit {
 
  img = IMG; user_id :any; testForm!: FormGroup;  scroll : boolean = false; 
  inputData : string = "";  chatHistory : any; dayName : any; monthName : any; len : any = 0; groupName: any;
    reversedKeys : any = []; dataRecieved : any; groupID : any; onScreen : boolean = false;
  @ViewChild(IonContent, {static: false}) private scrollVanish!: IonContent;
  @ViewChild(IonList, {static: false, read: ElementRef}) chatList!: ElementRef; userNames: any = []
  cheking = true; showLoad = false ; interval : any = 30;
  @ViewChild('myTextarea', { static: false }) myTextarea!: IonTextarea;


  chatNameCheck : boolean = false;

  groupRefID= firebase.database().ref('/RIS_Chat/GroupChats/');
  userData = firebase.database().ref('/UserData/');

  constructor(
    private chatUpdateStatus: ChatStatusUpdateService,
    private platform: Platform,
    private helper: HelperService,) {
      this.dataRecieved = this.helper.getNavData();
      this.groupID = this.dataRecieved.group_id;
      this.groupName = this.dataRecieved.group_name;
      this.user_id = USER_DETAILS.DATA.uID;
      this.onScreen = true;
      this.helper.presentLoading("Loading...");
       setTimeout( () => {
          this.chatUpdateStatus.scrollToBottomMutation(this.scrollVanish, this.chatList.nativeElement);
          this.helper.dismissLoading(2);
        }, 1000);


  }

  async getNames(){
    this.userNames = [];
      this.userData.on('value', async (snapshot1) => {
        let item = snapshot1.val();
         _.forEach(item, (val ,key) => {
          this.userNames.push({
            uid : val.uID,
            name : val.userName,
          })
        })
    })
  }

  async getMessages()                                                                                    
  {
    
    this.groupRefID.child(this.groupID).on('value', async (snapshot) => {
      if(this.onScreen)
      {
        this.len = this.chatUpdateStatus.snapshotToArray(snapshot);
        this.groupRefID.child(this.groupID).limitToLast(this.interval).once('value', async (snapshot) => {
          this.chatHistory =  this.chatUpdateStatus.snapshotToArray(snapshot);
        })
      }
    });
  }

  async ionViewDidEnter(){
    this.platform.ready().then(async () => {
      this.onScreen = true;
      this.testForm = new FormGroup({
        input : new FormControl('', [Validators.required, Validators.minLength(1)] )
      })
      await this.getNames();
      this.getMessages();
      this.scrollVanish?.scrollToBottom(0)
      if (this.chatList) {
        this.chatUpdateStatus.scrollToBottomMutation(this.scrollVanish, this.chatList.nativeElement);
      }
    })
  }

  onSubmit(){                                                                                   
    this.testForm.markAllAsTouched()
    if(this.testForm.valid )
    {
      let text = this.inputData.trim()
      this.pushMessage();
      this.testForm.reset();
    }
  }

  async ngOnInit() {                                                                 
    this.testForm = new FormGroup({
      input : new FormControl('', [Validators.required, Validators.minLength(1) ] )
    })
  }

  async handleRefresh(event: any){                                                            
    if(this.interval <= this.len.length)
    {
      this.scroll = true;
      this.interval +=30; 
      await this.getMessages()
      event.target.complete();
      setTimeout(async () => {
        this.scrollVanish.scrollToTop()
        this.scroll = false
      }, 650);
    }
    else{
      this.scroll = true;
      event.target.complete();
      setTimeout(async () => {
        this.scrollVanish.scrollToTop()
        this.scroll = false
      }, 650);
    }
  }

  pop() {
    this.helper.pushPage('tabs',''); 
  }

  async ionViewDidLeave()                               
  {
    this.chatHistory="";
    this.onScreen = false;
    this.dataRecieved="";
    this.inputData = "";
    this.groupRefID.off();
    this.userData.off();
  }

  getPointDatetime()                                 
  {
    let newYorkTime = DateTime.local().setZone('Europe/Oslo').toFormat('LLL dd, yyyy hh:mm a'); 
    return newYorkTime;
  }

  getTime()                                                          
  {
    let newYorkTime = DateTime.local().setZone('Europe/Oslo').toFormat('LLL dd, yyyy hh:mm a'); 
    let hour1 : any = new Date(newYorkTime).getHours();
    let min1 : any = new Date(newYorkTime).getMinutes();
    if(hour1 < 10)
    {
      hour1 = "0" + hour1;
    }
    if(min1 < 10)
    {
      min1 = "0" + min1;
    }
    return hour1+" : "+ min1;
  }
  
  setFocusOnTextarea() {
    if (this.myTextarea) {
      this.myTextarea.setFocus();
    }
  }

  async pushMessage(){
    let newMSg = this.inputData.trim();                                                     
    this.groupRefID.child(this.groupID).push({ 
          message: newMSg,                                        
          sentby: this.user_id,                                   
          sentTime: this.getTime(),                                
          dateOfMessage : this.getPointDatetime(),               
          timestamp: firebase.database.ServerValue.TIMESTAMP,    
        });
        this.scrollVanish.scrollToBottom();
        this.setFocusOnTextarea()
  }

  gotoTop() {                                     
        setTimeout(() => {
          this.cheking = true;
          this.logScrollEnd(true)
        }, 150);  
  }

  logScrollEnd(ss = false){
    if(!this.scroll){
      if(!ss){
        this.cheking = false;
      }
    }
  }

  isFirstMessage(index: number, userId: string): boolean {
    if (index === 0) {
      return true;
    } else if (this.chatHistory[index - 1].sentby !== userId) {
      return true; 
    } else {
      return false; 
    }
  }

}

