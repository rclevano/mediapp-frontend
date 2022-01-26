import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SignoVitalService } from './../../../_service/signo-vital.service';
import { PacienteService } from './../../../_service/paciente.service';
import { SignoVital } from './../../../_model/signoVital';
import { FormGroup, FormControl } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Paciente } from './../../../_model/paciente';
import { map,Observable } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-signo-vital-edicion',
  templateUrl: './signo-vital-edicion.component.html',
  styleUrls: ['./signo-vital-edicion.component.css']
})
export class SignoVitalEdicionComponent implements OnInit {

  pacientes: Paciente[];
  pacientes$: Observable<Paciente[]>;

  idPacienteSeleccionado: number;
  id: number;
  signoVital: SignoVital;
  form: FormGroup;
  edicion: boolean = false;
  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  //utiles para el autocomplete
  myControlPaciente: FormControl = new FormControl();
  pacientesFiltrados$: Observable<Paciente[]>;
  pacienteSeleccionado: Paciente;

  constructor(
    private pacienteService: PacienteService,
    private signoVitalService: SignoVitalService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {

    this.signoVital = new SignoVital();

    this.form = new FormGroup({
      'id': new FormControl(0),
      'fecha': new FormControl(new Date()),
      'paciente': this.myControlPaciente,
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmoCardiaco': new FormControl('')
    });

    this.listarInicial();

    this.pacientesFiltrados$ = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });
  }

  listarInicial() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  filtrarPacientes(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || el.dni.includes(val.dni)
      );
    }
    return this.pacientes.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidos.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
    );
  }

  mostrarPaciente(val: any) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  initForm() {
    if (this.edicion) {
      this.signoVitalService.listarPorId(this.id).subscribe(data => {

        this.form = new FormGroup({
          'id': new FormControl(data.idSignoVital),
          'paciente': this.myControlPaciente,
          //'fecha': new FormControl(data.fecha.substring(0,10)),
          'fecha': new FormControl(moment(data.fecha).format('YYYY-MM-DDTHH:mm:ss')),
          'temperatura': new FormControl(data.temperatura),
          'pulso': new FormControl(data.pulso ),
          'ritmoCardiaco': new FormControl(data.ritmoCardiaco)
        });

        this.myControlPaciente.setValue(data.paciente)
      });
    }else{
      this.form = new FormGroup({
        'id': new FormControl(0),
        'fecha': new FormControl(''),
        'paciente': this.myControlPaciente,
        'temperatura': new FormControl(''),
        'pulso': new FormControl(''),
        'ritmoCardiaco': new FormControl('')
      });
    }
  }

  operar() {
    this.signoVital.idSignoVital = this.form.value['id'];
    this.signoVital.fecha = moment(this.form.value['fecha']).format('YYYY-MM-DDTHH:mm:ss');
    this.signoVital.temperatura = this.form.value['temperatura'];
    this.signoVital.pulso = this.form.value['pulso'];
    this.signoVital.ritmoCardiaco = this.form.value['ritmoCardiaco'];
    this.signoVital.paciente = this.form.value['paciente'];

    if (this.signoVital != null && this.signoVital.idSignoVital > 0) {
      //BUENA PRACTICA
      this.signoVitalService.modificar(this.signoVital).pipe(switchMap(() => {
        return this.signoVitalService.listar();
      })).subscribe(data => {
        this.signoVitalService.setSignoVitalCambio(data);
        this.signoVitalService.setMensajeCambio("Se modificó");
      });

    } else {
      //PRACTICA COMUN
      this.signoVitalService.registrar(this.signoVital).subscribe(data => {
        this.signoVitalService.listar().subscribe(signoVital => {
          this.signoVitalService.setSignoVitalCambio(signoVital);
          this.signoVitalService.setMensajeCambio("Se registró");
        });
      });
    }
    this.router.navigate(['/pages/signo-vital']);
  }

}
