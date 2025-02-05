export class PostalCode {
  idCP!: number;
  codigoPostal!: string;
  idEntidad!: number;
  idMunicipio!: number;
  nombreEntidad!: string;
  nombreMunicipio!: string;

  constructor(postalCode: PostalCode) {
    {
      this.idCP = postalCode.idCP || 0;
      this.codigoPostal = postalCode.codigoPostal || '';
      this.idEntidad = postalCode.idEntidad || 0;
      this.idMunicipio = postalCode.idMunicipio || 0;
      this.nombreEntidad = postalCode.nombreEntidad || '';
      this.nombreMunicipio = postalCode.nombreMunicipio || '';
    }
  }
}

