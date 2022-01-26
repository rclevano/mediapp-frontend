import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignoVitalService } from './../../_service/signo-vital.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SignoVital } from './../../_model/signoVital';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-signo-vital',
  templateUrl: './signo-vital.component.html',
  styleUrls: ['./signo-vital.component.css']
})
export class SignoVitalComponent implements OnInit {

  displayedColumns = ['id','paciente','fecha', 'temperatura', 'pulso','ritmoCardiaco','acciones'];
  dataSource: MatTableDataSource<SignoVital>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private signoVitalService: SignoVitalService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.signoVitalService.getSignoVitalCambio().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.signoVitalService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'Aviso', {
        duration: 2000,
      });
    });

    this.signoVitalService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  filtrar(e: any) {
    //alert(e.target.value.trim().toLowerCase())
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  eliminar(signoVital: SignoVital) {
    this.signoVitalService.eliminar(signoVital.idSignoVital).pipe(switchMap(() => {
      return this.signoVitalService.listar();
    })).subscribe(data => {
      this.signoVitalService.setSignoVitalCambio(data);
      this.signoVitalService.setMensajeCambio('Se eliminó');
    });
  }

  verificarHijos(){
    return this.route.children.length !== 0
  }

}
