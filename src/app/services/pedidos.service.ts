import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pedido } from '../models/pedido.model';
import { map, delay } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private CARPETA_PEDIDOS = 'pedidos';

  private url = 'https://restaurant-template-4b129.firebaseio.com';

  private pedidos;


  constructor(  private http: HttpClient,
                private db: AngularFirestore ) {
    this.pedidos = this.getPedidos();
  }

  crearPedido( pedido: Pedido ) {
    return this.http.post(`${ this.url }/pedidos.json`, pedido)
            .pipe(
              map( (resp: any) => {
                pedido.id = resp.name;
                this.createPedido(
                  pedido.id,
                  {
                  id: pedido.id,
                  fecha: pedido.fecha,
                  hora: pedido.hora,
                  platillo: pedido.platillo,
                  descripcion: pedido.descripcion,
                  realizado: pedido.realizado
                });
                return pedido;
              })
            );
  }

  // tslint:disable-next-line: max-line-length
  private createPedido( id: string, pedido: { id: string, fecha: string, hora: string, platillo: string, descripcion: string, realizado: boolean } ) {
    this.db.collection(`/${ this.CARPETA_PEDIDOS }`).doc(id).set(pedido);
  }

  actualizarPedido( pedido: Pedido ) {
    const pedidoTemp = {
      ...pedido
    };
    this.updatePedido( pedidoTemp.id, pedidoTemp );
    delete pedidoTemp.id;
    return this.http.put(`${ this.url }/pedidos/${ pedido.id }.json`, pedidoTemp);
  }

  private updatePedido( id: string, pedido: Pedido ) {
    const pedidos = this.db.collection(`/${ this.CARPETA_PEDIDOS }`).doc( id );
    const update = pedidos.update( {  id: pedido.id,
                                      fecha: pedido.fecha,
                                      hora: pedido.hora,
                                      platillo: pedido.platillo,
                                      descripcion: pedido.descripcion,
                                      realizado: pedido.realizado } );
  }

  borrarPedido( id: string ) {
    this.deletePedido( id );
    return this.http.delete(`${ this.url }/pedidos/${ id }.json`);
  }

  deletePedido( id: string ) {
    const pedidos = this.db.collection(`/${ this.CARPETA_PEDIDOS }`).doc( id );
    const del = pedidos.delete();
  }

  getPedido( id: string ) {
    return this.http.get(`${ this.url }/pedidos/${ id }.json`);
  }


  getPedidos() {
    return this.http.get(`${ this.url }/pedidos.json`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  private crearArreglo( pedidosObj: object ) {
    const pedidos: Pedido[] = [];
    Object.keys( pedidosObj ).forEach( key => {
      const pedido: Pedido = pedidosObj[key];
      pedido.id = key;
      pedidos.push( pedido );
    });
    return pedidos;
  }

  buscarPedidos( termino: string, pedidos: Pedido[] ): Pedido[] {
    let i;
    const pedidosArr: Pedido[] = [];
    termino = termino.toLowerCase();
    Object.keys( pedidos ).forEach( key => {
      i++;
      const pedido: Pedido = pedidos[key];
      const titulo = pedido.platillo.toLowerCase();

      if ( titulo.indexOf( termino ) >= 0  ) {
        pedidosArr.push( pedido );
      }
    });

    return pedidosArr;

  }

}
