// Interfaces
export interface IReceta {
  idReceta: string;
  idMedico: string;
  nombresMedico: string;
  primerApellidoMedico: string;
  segundoApellidoMedico: string;
  movil: string;
  email: string;
  universidad: string;
  cedulaGeneral: string;
  especialidad: string;
  cedulaEspecialidad: string;
  horario: string;
  firma: string;
  idPaciente: string;
  nombresPaciente: string;
  primerApellidoPaciente: string;
  segundoApellidoPaciente: string;
  pacPeso: number;
  genero: string;
  pacTalla: number;
  idGEMP: string;
  nombreGrupoEmpresarial: string;
  logoBase64: string;
  idSucursal: string;
  numeroSucursal: string;
  nombreSucursal: string;
  registroSanitario: string;
  domicilioSucursal: string;
  idAsentamiento: number;
  nombreAsentamiento: string;
  idTipoAsentamiento: number;
  tipoAsentamiento: string;
  idCP: number;
  codigoPostal: string;
  idMunicipio: number;
  nombreMunicipio: string;
  idCiudad: number;
  nombreCiudad: string;
  idEntidad: number;
  estado: string;
  abreviatura: string;
}

export interface IDetalleReceta {
  idDetalleReceta: string;
  idReceta: string;
  medicamentoType: string;
  medicamentoId: number;
  medicamentoNombre: string;
  unidadDispensacionId: number;
  unidadDispensacion: string;
  rutaAdministracionId: number;
  rutaAdministracion: string;
  cantidadDiaria: number;
  indicacion: string;
  indicacionNombre: string;
  frecuencia: string;
  observaciones: string;
  duracion: number;
  unidadDuracion: string;
  periodoInicio: string;
  periodoTerminacion: string;
  surtido: boolean;
}

export interface IRecetaCompleta {
  receta: IReceta;
  detalles: IDetalleReceta[];
}

export class RecetaCompleta implements IRecetaCompleta {
  receta: IReceta;
  detalles: IDetalleReceta[];

  constructor(data: IRecetaCompleta) {
    this.receta = data.receta;
    this.detalles = data.detalles;
  }
}
