import { NgModule } from '@angular/core';
import { NbCardModule, NbTreeGridModule, NbActionsModule, NbButtonModule, NbDialogModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule, ViewCell } from 'ng2-smart-table';
import { DiskComponent, DiskOperationComponent, MountPointDialogComponent } from "./disk.component";
@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbActionsModule,
    NbButtonModule,
    NbDialogModule.forChild(),
    NbTreeGridModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    MountPointDialogComponent,
    DiskOperationComponent,
    DiskComponent,
  ],
  entryComponents: [
    MountPointDialogComponent,
    DiskOperationComponent,
  ],
})
export class DiskModule { }
