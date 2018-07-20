import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
import { Subscription } from 'rxjs/Subscription';

import { NavService } from '@mt-ng2/nav-module';

@Component({
  selector: 'app-root',
  template: `
  <!--The content below is only a placeholder and can be replaced.-->
  <div class="skin-blue sidebar-mini"
    [class.sidebar-open]= "!sidebarCollapsed && showNav"
    [class.sidebar-collapse]= "sidebarCollapsed || !showNav"
    [class.sidebar-mini]= "showNav">
    <div class="wrapper">
      <app-nav></app-nav>
      <div class="container-fluid content-wrapper">
        <!-- Was on above Div ng-click="navCloseSmall()" -->
        <ng-progress></ng-progress>
        <router-outlet></router-outlet>
        <br/>
      </div>
      <div class="main-footer">
        <div class="container-fluid" style="color:black">
          <p>
            <i>powered by</i>
            <b>Miles Technologies</b>
          </p>
        </div>
      </div>
    </div>
  </div>`,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';

  sidebarCollapsed: boolean;
  showNav: boolean;

  subscriptions: Subscription = new Subscription();

  constructor(private navService: NavService,
    private toastsManager: ToastsManager,
    vcr: ViewContainerRef) {
    // sets the root view to be used with notifications
    this.toastsManager.setRootViewContainerRef(vcr);
  }

  ngOnInit(): void {

    this.sidebarCollapsed = this.navService.sidebarCollapsed.getValue();
    this.subscriptions.add(
      this.navService.sidebarCollapsed.subscribe(
        (sidebarCollapsed: boolean) => {
          this.sidebarCollapsed = sidebarCollapsed;
        }),
    );

    this.showNav = this.navService.showNav.getValue();
    this.subscriptions.add(
      this.navService.showNav.subscribe(
        (showNav: boolean) => {
          this.showNav = showNav;
        }),
    );

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
