export class FilterReceta {
  idSucursal: string | null;
  idGEMP: string | null;
  startDate: string | null;
  endDate: string | null;
  dateFilter: string | null;

  constructor(filter: FilterReceta) {
    this.idSucursal = filter.idSucursal || null;
    this.idGEMP = filter.idGEMP || null;
    this.startDate = filter.startDate || null;
    this.endDate = filter.endDate || null;
    this.dateFilter = filter.dateFilter || null;
  }
}
