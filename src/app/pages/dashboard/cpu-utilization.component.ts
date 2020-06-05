import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'cpu-utilization',
  template: `
  <div [chart]="cpuChart" style="width: 100%"></div>
  `,
})
export class CPUUtilizationComponet implements OnDestroy {

  cpuChart: any;
  data: any;
  options: any;
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.cpuChart = new Chart({
        colors: ['#ff8000', '#e20800', '#f3c300', '#ff0000', '#0028a9', '#a92928', '#28a929', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
          '#FF9655', '#FFF263', '#6AF9C4'],
        chart: {
          height: 270,
          type: 'spline',
          marginRight: 10,
        },
        title: {
          text: 'CPU利用率'
        },
        xAxis: {
          type: 'datetime',
        },
        yAxis: {
          title: {
            text: "%"
          }
        },
        credits: {
          enabled: false
        },
        tooltip: {
          shared: true,
          formatter: function () {
            let s = "";
            this.points.forEach(elem => {
              s += '<span style="color:' + elem.point.color + '">' + elem.series.name + ':  ' + elem.point.y.toFixed(2) + ' %<span><br>'
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


  private reflow = true;

  public addData(cpuDataArr: Array<number>) {
    if (this.reflow) {
      this.cpuChart.ref.reflow();
      this.reflow = false;
    }
    var now = (new Date()).getTime();
    cpuDataArr.forEach((cpuData, i) => {
      this.setData(i, now, cpuData);
    });
  }

  private setData(index, x, y) {
    let series;
    if (this.cpuChart.ref) {
      series = this.cpuChart.ref.series;
    } else {
      return;
    }
    let isEndData = index + 1 == series.length;
    if (series.length <= index) {
      let name = 'Core ' + index;
      this.cpuChart.addSeries(
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
      this.cpuChart.addPoint([x, y], index, isEndData, series[index].data.length == 60);
    }
    if (isEndData) {
      this.activeLastPointToolip();
    }
  }

  private activeLastPointToolip() {
    var points = [];
    for (var i = 0; i < this.cpuChart.ref.series.length; ++i) {
      var i_points = this.cpuChart.ref.series[i].points;
      let point = i_points[i_points.length - 1];
      points.push(point);
    }
    this.cpuChart.ref.tooltip.refresh(points);
  }

  ngOnDestroy(): void {
    this.cpuChart.destroy();
    this.themeSubscription.unsubscribe();
  }

  private random() {
    return Math.round(Math.random() * 100);
  }
}