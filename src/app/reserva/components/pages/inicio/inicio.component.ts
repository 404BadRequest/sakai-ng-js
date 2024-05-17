import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit{
  
  constructor(
    private router: Router
  ){}
  ngOnInit(): void {
    const sessionUser = JSON.parse(localStorage.getItem('sessionUser'));
    if (sessionUser) {
      this.router.navigate(['/dashboard']);
    }else{
      this.router.navigate(['/']);
    }
  }
}
