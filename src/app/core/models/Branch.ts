export class Branch {
  idSucursal!: string;
  idGEMP!: string;
  numero!: number;
  nombre!: string;
  registroSanitario!: string;
  responsable!: string;
  cedulaResponsable!: string;
  telefonoResponsable!: string;
  emailResponsable!: string;
  domicilio!: string;
  idAsentamiento!: number;
  nombreAsentamiento!: string;
  idTipoAsentamiento!: number;
  tipoAsentamiento!: string;
  idCP!: number;
  codigoPostal!: string;
  idMunicipio!: number;
  noMunicipio!: number;
  municipio!: string;
  idCiudad!: number;
  ciudad!: string;
  idEntidad!: number;
  estado!: string;
  abreviatura!: string;
  status!: string;

  constructor(sucursal: Branch) {
    {
      this.idSucursal = sucursal.idSucursal || '';
      this.idGEMP = sucursal.idGEMP || '';
      this.numero = sucursal.numero || 0;
      this.nombre = sucursal.nombre || '';
      this.registroSanitario = sucursal.registroSanitario || '';
      this.responsable = sucursal.responsable || '';
      this.cedulaResponsable = sucursal.cedulaResponsable || '';
      this.telefonoResponsable = sucursal.telefonoResponsable || '';
      this.emailResponsable = sucursal.emailResponsable || '';
      this.domicilio = sucursal.domicilio || '';
      this.idAsentamiento = sucursal.idAsentamiento || 0;
      this.nombreAsentamiento = sucursal.nombreAsentamiento || '';
      this.idTipoAsentamiento = sucursal.idTipoAsentamiento || 0;
      this.tipoAsentamiento = sucursal.tipoAsentamiento || '';
      this.idCP = sucursal.idCP || 0;
      this.codigoPostal = sucursal.codigoPostal || ''
      this.idMunicipio = sucursal.idMunicipio || 0;
      this.noMunicipio = sucursal.noMunicipio || 0;
      this.municipio = sucursal.municipio || '';
      this.idCiudad = sucursal.idCiudad || 0;
      this.ciudad = sucursal.ciudad || '';
      this.idEntidad = sucursal.idEntidad || 0;
      this.estado = sucursal.estado || '';
      this.abreviatura = sucursal.abreviatura || ''
      this.status = sucursal.status || '';
    }
  }
}
