/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
declare var Pace: any;

export interface CommonResp {
  code : number;
  data : any;
  msg: string;
}

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService) {
    
  }

  ngOnInit() {
    this.analytics.trackPageViews();
    Pace.options["restartOnRequestAfter"] = false;// https://github.hubspot.com/pace/
  }
}
