import { PersonaModel } from './persona.model';

export class AlumnoModel extends PersonaModel {
  constructor(
    nombre: string,
    apellido: string,
    email: string,
    private legajo: number,
    private fechaAlta: string,
    private modificacion: string,
    private isActive: boolean
  ) {
    super(nombre, apellido, email);
  }

  public getLegajo(): number {
    return this.legajo;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getAllAttributes(): object {
    return {
      ...super.getAllAttributes(),
      legajo: this.legajo,
      fechaAlta: this.fechaAlta,
      modificacion: this.modificacion,
      isActive: this.isActive
    };
  }
}