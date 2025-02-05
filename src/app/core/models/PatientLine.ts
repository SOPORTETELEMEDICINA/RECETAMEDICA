export class PatientLine {
  detailTypeId: number
  detailType: string;
  detailTypeName: string;
  cronical: boolean;
  type: number;
  detailTypeCode?: string;

  constructor(patientLine: PatientLine) {
    this.detailTypeId = patientLine.detailTypeId || 0;
    this.detailType = patientLine.detailType || '';
    this.detailTypeName = patientLine.detailTypeName || '';
    this.cronical = patientLine.cronical || false;
    this.detailTypeCode = patientLine.detailTypeCode || '';
    this.type = patientLine.type || 0;
  }
}
