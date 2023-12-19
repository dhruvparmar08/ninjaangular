import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  login_Form: FormGroup;
  @ViewChild('contactForm', { static: false }) loginForm!: NgForm;

  enable: boolean = false;
  visible: boolean = false;

  logindetails: any;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private _auth: AuthService) {
    this.login_Form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })

    this.logindetails = {
      email:"",
      password:""
    };
  }

  ngOnInit(): void {
  }

  email_submit() {
    console.log("logindetails", this.logindetails);
      let data = {
        email: this.logindetails.email,
        password: this.logindetails.password
      }

      this._auth.callAPI('post', "authenticate", data).subscribe((response: any)=> {
        const res = this._auth.GetResponse(response);
        console.log("res---", res);
        if(res.success === true) {
          this.reset();
          this._auth.setToken('auth_token', res.token);
          setTimeout(() => {
            this.router.navigate(['/main']);
          }, 2000);
        }
      })
  }

  reset() {
    this.login_Form.reset();
  }

  check(e: any) {
    if(e.value == '2') {
      this.enable = true;
    } else {
      this.enable = false;
    }
  }
}
