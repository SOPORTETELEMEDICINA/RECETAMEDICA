export class PrescriptionLine {
  drugType: string;
  drug: string;
  dose: number | null;
  unitId: number | null;
  frequencyType: string;
  duration: number | null;
  durationType: string;
  route: number | null;
  indication: string;
  name: string;
  summary: string;
  indicationName: string;
  frecuency: string;
  obs: string;
  unitIdName: string;
  durationName: string;
  routeName: string;

  constructor(prescriptionLine: PrescriptionLine) {
    this.drugType = prescriptionLine.drugType || '';
    this.drug = prescriptionLine.drug || '';
    this.dose = prescriptionLine.dose || null;
    this.unitId = prescriptionLine.unitId || null;
    this.frequencyType = prescriptionLine.frequencyType || '';
    this.duration = prescriptionLine.duration || null;
    this.durationType = prescriptionLine.durationType || '';
    this.route = prescriptionLine.route || null;
    this.indication = prescriptionLine.indication || '';
    this.name = prescriptionLine.name || '';
    this.summary = prescriptionLine.summary || '';
    this.indicationName = prescriptionLine.indicationName || '';
    this.frecuency = prescriptionLine.frecuency || '';
    this.obs = prescriptionLine.obs || '';
    this.unitIdName = prescriptionLine.unitIdName || '';
    this.durationName = prescriptionLine.durationName || '';
    this.routeName = prescriptionLine.routeName || '';
  }
}
