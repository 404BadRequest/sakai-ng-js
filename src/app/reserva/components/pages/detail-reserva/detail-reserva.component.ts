import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-reserva',
  templateUrl: './detail-reserva.component.html',
  styleUrl: './detail-reserva.component.scss'
})
export class DetailReservaComponent implements OnInit{
  reservaId: string;
  constructor(
    private route: ActivatedRoute
  ){  }
  ngOnInit(): void {
    this.reservaId = this.route.snapshot.paramMap.get('Id');
  }
}
