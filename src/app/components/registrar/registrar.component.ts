import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})
export class RegistrarComponent implements OnInit {

  // tslint:disable-next-line: new-parens
  usuario = new UsuarioModel;

  constructor( private auth: AuthService,
               private router: Router) { }

  ngOnInit() {
  }

  onSubmit( form: NgForm) {
    if ( form.invalid ) { return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();


    this.auth.nuevoUsuario( this.usuario )
      .subscribe( resp => {

        console.log(resp);

        Swal.close();

        this.router.navigateByUrl('/login');
      }, (err => {

        console.log(err.error.error.message);

        Swal.fire({
          icon: 'error',
          title: 'Error al autenticar',
          text: err.error.error.message
        });
      }));
  }
}
