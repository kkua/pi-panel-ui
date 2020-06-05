import { NgModule } from '@angular/core';
import { NbCardModule,NbLayoutModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { ChartModule } from 'angular-highcharts';
// import { HighchartsChartModule } from 'highcharts-angular';
import { CPUUtilizationComponet } from "./cpu-utilization.component";
import { NetSpeedComponet } from "./net-speed.component";
@NgModule({
  imports: [
    NgxGaugeModule,
    NbCardModule,
    NbLayoutModule,
    ThemeModule,
    ChartModule,
  ],
  declarations: [
    DashboardComponent,
    CPUUtilizationComponet,
    NetSpeedComponet,
  ],
})
export class DashboardModule { }
