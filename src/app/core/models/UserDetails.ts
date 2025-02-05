export class UserDetails {
  idUsuario: string;
  usr: string;
  idTipoUsuario: string;
  tipoUsuario: string;
  idGEMP: string;
  empresa: string;
  idSucursal: string;
  noSucursal: number;
  nombreSucursal: string;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  idAsentamiento: number | undefined;
  nombreAsentamiento: string;
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
  domicilio: string;
  movil: string;
  email: string;
  firma: string;
  imagen: string;
  status: string;
  password?: string;

  constructor(usuario: UserDetails) {
    {
      this.idUsuario = usuario.idUsuario || '';
      this.usr = usuario.usr || '';
      this.idTipoUsuario = usuario.idTipoUsuario || '';
      this.tipoUsuario = usuario.tipoUsuario || '';
      this.idGEMP = usuario.idGEMP || '';
      this.empresa = usuario.empresa || '';
      this.idSucursal = usuario.idSucursal || '';
      this.noSucursal = usuario.noSucursal || 0;
      this.nombreSucursal = usuario.nombreSucursal || '';
      this.nombres = usuario.nombres || '';
      this.primerApellido = usuario.primerApellido || '';
      this.segundoApellido = usuario.segundoApellido || '';
      this.idAsentamiento = usuario.idAsentamiento || 0;
      this.nombreAsentamiento = usuario.nombreAsentamiento || '';
      this.idTipoAsentamiento = usuario.idTipoAsentamiento || 0;
      this.tipoAsentamiento = usuario.tipoAsentamiento || '';
      this.idCP = usuario.idCP || 0;
      this.codigoPostal = usuario.codigoPostal || '';
      this.idMunicipio = usuario.idMunicipio || 0;
      this.noMunicipio = usuario.noMunicipio || 0;
      this.municipio = usuario.municipio || '';
      this.idCiudad = usuario.idCiudad || 0;
      this.ciudad = usuario.ciudad || '';
      this.idEntidad = usuario.idEntidad || 0;
      this.estado = usuario.estado || '';
      this.abreviatura = usuario.abreviatura || '';
      this.domicilio = usuario.domicilio || '';
      this.movil = usuario.movil || '';
      this.email = usuario.email || '';
      this.firma = usuario.firma || '';
      this.imagen = usuario.imagen || '';
      this.status = usuario.status || '';
    }
  }
}
