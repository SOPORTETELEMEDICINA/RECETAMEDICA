// noinspection DuplicatedCode

export class PatientByIdMedic {
  idUsuario: string;
  idTipoUsuario: string;
  idPaciente: string;
  idGEMP: string;
  grupoEmpresarial: string;
  idSucursal: string;
  sucursal: string;
  usr: string;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  edad: number;
  idEntidadNacimiento: number;
  entidadNacimiento: string;
  genero: string;
  movil: string;
  email: string;
  domicilio: string;
  idAsentamiento: number;
  asentamiento: string;
  idTipoAsentamiento: number;
  tipoAsentamiento: string;
  idCP: number;
  codigoPostal: string;
  idMunicipio: number;
  noMunicipio: number;
  municipio: string;
  idCiudad: number;
  ciudad: string;
  idEntidad: number;
  estado: string;
  abreviatura: string;
  firma: string;
  imagen: string;
  alergias: any[];
  molecules: any[];
  patologias: any[];

  constructor(patient: PatientByIdMedic) {
    {
      this.idUsuario = patient.idUsuario || '';
      this.idTipoUsuario = patient.idTipoUsuario || '';
      this.idPaciente = patient.idPaciente || '';
      this.idGEMP = patient.idGEMP || '';
      this.grupoEmpresarial = patient.grupoEmpresarial || '';
      this.idSucursal = patient.idSucursal || '';
      this.sucursal = patient.sucursal || '';
      this.usr = patient.usr || '';
      this.nombres = patient.nombres || '';
      this.primerApellido = patient.primerApellido || '';
      this.segundoApellido = patient.segundoApellido || '';
      this.fechaNacimiento = patient.fechaNacimiento || '';
      this.edad = patient.edad || 0;
      this.idEntidadNacimiento = patient.idEntidadNacimiento || 0;
      this.entidadNacimiento = patient.entidadNacimiento || '';
      this.genero = patient.genero || '';
      this.movil = patient.movil || '';
      this.email = patient.email || '';
      this.domicilio = patient.domicilio || '';
      this.idAsentamiento = patient.idAsentamiento || 0;
      this.asentamiento = patient.asentamiento || '';
      this.idTipoAsentamiento = patient.idTipoAsentamiento || 0;
      this.tipoAsentamiento = patient.tipoAsentamiento || '';
      this.idCP = patient.idCP || 0;
      this.codigoPostal = patient.codigoPostal || '';
      this.idMunicipio = patient.idMunicipio || 0;
      this.noMunicipio = patient.noMunicipio || 0;
      this.municipio = patient.municipio || '';
      this.idCiudad = patient.idCiudad || 0;
      this.ciudad = patient.ciudad || '';
      this.idEntidad = patient.idEntidad || 0;
      this.estado = patient.estado || '';
      this.abreviatura = patient.abreviatura || '';
      this.firma = patient.firma || '';
      this.imagen = patient.imagen || '';
      this.alergias = patient.alergias || [];
      this.molecules = patient.molecules || [];
      this.patologias = patient.patologias || [];
    }
  }
}
