import { Component, OnInit } from '@angular/core';
import { Menu } from 'src/app/_model/menu';
import { Rol } from 'src/app/_model/rol';
import { LoginService } from 'src/app/_service/login.service';
import { MenuService } from 'src/app/_service/menu.service';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from 'src/environments/environment';
import { RolService } from 'src/app/_service/rol.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  menus: Menu[];
  usuario: string;
  rol: Rol[];
  rolUsuario: string;

  constructor(
    private menuService: MenuService,
    private rolService: RolService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    const helper = new JwtHelperService();

    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    let tokenDecodificado = helper.decodeToken(token);
    this.usuario = tokenDecodificado.user_name;

    this.rolService.rolPorUsuario(this.usuario).subscribe(data => {
        this.rolUsuario = this.usuario + ' [' + data.nombre + ']';
    });


    this.menuService.getMenuCambio().subscribe(data => {
      this.menus = data;
    });

  }

  cerrarSesion(){
    this.loginService.cerrarSesion();
  }

}
