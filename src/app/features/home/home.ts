import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatNavList } from '@angular/material/list';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { map, Observable, shareReplay, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbar,
    MatSidenavContainer,
    MatSidenav,
    MatNavList,
    MatSidenavContent,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  private router: Router = inject(Router);

  public currentRoute: string | null = null;
  private routerSubscription$: Subscription | undefined;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches), shareReplay());

  featureGroups = [
    {
      title: 'Categories',
      route: '/categories',
      action: () => { }
    },
    {
      title: 'Products',
      route: '/products',
      action: () => { }
    },
  ];

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    
    this.routerSubscription$ = this.router.events.subscribe(x => {
      if (x instanceof NavigationEnd) {
        this.currentRoute = x.url;
      }
    });
  }

  getPageName(): string {
    const routeData = this.featureGroups.find(f => f.route === this.currentRoute);

    return routeData?.title ?? '';
  }

  ngOnDestroy(): void {
    this.routerSubscription$?.unsubscribe();
  }
}
