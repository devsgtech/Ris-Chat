import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import * as _ from 'lodash';
import { IMG } from 'src/app/services/constant.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-guideline',
  templateUrl: './guideline.page.html',
  styleUrls: ['./guideline.page.scss'],
})
export class GuidelinePage implements OnInit {

  img = IMG;
  Button = [
    { id: 1, title: 'Rules', val: 'rule', isSelected: true },
    { id: 2, title: "What is this?", val: 'whatsthis', isSelected: false },
  ];
  selectedTab: string = 'rule';

  constructor(private helper : HelperService,
       public platform: Platform,) { }

  ngOnInit() {
  }

  change_tab(wl: any) {
    _.forEach(this.Button, (i) => {
      if (i.val == wl.val) {
        i.isSelected = true;
        this.selectedTab = i.val;
      }
      else { i.isSelected = false; }
    });
  }

  back(){
    this.helper.popPage();
  }

}
