import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {

  name!: string;
  destroyed = new Subject<void>();
  currentScreenSize!: string;

  constructor(private _auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.getUserdetails();
  }

  getUserdetails() {
    const url = "me";
    this._auth.callAPI('get', url, null).subscribe((response: any) => {
      const res = this._auth.GetResponse(response, false);
      console.log("res ---", res);
      if(res.success === true) {
        this.name = res.user.fname +' '+res.user.lname;
      }
    })
  }

  logout() {
    this._auth.alertPopUp('success', 'loging out...');
    this._auth.logout();
  }

  openhome() {
    this.router.navigate(['/main/dashboard']);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
