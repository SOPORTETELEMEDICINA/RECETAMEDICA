export class Medicament {
  id!: string;
  idType!: string;
  summary!: string;
  nombre!: string;

  constructor(medicamento: Medicament) {
    {
      this.id = medicamento.id || '';
      this.idType = medicamento.idType || '';
      this.summary = medicamento.summary || '';
      this.nombre = medicamento.nombre || '';
    }
  }

}
