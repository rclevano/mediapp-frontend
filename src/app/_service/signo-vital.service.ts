import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SignoVital } from '../_model/signoVital';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class SignoVitalService extends GenericService<SignoVital>{
  private signoVitalCambio = new Subject<SignoVital[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(
      http,
      `${environment.HOST}/signosvitales`);
  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }


  ////////get set ///////

  getSignoVitalCambio() {
    return this.signoVitalCambio.asObservable();
  }

  setSignoVitalCambio(pacientes: SignoVital[]) {
    this.signoVitalCambio.next(pacientes);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
