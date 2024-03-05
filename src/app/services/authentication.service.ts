import { Injectable } from '@angular/core';
import { HelperService } from './helper.service';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { DatabaseService } from './database.service';
import { ChatStatusUpdateService } from './chat-status-update.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  users = firebase.database().ref('/UserData/');
  groups = firebase.database().ref('/Groups/');
  deleteChat = firebase.database().ref('/RIS_Chat/GroupChats/');
  lastRecord: any;
  recordFoundKey : any;
  
  constructor(
    private helper : HelperService,
    private db : DatabaseService,
  ) { 

  }

  async signIn(usernameMatch : any, data : any ,password : any, key : any){
    if(usernameMatch == true)
    {
      if(data.password == password)
      {
        this.db.setUserData(data);
        this.db.setUserDetails(data);
        this.db.setLoggedInStatus(true);
        this.helper.pushRootPage('tabs',"");
        if(data?.initialPassword)
        {
          await firebase.auth().signInWithEmailAndPassword(data.email.trim(), data.initialPassword.trim()).then( res => {
          }).catch(err => {
          })
        }
      }
      else
      {
        this.db.setLoggedInStatus(false);
        this.helper.presentToast("These credentials do not match.",'2000')
      }
    }
    else
    {
      this.db.setLoggedInStatus(false);
      this.helper.presentToast("This username does not exists.")
    }
  }

  async createUser(valueCheck: any,profileFORM: any, usernameMatch: any){
    if(!valueCheck)
     {
      this.lastRecord = '';
      this.recordFoundKey = '';
        await firebase.auth().createUserWithEmailAndPassword( profileFORM.email.toLowerCase().trim(),profileFORM.password.toLowerCase().trim())
        .then(async res => {
          this.users.push().set({ 
            first_name: profileFORM.first_name.toLowerCase().trim(),
            lastName: profileFORM.last_name.toLowerCase().trim(),
            dob: profileFORM.dob,
            email: profileFORM.email.toLowerCase().trim(),
            confirmation_code : '000000',
            gender: profileFORM.gender,
            phone_number: profileFORM.phone_number,
            userName: profileFORM.username.toLowerCase().trim(),
            password: profileFORM.password.trim(),
            initialPassword: profileFORM.password.trim(),
            grade: profileFORM.grade,
            picture: '',
            uID: res.user?.uid,                      
            }).then( async res => {
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
                    if(ss.userName == profileFORM.username.toLowerCase())
                    {
                      this.recordFoundKey = val1;
                      this.users.child(this.recordFoundKey).child('picture').update({ 
                        base64 : '',
                      })
                      return;
                    }
                  })
                })
              })
            })

            await this.groups.child('Grades/Grade-'+profileFORM.grade).once('value', async snapshot => {
              let item = snapshot.val();
              let totalMembers = item.totalMembers;
              this.groups.child('Grades/Grade-'+profileFORM.grade).update({ totalMembers: ++totalMembers })
              this.groups.child('Grades/Grade-'+profileFORM.grade).child('participants').push({ member : res.user?.uid, })
            })
            await this.groups.child('School').once('value', async snapshot => {
              let item = snapshot.val();
              let totalMembers = item.totalMembers;
              this.groups.child('School').update({ totalMembers: ++totalMembers })
              this.groups.child('School').child('participants').push({ member : res.user?.uid, })
            })
            this.helper.presentToast("Account created successfully","2000","top",2);
            this.helper.popPage();
        })
        .catch(err =>{
          if(err.error){
            this.helper.presentToast(err.error.message,'2000')
          }
          else{
            this.helper.presentToast(err.message,'2000')
          }
        })
      }
      else{
        if(usernameMatch == true){
          this.helper.presentToast("This username already exists. ","2000");
        }
        else{
          this.helper.presentToast("This E-mail already exists. ","2000");
        }
      }
  }

  async updateprofile(data : any, key : any, num: any){
    if(key){
      if(num == 4){                                              
        if(data.password){
          this.users.child(key).update({ 
            first_name: data.first_name.toLowerCase().trim(),
            lastName: data.last_name.toLowerCase().trim(),
            dob: data.dob,
            gender: data.gender,
            phone_number: data.phone_number,
            userName: data.username.toLowerCase().trim(),
            password: data.password.trim(),
            initialPassword: data.password.trim(),
          }).then(res => {
            
              if(data.picture){
                this.users.child(key).child('picture').update({ 
                  base64 : data.picture.base64,
                })
              }
              else
              {
                this.users.child(key).child('picture').update({ 
                  base64 : '',
                })
              }
            this.users.child(key).once('value', async (snapshot) => {
              let item = snapshot.val();
              await this.db.setUserData(item);
              await this.db.setUserDetails(item);
            });
            let user = firebase.auth().currentUser;
            user?.updatePassword(data.password);
          }).catch( err => {
          })
          this.helper.presentToast("The details have been updated successfully.",'2000','top',2)
          this.helper.popPage();
        }
        else
        {
          this.users.child(key).update({ 
            first_name: data.first_name.toLowerCase().trim(),
            lastName: data.last_name.toLowerCase().trim(),
            dob: data.dob,
            gender: data.gender,
            phone_number: data.phone_number,
            userName: data.username.toLowerCase().trim(),
          }).then(res => {
            if(data.picture){
              this.users.child(key).child('picture').update({ 
                base64 : data.picture?.base64,
              })
            }
            else
            {
              this.users.child(key).child('picture').update({ 
                base64 : '',
              })
            }
            this.users.child(key).once('value', async (snapshot) => {
              let item = snapshot.val();
              await this.db.setUserData(item);
              await this.db.setUserDetails(item);
            });
          }).catch( err => {
          })
          this.helper.presentToast("The details have been updated successfully.",'2000','top',2)
          this.helper.popPage();
        }
      }
      if(num == 2){                                                    
          this.users.child(key).update({ 
            first_name: data.first_name.toLowerCase().trim(),
            lastName: data.last_name.toLowerCase().trim(),
            dob: data.dob,
            gender: data.gender,
            phone_number: data.phone_number,
            password: data.password.trim(),
            initialPassword: data.password.trim(),
          }).then(res => {
              if(data.picture){
                this.users.child(key).child('picture').update({ 
                  base64 : data.picture.base64,
                })
              }
              else
              {
                this.users.child(key).child('picture').update({ 
                  base64 : '',
                })
              }
            this.users.child(key).once('value', async (snapshot) => {
              let item = snapshot.val();
              await this.db.setUserData(item);
              await this.db.setUserDetails(item);
            });
            let user = firebase.auth().currentUser;
            user?.updatePassword(data.password);
          }).catch( err => {
          })
          this.helper.presentToast("The details have been updated successfully.",'2000','top',2)
          this.helper.popPage();
      }
      if(num == 1){                                                    
        this.users.child(key).update({ 
          first_name: data.first_name.toLowerCase().trim(),
          lastName: data.last_name.toLowerCase().trim(),
          dob: data.dob,
          gender: data.gender,
          phone_number: data.phone_number,         
        }).then(res => {
            if(data.picture){
              this.users.child(key).child('picture').update({ 
                base64 : data.picture.base64,
              })
            }
            else
            {
              this.users.child(key).child('picture').update({ 
                base64 : '',
              })
            }
          this.users.child(key).once('value', async (snapshot) => {
            let item = snapshot.val();
            await this.db.setUserData(item);
            await this.db.setUserDetails(item);
          });
        }).catch( err => {
        })
        this.helper.presentToast("The details have been updated successfully.",'2000','top',2);
        this.helper.popPage();
      }
      if(num == 3){                 
        this.users.child(key).update({ 
          password: data.password.trim(),
        });
        this.helper.presentToast("The Password has been updated successfully.",'3000','top',2);
      }
    }
  }

  async deleteAccount(userdata: any, keyUserData: any, data: any){
    this.helper.presentLoading("Deleting Account");
    let user = firebase.auth().currentUser;
    user?.delete().then( async res => {
      await this.users.child(keyUserData).remove();                                      
      await _.forEach(data, async (val ,key) => {                                                  
        await this.deleteChat.child(val.id+'/').once('value', async snapshot => {
          let items = snapshot.val();
          await _.forEach(items, async (val1 ,key1) => {  
            if(val1.sentby == userdata.uID)
            {
            this.deleteChat.child(val.id+'/').child(key1).remove().then( res => {
            }).catch( err => {
            })
            }
          });
        });
      })
      await this.groups.child('Grades/Grade-'+userdata.grade).once('value', async snapshot => {     
        let item = snapshot.val();
        this.groups.child('Grades/Grade-'+userdata.grade+'/').update({
          totalMembers : item.totalMembers - 1
        })
        _.forEach(item.participants, async (val ,key) => {  
          if(val.member == userdata.uID)
          {
            this.groups.child('Grades/Grade-'+userdata.grade+'/participants/').child(key).remove();
          }
        })
      });
      await this.groups.child('School/').once('value', async snapshot => {                               
        let item = snapshot.val();
        this.groups.child('School/').update({
          totalMembers : item.totalMembers - 1
        })
        _.forEach(item.participants, async (val ,key) => {  
          if(val.member == userdata.uID)
          {
            this.groups.child('School/'+'participants/').child(key).remove();
          }
        })
      });
      await this.db.clearStorage();
      await this.db.setLoggedInStatus(false);
      await this.helper.pushRootPage('login',"");
      await this.helper.presentToast("Your account has been deleted successfully.",'3000','top',2);
      this.helper.dismissLoading(2);
    }).catch( err => {
      this.helper.presentToast("Something went wrong.",'3000');
      this.helper.dismissLoading(2);
    })
  }

  async logout(){
    await this.db.clearStorage();
    await this.db.setLoggedInStatus(false);
    await this.helper.pushRootPage('login',"");
    await firebase.auth().signOut();
    await this.helper.presentToast("You have been logged out.",'3000','top',2);
  }

}