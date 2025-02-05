export interface IAlergia {
  idAllergy: number;
  nameAllergy: string;
}

export interface IMolecula {
  idMolecule: number;
  nameMolecule: string;
}

export interface IPatologia {
  idCIM10: number;
  nameCIM10: string;
  code: string;
}

export interface IDetalleReceta {
  idDetalleReceta: string;
  idReceta: string;
  medicamentoType: string;
  medicamentoId: number;
  medicamento: string;
  cantidadDiaria: number;
  unidadDispensacionId: number;
  unidadDispensacion: string;
  rutaAdministracionId: number;
  rutaAdministracion: string;
  indicacion: string;
  duracion: number;
  unidadDuracion: string;
  periodoInicio: string;
  periodoTerminacion: string;
  surtido: boolean;
  indicacionNombre: '',
  frecuencia: '',
  observaciones: '',
}
