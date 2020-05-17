import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../models/pedido.model';
import { PedidosService } from '../../services/pedidos.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.scss']
})
export class PedidoComponent implements OnInit {


  pedido: Pedido = new Pedido();

  constructor( private pedidoService: PedidosService,
               private route: ActivatedRoute,
               private router: Router,
               firestore: AngularFirestore ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if ( id !== 'nuevo' ) {
      this.pedidoService.getPedido( id )
        .subscribe( (resp: Pedido) => {
          this.pedido = resp;
          this.pedido.id = id;
        });
    }
  }

  guardar( form: NgForm ) {
    if ( form.invalid ) {
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    let peticion: Observable<any>;

    if ( this.pedido.id ) {
      peticion = this.pedidoService.actualizarPedido( this.pedido );
    } else {
      this.pedido.fecha = this.getFecha();
      this.pedido.hora = this.getHora();
      this.pedido.realizado = false;
      peticion = this.pedidoService.crearPedido( this.pedido );
    }

    peticion.subscribe( resp => {

      Swal.fire({
        icon: 'success',
        title: this.pedido.platillo,
        text: 'Pedido realizado correctamente.',
        footer: '<i class="far fa-laugh-beam m-1"></i> Enseguida entregamos tu orden! <i class="far fa-laugh-beam m-1"></i>'
      });
    });
    this.router.navigate(['home']);
  }

  getFecha() {
    const fechaTemp = new Date();
    return fechaTemp.getUTCDate() + '/' + (fechaTemp.getUTCMonth() + 1) + '/' + fechaTemp.getUTCFullYear();
  }

  getHora() {
    const HoraTemp = new Date();
    return HoraTemp.getHours() + ':' + HoraTemp.getUTCMinutes() + ':' + HoraTemp.getUTCSeconds();
  }
}
