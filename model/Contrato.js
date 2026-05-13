class Contrato extends Empleado{
    constructor(tiempo, cc, nombre_apellido, direccion, email, sueldoBase, tipodeEmpleado,tipodebono) {
        super(cc, nombre_apellido, direccion, email, sueldoBase, tipodeEmpleado,tipodebono);    
        this.tiempo = tiempo;
    }
}