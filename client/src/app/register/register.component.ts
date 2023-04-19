import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
  }


  register() {
    this.accountService.register(this.model).subscribe({
      next: () => this.router.navigateByUrl("/feed"),
      error: error => {
        console.log(error)
        alert(`add toaster! \nerror: ${error.error.title} \n${Object.entries(error.error.errors).map(entry => `${entry[0]}: ${entry[1]}`).join("\n")}`)

      },
    })
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
