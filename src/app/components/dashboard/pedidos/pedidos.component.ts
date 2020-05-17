import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../../models/pedido.model';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { PedidosService } from '../../../services/pedidos.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

export interface Item { id: string; fecha: string; hora: string; platillo: string; descripcion: string; realizado: boolean; }

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {

  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;

  pedidos: Pedido[] = [];

  constructor(  private auth: AuthService,
                private router: Router,
                private pedidosService: PedidosService,
                private afs: AngularFirestore,
                private db: AngularFirestore ) {
    this.itemsCollection = afs.collection<Item>('pedidos');
    this.items = this.itemsCollection.valueChanges();

                }

  ngOnInit() {}

  borrarPedido( pedido: Pedido, i: number ) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ pedido.platillo }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if ( resp.value ) {
        this.pedidos.splice(i, 1);
        this.pedidosService.borrarPedido( pedido.id ).subscribe();
      }
    });
  }

  setRealizado( pedido: Pedido ) {
    if ( pedido.realizado === true ) {
      pedido.realizado = false;
    } else {
      pedido.realizado = true;
    }
    let peticion: Observable<any>;
    peticion = this.pedidosService.actualizarPedido( pedido );
    peticion.subscribe( resp => {});
  }

}
