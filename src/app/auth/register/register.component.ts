import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

function ConfirmedValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (
      matchingControl.errors &&
      !matchingControl.errors['confirmedValidator']
    ) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmedValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  visible: boolean = false;
  visible1: boolean = false;

  minDate = new Date(new Date().setFullYear(1950));
  maxDate = new Date();

  constructor(private fb: FormBuilder, private _auth: AuthService, private router: Router, private route: ActivatedRoute) {
    this.registerForm = this.fb.group({
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/)]],
      personal_info: [false, Validators.required],
      dob: [''],
      address: [''],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/)]],
      confirmpassword: ['', [Validators.required]]
    },
    {
      validator: ConfirmedValidator('password', 'confirmpassword'),
    })
  }

  ngOnInit(): void {
    this.registerForm.controls['email'].patchValue(this.route.snapshot.paramMap.get('email'));
    let email = this._auth.getToken('email');
    let name = this._auth.getToken('name');
    if(name && email) {
      this.registerForm.patchValue({
        name : name,
        email : email
      })
    }
  }

  submit() {
    if(this.registerForm.valid) {
      let data = {
        fname: this.registerForm.controls['fname'].value,
        lname: this.registerForm.controls['lname'].value,
        email: this.registerForm.controls['email'].value,
        dob: this.registerForm.controls['dob'].value,
        address: this.registerForm.controls['address'].value,
        password: this.registerForm.controls['password'].value
      };

      const url = 'register';
      this._auth.callAPI('post', url, data).subscribe((response: any) => {
        const res = this._auth.GetResponse(response);
        if(res.success) {
            setTimeout(() => {
              this.registerForm.reset();
              this.router.navigate(['/auth/login']);
            }, 3000);
        }
      })
    }
  }

  emailValidator(control : FormControl) {
    const q = new Promise((resolve, reject) => {
      let data = {
        email: control.value
      }
      console.log(data);
      const url = 'checkemail';
      this._auth.callAPI('post', url, data).subscribe((res: any)=> {
        console.log(res)
        if(res.success === true) {
          resolve(null)
        } else {
          resolve({ 'isEmailExist': true })
        }
      });
    });
      return q;
  }

  checkvalidation(e: any) {
    const checked = e.value;

    if(checked) {
      this.registerForm.controls['dob'].setValidators(Validators.required);
      this.registerForm.controls['address'].setValidators(Validators.required);
      this.registerForm.controls['dob'].updateValueAndValidity();
      this.registerForm.controls['address'].updateValueAndValidity();
    } else {
      this.registerForm.controls['dob'].clearValidators();
      this.registerForm.controls['address'].clearValidators();
      this.registerForm.controls['dob'].updateValueAndValidity();
      this.registerForm.controls['address'].updateValueAndValidity();
    }
  }
}
