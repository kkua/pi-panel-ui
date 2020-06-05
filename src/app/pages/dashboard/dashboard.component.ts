import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CPUUtilizationComponet } from './cpu-utilization.component';
import { NetSpeedComponet } from './net-speed.component'
@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  providers: [CPUUtilizationComponet, NetSpeedComponet],
})
export class DashboardComponent {
  temperature = 0;
  temperatureThreshold = {
    '0': { color: 'green' },
    '40': { color: 'orange' },
    '65': { color: 'red' }
  };

  memoryUsed = 0;
  memoryTotal = 100;
  memoryThreshold = { '0': { color: 'green' } };
  memoryConfigureFinish = false;
  memoryUnitName = 'MB'

  @ViewChild(CPUUtilizationComponet, { static: false })
  private cpuComponet: CPUUtilizationComponet;

  @ViewChild(NetSpeedComponet, { static: false })
  private netSpeedComponet: NetSpeedComponet;
  // timer: any;

  constructor(private http: HttpClient) {
  }
  private updateStatus = (): void => {
    // let data = {"cores":[0.0,0.0,0.0,0.0,0.0,0.0],"memory":{"free":3823943680,"total":3997011968},"net_traffic":{"time":1003,"traffic":[0,0]},"temperature":40.55500030517578};
    this.http.get("/status_data").subscribe(data => {
      this.temperature = data['temperature'];
      let mem = data['memory'];
      if (mem) {
        let free = mem['free'] / 1024 / 1024;
        let total = mem['total'] / 1024 / 1024;
        if (!this.memoryConfigureFinish) {
          this.memoryThreshold[(total * 0.75).toString()] = { color: 'orange' };
          this.memoryThreshold[(total * 0.90).toString()] = { color: 'red' };
          this.memoryTotal = total;
          this.memoryConfigureFinish = true;
        }
        this.memoryUsed = Math.ceil(total - free);
      }
      this.cpuComponet.addData(data['cores']);
      this.netSpeedComponet.addData(data['net_traffic']);

      if (this.running) {
        setTimeout(this.updateStatus, 0);
      }
    });

  }

  running = true;

  ngAfterViewInit() {
    setTimeout(this.updateStatus, 0);
  }

  ngOnDestroy(): void {
    this.running = false;
    // clearTimeout(this.timer);
  }
}
