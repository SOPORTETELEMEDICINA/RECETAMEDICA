export class Entity {
  idEntidad!: number;
  nombre!: string;
  abreviatura!: string;
  idPais!: number;

  constructor(entity: Entity) {
    {
      this.idEntidad = entity.idEntidad || 0;
      this.nombre = entity.nombre || '';
      this.abreviatura = entity.abreviatura || '';
      this.idPais = entity.idPais || 0;
    }
  }
}

