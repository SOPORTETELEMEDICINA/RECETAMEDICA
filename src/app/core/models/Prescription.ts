export class Prescription {
  idReceta: string;
  idMedico: string;
  nombreMedico: string;
  idPaciente: string;
  nombrePaciente: string;
  idSucursal: string;
  idGEMP: string;
  fechaCreacion: string;
  fechaUltimaModificacion: string;

  constructor(prescription: Prescription) {
    this.idReceta = prescription.idReceta || '';
    this.idMedico = prescription.idMedico || '';
    this.nombreMedico = prescription.nombreMedico || '';
    this.idPaciente = prescription.idPaciente || '';
    this.nombrePaciente = prescription.nombrePaciente || '';
    this.idSucursal = prescription.idSucursal || '';
    this.idGEMP = prescription.idGEMP || '';
    this.fechaCreacion = prescription.fechaCreacion || '';
    this.fechaUltimaModificacion = prescription.fechaUltimaModificacion || '';
  }
}
