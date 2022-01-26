import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Rol } from '../_model/rol';
import { GenericService } from './generic.service';
@Injectable({
  providedIn: 'root'
})
export class RolService extends GenericService<Rol> {

  constructor(protected override http: HttpClient) {
    super(
      http,
      `${environment.HOST}/roles`);
  }

  rolPorUsuario(usuario: string){
    return this.http.get<Rol>(`${this.url}/${usuario}`);
  }
}
