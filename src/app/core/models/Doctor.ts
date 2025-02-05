export class Doctor {
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
  tipoAsentamiento: string;
  idCP: number;
  codigoPostal: string;
  idMunicipio: number;
  municipio: string;
  idCiudad: number;
  ciudad: string;
  idEntidad: number;
  estado: string;

  constructor(doctor: Doctor) {
    {
      this.idMedico = doctor.idMedico || '';
      this.idUsuario = doctor.idUsuario || '';
      this.cedulaGeneral = doctor.cedulaGeneral || '';
      this.universidad = doctor.universidad || '';
      this.especialidad = doctor.especialidad || '';
      this.cedulaEspecialidad = doctor.cedulaEspecialidad || '';
      this.horario = doctor.horario || '';
      this.nombres = doctor.nombres || '';
      this.primerApellido = doctor.primerApellido || '';
      this.segundoApellido = doctor.segundoApellido || '';
      this.movil = doctor.movil || '';
      this.email = doctor.email || '';
      this.domicilio = doctor.domicilio || '';
      this.idAsentamiento = doctor.idAsentamiento || 0;
      this.asentamiento = doctor.asentamiento || '';
      this.tipoAsentamiento = doctor.tipoAsentamiento || '';
      this.idCP = doctor.idCP || 0;
      this.codigoPostal = doctor.codigoPostal || '';
      this.idMunicipio = doctor.idMunicipio || 0;
      this.municipio = doctor.municipio || '';
      this.idCiudad = doctor.idCiudad || 0;
      this.ciudad = doctor.ciudad || '';
      this.idEntidad = doctor.idEntidad || 0;
      this.estado = doctor.estado || '';
    }
  }
}
