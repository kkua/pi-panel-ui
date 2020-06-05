import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'net-speed',
  template: `
  <div [chart]="netSpeedChart"></div>
  `,
})
export class NetSpeedComponet implements OnDestroy {

  netSpeedChart: any;
  data: any;
  options: any;
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.netSpeedChart = new Chart({
        colors: ['#b3a52d', '#844798', '#058DC7', '#50B432'],
        chart: {
          height: 200,
          type: 'spline',
          marginRight: 10,
        },
        title: {
          text: '网络速度'
        },
        xAxis: {
          type: 'datetime',
          // tickPixelInterval: 150
        },
        yAxis: {
          tickInterval: 0.01,
          title: {
            text: 'MiB/s'
          }
        },
        credits: {
          enabled: false
        },
        // tooltip: {
        //     formatter: function () {
        //         return '<b>' + this.series.name + '</b>: ' +
        //             // Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
        //             Highcharts.numberFormat(this.y, 2) + " MB/s";
        //     }
        // },
        tooltip: {
          shared: true,
          formatter: function () {
            let s = "";
            this.points.forEach(elem => {
              s += '<span style="color:' + elem.point.color + '">' + elem.series.name + ':  ' + elem.point.y.toFixed(2) + ' MiB/s<span><br>'
                // Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                ;
            });
            return s;
          },
          followPointer: true,
          positioner: function () {
            return { x: 0, y: 0 };
          }
        },
        legend: {
          enabled: true,
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top'
        },
        time: {
          useUTC: false,
        },
      });

    });
  }

  private reflow  = true;

  public addData(netTraffic: any) {
    if (this.reflow) {
      this.netSpeedChart.ref.reflow();
      this.reflow = false;
    }
    let time = netTraffic.time;
    let traffics = netTraffic.traffic;
    var now = (new Date()).getTime();
    traffics.forEach((traffic, i) => {
      var speed = traffic / (time * (1024 * 1024 / 1000));
      this.setData(i, now, speed);
    });
  }

  private setData(index, x, y) {
    let series;
    if (this.netSpeedChart.ref) {
      series = this.netSpeedChart.ref.series;
    } else {
      return;
    }
    let isEndData = index + 1 == series.length;
    if (series.length <= index) {
      let name = index == 0 ? "下行速率" : "上行速率"
      this.netSpeedChart.addSeries(
        {
          name: name,
          data: [{ x: x, y: y }],
          showInLegend: true,
          dataLabels: {
            enabled: true,
            format: '<div style="text-align:center"><span style="color:{color}' + '">{y:.2f}</span></div>'
          },
        }
      );
    } else {
      this.netSpeedChart.addPoint([x, y], index, isEndData, series[index].data.length == 60);
    }
    if (isEndData) {
      this.activeLastPointToolip();
    }
  }

  private activeLastPointToolip() {
    var points = [];
    for (var i = 0; i < this.netSpeedChart.ref.series.length; ++i) {
      var i_points = this.netSpeedChart.ref.series[i].points;
      let point = i_points[i_points.length - 1];
      points.push(point);
    }
    this.netSpeedChart.ref.tooltip.refresh(points);
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  private random() {
    return Math.round(Math.random() * 100);
  }
}