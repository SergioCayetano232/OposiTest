import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-test',
  imports: [],
  templateUrl: './test.html',
  styleUrl: './test.css',
})
export class Test {
  private ruta = inject(ActivatedRoute);

  // el parámetro :tema de la URL
  tema = this.ruta.snapshot.paramMap.get('tema') ?? '';
}
