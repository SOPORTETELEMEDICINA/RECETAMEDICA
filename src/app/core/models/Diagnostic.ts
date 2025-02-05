export class Diagnostic {
  idCIM10!: number;
  nameCIM10!: string;
  code!: string;

  constructor(diagnostico: Diagnostic) {
    {
      this.idCIM10 = diagnostico.idCIM10 || 0;
      this.nameCIM10 = diagnostico.nameCIM10 || '';
      this.code = diagnostico.code || '';
    }
  }
}
