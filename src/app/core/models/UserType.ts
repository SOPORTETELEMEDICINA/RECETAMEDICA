export class UserType {
  idTipoUsuario!: string;
  nombre!: string;

  constructor(tipoUsuario: UserType) {
    {
      this.idTipoUsuario = tipoUsuario.idTipoUsuario || '';
      this.nombre = tipoUsuario.nombre || '';
    }
  }
}
