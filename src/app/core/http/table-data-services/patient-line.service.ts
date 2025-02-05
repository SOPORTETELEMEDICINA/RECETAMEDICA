import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {PatientLine} from "@core/models/PatientLine";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";

@Injectable({
  providedIn: 'root'
})
export class PatientLineService {
  private patientLine: PatientLine[] = [];
  dataChange: BehaviorSubject<PatientLine[]> = new BehaviorSubject<PatientLine[]>(this.patientLine);

  constructor(private gfs: GeneralFunctionsService) {
  }

  get data(): PatientLine[] {
    return this.dataChange.value;
  }

  /** CRUD methods */
  addPatientLine(prescriptionLine: PatientLine): void {
    const cleanData = this.gfs.mayusAcentos(prescriptionLine);

    this.patientLine.push(new PatientLine(cleanData));
    this.dataChange.next(this.patientLine);
  }

  deletePatientLine(index: number): void {
    this.patientLine.splice(index, 1);
    this.dataChange.next(this.patientLine);
  }

  resetDataSource(): void {
    this.patientLine = [];
    this.dataChange.next([]);
  }
}
