import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  // tslint:disable-next-line: new-parens
  usuario = new UsuarioModel;

  constructor( private auth: AuthService,
               private router: Router) { }

  ngOnInit() { }

  login( form: NgForm) {
    if ( form.invalid ) { return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.auth.login( this.usuario )
      .subscribe( resp => {

        Swal.close();
        this.router.navigateByUrl('/dashboard');
      }, (err) => {

        Swal.fire({
          icon: 'error',
          title: 'Error al autenticar',
          text: err.error.error.message,
          footer: '<a href>Why do I have this issue?</a>'
        });

      });
  }

}
