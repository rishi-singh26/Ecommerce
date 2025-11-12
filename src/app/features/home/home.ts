import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatNavList } from '@angular/material/list';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet, RouterLink } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';

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
export class Home {
  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches), shareReplay());

  featureGroups = [
    {
      title: 'Categories',
      route: '/categories',
      routeName: 'categories',
      absoluteRoute: 'categories',
      action: () => { }
    }
  ];
}
