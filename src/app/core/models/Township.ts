export class Township {
  idMunicipio!: number;
  nombre!: string;
  idEntidad!: number;
  noMunicipio!: number;
  nombreEntidad: string

  constructor(township: Township) {
    {
      this.idMunicipio = township.idMunicipio || 0;
      this.nombre = township.nombre || '';
      this.idEntidad = township.idEntidad || 0;
      this.noMunicipio = township.noMunicipio || 0;
      this.nombreEntidad = township.nombreEntidad || '';
    }
  }
}

