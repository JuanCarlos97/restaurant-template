import { Routes, RouterModule, CanActivate } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PedidoComponent } from './components/pedido/pedido.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PedidosComponent } from './components/dashboard/pedidos/pedidos.component';

const APP_ROUTES: Routes = [
    { path: 'home', component: HomeComponent},
    { path: 'pedido/:id', component: PedidoComponent },
    { path: 'login'   , component: LoginComponent },
    { path: 'registro'   , component: RegistrarComponent, canActivate: [ AuthGuard ]  },
    { path: 'dashboard'   , component: DashboardComponent, canActivate: [ AuthGuard ]  },
    { path: 'dashboard/pedidos'   , component: PedidosComponent, canActivate: [ AuthGuard ]  },
    { path: '**', pathMatch: 'full', redirectTo: 'home'}
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
