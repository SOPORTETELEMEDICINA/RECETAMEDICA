import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {PatientLine} from "@core/models/PatientLine";

@Injectable({
  providedIn: 'root'
})
export class PatientHistoryService {
  private patientHistory: PatientLine[] = [];
  dataChange: BehaviorSubject<PatientLine[]> = new BehaviorSubject<PatientLine[]>(this.patientHistory);

  constructor() {
  }

  get data(): PatientLine[] {
    return this.dataChange.value;
  }

  /** CRUD methods */
  addPatientLine(prescriptionLine: PatientLine): void {

    this.patientHistory.push(new PatientLine(prescriptionLine));
    this.dataChange.next(this.patientHistory);
  }

  resetDataSource(): void {
    this.patientHistory = [];
    this.dataChange.next([]);
  }
}
