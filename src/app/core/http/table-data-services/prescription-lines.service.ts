import {BehaviorSubject, forkJoin, Observable, Subject} from 'rxjs';
import {PrescriptionLine} from "@core/models/PrescriptionLine";
import {Injectable} from "@angular/core";
import {environment} from "@enviroment/environment";
import {HttpClient} from "@angular/common/http";
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";

@Injectable({
  providedIn: 'root',
})
export class PrescriptionLineService {
  private htmlResponseSubject = new Subject<string>();
  private prescriptionLines: PrescriptionLine[] = [];
  dataChange: BehaviorSubject<PrescriptionLine[]> = new BehaviorSubject<PrescriptionLine[]>(this.prescriptionLines);

  constructor(private http: HttpClient, private gfs: GeneralFunctionsService) {
  }

  get data(): PrescriptionLine[] {
    return this.dataChange.value;
  }

  /** CRUD methods */
  addPrescriptionLine(prescriptionLine: PrescriptionLine): number {
    const cleanData = this.gfs.mayusAcentos(prescriptionLine);

    this.prescriptionLines.push(new PrescriptionLine(cleanData));
    this.dataChange.next(this.prescriptionLines);
    return this.prescriptionLines.length - 1;
  }

  async updatePrescriptionLine(index: number, updatedLine: PrescriptionLine) {
    const cleanData = this.gfs.mayusAcentos(updatedLine);

    this.prescriptionLines[index] = new PrescriptionLine(cleanData);
    this.dataChange.next(this.prescriptionLines);
  }

  deletePrescriptionLine(index: number): void {
    this.prescriptionLines.splice(index, 1);
    this.dataChange.next(this.prescriptionLines);
  }

  getRelations(drug: string, drugType: string): Observable<{ routes: any[], indications: any[], units: any[] }> {
    const routesUrl = `${environment.backend_url}Consulta/GetRelaciones?Id=${drug}&IdType=${drugType}&RelacionType=ROUTES`;
    const indicationsUrl = `${environment.backend_url}Consulta/GetRelaciones?Id=${drug}&IdType=${drugType}&RelacionType=INDICATIONS`;
    const unitsUrl = `${environment.backend_url}Consulta/GetRelaciones?Id=${drug}&IdType=${drugType}&RelacionType=UNITS`;

    return forkJoin({
      routes: this.http.post<any[]>(routesUrl, {}),
      indications: this.http.post<any[]>(indicationsUrl, {}),
      units: this.http.post<any[]>(unitsUrl, {}),
    });
  }

  postToAnalytics(data: any): void {
    const cleanData = this.gfs.mayusAcentos(data);
    const url = `${environment.backend_url}Consulta/Analisis`;

    this.http.post(url, cleanData).subscribe({
      next: (response: any) => {
        this.htmlResponseSubject.next(response.htmlResponse);
      },
      error: (err) => {
        console.error('Error al enviar los datos:', err);
      }
    });
  }

  postToAnalyticsXML(data: any) {
    const cleanData = this.gfs.mayusAcentos(data);

    const url = `${environment.backend_url}Consulta/AnalisisXml`;
    return this.http.post(url, cleanData);
  }

  postToPrescription(data: any) {
    const cleanData = this.gfs.mayusAcentos(data);

    const url = `${environment.backend_url}Consulta/RegistrarReceta`;
    return this.http.post<DefaultResponse<string>>(url, cleanData)
  }

  getHtmlResponse() {
    return this.htmlResponseSubject.asObservable();
  }

  resetPrescriptionDataSource(): void {
    this.prescriptionLines = [];
    this.dataChange.next([]);
  }

  isLineValid(): boolean {
    const lastLine = this.prescriptionLines[this.prescriptionLines.length - 1];
    if (lastLine) {
      return Boolean(lastLine.dose)
        && Boolean(lastLine.unitId)
        && Boolean(lastLine.duration)
        && Boolean(lastLine.durationType)
        && Boolean(lastLine.route)
        && Boolean(lastLine.indication)
        && Boolean(lastLine.frecuency)
        && Boolean(lastLine.obs)
    }
    return true;
  }

}
