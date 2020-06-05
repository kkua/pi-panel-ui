import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">Created by <b><a href="https://github.com/kkua" target="_blank">KK</a>.</b>
     Made with <b><a href="https://github.com/akveo/ngx-admin/" target="_blank">ngx-admin</a></b>.</span>
    <div class="socials">
      <a href="https://github.com/kkua" target="_blank" class="ion ion-social-github"></a>
    </div>
  `,
})
export class FooterComponent {
}
