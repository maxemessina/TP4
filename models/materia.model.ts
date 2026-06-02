export class MateriaModel {
  constructor(
    private idMateria: string,
    private nombre: string,
    private cuatrimestre: number
  ) {}

  public getIdMateria(): string {
    return this.idMateria;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public getCuatrimestre(): number {
    return this.cuatrimestre;
  }

  public getAllAttributes(): object {
    return {
      idMateria: this.idMateria,
      nombre: this.nombre,
      cuatrimestre: this.cuatrimestre
    };
  }
}