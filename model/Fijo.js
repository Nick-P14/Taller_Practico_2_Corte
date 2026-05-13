class Fijo extends Empleado{
    constructor(cc, nombre_apellido, direccion, email, sueldoBase, tipodeEmpleado,tipodebono, tiempo) {
        super(cc, nombre_apellido, direccion, email, sueldoBase, tipodeEmpleado,tipodebono);    
        this.tiempo = tiempo;
    }
}