export class Pedido {
    id: string;
    fecha: string;
    hora: string;
    platillo: string;
    descripcion: string;
    realizado: boolean;
    idx?: number;

    constructor() {
        this.realizado = false;
    }
}
