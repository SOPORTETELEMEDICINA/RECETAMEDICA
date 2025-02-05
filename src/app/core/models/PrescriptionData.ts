import {IAlergia, IDetalleReceta, IMolecula, IPatologia} from "@core/interfaces/receta-data";

export class PrescriptionData {

  receta!: {
    idReceta: string;
    idMedico: string;
    nombresMedico: string;
    primerApellidoMedico: string;
    segundoApellidoMedico: string;
    universidad: string;
    cedulaGeneral: string;
    especialidad: string;
    cedulaEspecialidad: string;
    idPaciente: string;
    nombresPaciente: string;
    primerApellidoPaciente: string;
    segundoApellidoPaciente: string;
    fechaNacimientoPaciente: string;
    pacPeso: number;
    pacTalla: number;
    pacEmbarazo: boolean;
    pacSemAmenorrea: number;
    pacLactancia: boolean;
    pacCreatinina: number;
    alergias: IAlergia[];
    molecules: IMolecula[];
    patologias: IPatologia[];
    idSucursal: string;
    idGEMP: string;
    fechaCreacion: string;
    edad: number;
  };
  detalles!: IDetalleReceta[];
}
