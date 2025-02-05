export class GEMP {
  nombre!: string;
  idGEMP!: string;
  logoBase64!: string;

  constructor(grupoEmpresarial: GEMP) {
    {
      this.nombre = grupoEmpresarial.nombre || '';
      this.idGEMP = grupoEmpresarial.idGEMP || '';
      this.logoBase64 = grupoEmpresarial.logoBase64 || '';
    }
  }
}
