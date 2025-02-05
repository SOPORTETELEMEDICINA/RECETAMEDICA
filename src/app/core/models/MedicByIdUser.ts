export class MedicByIdUser {
  idGEMP: string;
  grupoEmpresarial: string;
  idSucursal: string;
  sucursal: string;
  usr: string;
  idMedico: string;
  idUsuario: string;
  cedulaGeneral: string;
  universidad: string;
  especialidad: string;
  cedulaEspecialidad: string;
  horario: string;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
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

  constructor(medic: MedicByIdUser) {
    {
      this.idGEMP = medic.idGEMP || '';
      this.grupoEmpresarial = medic.grupoEmpresarial || '';
      this.idSucursal = medic.idSucursal || '';
      this.sucursal = medic.sucursal || '';
      this.usr = medic.usr || '';
      this.idMedico = medic.idMedico || '';
      this.idUsuario = medic.idUsuario || '';
      this.cedulaGeneral = medic.cedulaGeneral || '';
      this.universidad = medic.universidad || '';
      this.especialidad = medic.especialidad || '';
      this.cedulaEspecialidad = medic.cedulaEspecialidad || '';
      this.horario = medic.horario || '';
      this.nombres = medic.nombres || '';
      this.primerApellido = medic.primerApellido || '';
      this.segundoApellido = medic.segundoApellido || '';
      this.movil = medic.movil || '';
      this.email = medic.email || '';
      this.domicilio = medic.domicilio || '';
      this.idAsentamiento = medic.idAsentamiento || 0;
      this.asentamiento = medic.asentamiento || '';
      this.idTipoAsentamiento = medic.idTipoAsentamiento || 0;
      this.tipoAsentamiento = medic.tipoAsentamiento || '';
      this.idCP = medic.idCP || 0;
      this.codigoPostal = medic.codigoPostal || '';
      this.idMunicipio = medic.idMunicipio || 0;
      this.noMunicipio = medic.noMunicipio || 0;
      this.municipio = medic.municipio || '';
      this.idCiudad = medic.idCiudad || 0;
      this.ciudad = medic.ciudad || '';
      this.idEntidad = medic.idEntidad || 0;
      this.estado = medic.estado || '';
      this.abreviatura = medic.abreviatura || '';
      this.firma = medic.firma || '';
      this.imagen = medic.imagen || '';
    }
  }
}
