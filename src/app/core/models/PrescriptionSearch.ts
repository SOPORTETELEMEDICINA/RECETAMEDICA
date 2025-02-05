export class PrescriptionSearch {
  alergias: any[];
  patologias: any[];
  molecules: any[];
  medicamentos: any[];

  constructor(prescription: PrescriptionSearch) {
    this.alergias = prescription.alergias || [];
    this.patologias = prescription.patologias || [];
    this.molecules = prescription.molecules || [];
    this.medicamentos = prescription.medicamentos || [];
  }
}
