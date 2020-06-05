import { Component, OnInit, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { ViewCell, ServerDataSource } from 'ng2-smart-table';
import { Observable, Subject, of, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocalDataSource } from 'ng2-smart-table';
import { CommonResp } from '../../app.component'

export interface DiskInfo {
  kname: string; // kname
  vendor: string; // 制造商
  device_name: string; // 设备名称
  volume_label: string; // 卷标
  fs_type: string; // 文件系统
  size: string; // 容量
  mount_point?: string; // 挂载点
}

export interface DiskInfoList {
  diskInfos: DiskInfo[];
}

@Injectable({ providedIn: 'root', })
export class DiskService {
  listDisk(): Observable<CommonResp> {
    return this.http.get<CommonResp>("/disk_info");
  }

  mountDisk(diskInfo: DiskInfo): Observable<CommonResp> {
    return this.http.post<CommonResp>("/mount_disk", diskInfo);
  }

  removeDisk(diskInfo: DiskInfo): Observable<CommonResp> {
    return this.http.post<CommonResp>("/remove_disk", diskInfo);
  }

  constructor(private http: HttpClient) { }
}

@Component({
  selector: 'mount-point-dialog',
  template: `
  <nb-card>
  <nb-card-header>设置挂载点</nb-card-header>
  <nb-card-body>
    <input #mountPoint nbInput placeholder="挂载点">
  </nb-card-body>
  <nb-card-footer>
    <button class="cancel" nbButton status="primary" hero (click)="cancel()">取消</button>
    <button nbButton status="success" hero (click)="submit(mountPoint.value)">挂载</button>
  </nb-card-footer>
</nb-card>`,
  styleUrls: ['mount-disk-dialog.component.scss'],

}) export class MountPointDialogComponent {
  constructor(protected ref: NbDialogRef<MountPointDialogComponent>) { }

  cancel() {
    this.ref.close();
  }

  submit(mountPoint) {
    this.ref.close(mountPoint);
  }
}

@Component({
  selector: 'button-view',
  template: `
  <nb-action>
    <div class="btn-div-center">
      <button *ngIf="!rowData.mount_point" nbButton hero size="small" status="warning"  (click)="mountDisk()">挂载</button>
      <button *ngIf="rowData.mount_point" nbButton hero size="small" status="danger"  (click)="removeDisk()">移除</button>
    </div>
  </nb-action>
  `,
})
export class DiskOperationComponent implements ViewCell {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: DiskInfo;// 定义于ViewCell

  @Output() updateDiskInfo: EventEmitter<any> = new EventEmitter();

  mountDisk() {
    this.dialogService.open(MountPointDialogComponent)
      .onClose.subscribe((mountPoint: string) => {
        if (mountPoint) {
          mountPoint = mountPoint.trim();
          if (mountPoint.length == 0) {
            this.toastrService.danger(null, "挂载点不能为空");
          } else {
            // server
            let reqData = { ...this.rowData };
            reqData.mount_point = mountPoint;
            this.diskService.mountDisk(reqData).subscribe(resp => {
              if (resp.code == 0) {
                this.rowData.mount_point = resp['mount_point'];
                this.updateDiskInfo.emit(this.rowData);
              } else {
                let title = "磁盘 " + this.rowData.kname + ", 挂载失败";
                this.toastrService.danger(resp.msg, title);
              }
            });
          }
        }
      });
  }

  removeDisk() {
    this.diskService.removeDisk(this.rowData).toPromise().then(resp => {
      if (resp.code == 0) {
        this.rowData.mount_point = null;
        this.updateDiskInfo.emit(this.rowData);
      } else {
        let title = "磁盘 " + this.rowData.kname + ", 移除失败";
        this.toastrService.danger(resp.msg, title);
      }
    });
  }

  constructor(private dialogService: NbDialogService, private diskService: DiskService, private toastrService: NbToastrService) {
    
  }

}

@Component({
  selector: 'app_disk_table',
  templateUrl: './disk.component.html',
  styleUrls: ['./disk.component.scss'],
})
export class DiskComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();

  settings = {
    actions: null,
    hideSubHeader: true,
    noDataMessage: '未发现任何可移动磁盘',
    columns: {
      kname: {
        title: 'kname',
        type: 'string',
        editable: false,
        sort: false,
      },
      vendor: {
        title: '制造商',
        type: 'string',
        editable: false,
        sort: false,
      },
      volume_label: {
        title: '卷标',
        type: 'string',
        editable: false,
        sort: false,
      },
      fs_type: {
        title: '文件系统',
        type: 'string',
        editable: false,
        sort: false,
      },
      size: {
        title: '容量',
        type: 'string',
        editable: false,
        sort: false,
      },
      device_name: {
        title: '设备名称',
        type: 'string',
        editable: false,
        sort: false,
      },
      mount_point: {
        title: '挂载点',
        type: 'string',
        editable: false,
        sort: false,
      },
      operation: {
        title: '操作',
        type: 'custom',
        editable: false,
        class: 'align-center',
        sort: false,
        renderComponent: DiskOperationComponent,
        onComponentInitFunction: (instance: any) => {
          instance.updateDiskInfo.subscribe(diskInfo => {
            this.updateDiskInfo(diskInfo);
          });
        },
      }
    },
  };


  private updateDiskInfo(diskInfo: any) {
    this.source.update(diskInfo, diskInfo);
  }

  constructor(private diskService: DiskService, private toastrService: NbToastrService) {

  }

  ngOnInit() {
    this.diskService.listDisk().toPromise().then(resp => {
      if (resp.code == 0) {
        this.source.load(resp.data);
      }
    });
  }

}
