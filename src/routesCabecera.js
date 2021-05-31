import Tutoriales from "./Views/Tutoriales/Tutoriales";
import Actualizacion from "./Views/Actualizacion/Actualizacion";
import AccesosDirectos from "./Views/AccesosDirectos/AccesosDirectos";
import QuejasSugerencias from "./Views/QuejasSugerencias/QuejasSugerencias";


const cabeceraRoutes = [
    {
        path: "/Tutoriales",
        name: "Tutoriales",
        component: Tutoriales,
    },
    {
        path: "/Actualizacion",
        name: "Actualización",
        component: Actualizacion
    },
    {
        path: "/QuejasSugerencias",
        name: "Quejas y Sugerencias",
        component: QuejasSugerencias,
    },
    {
        path: "/AccesosDirectos",
        name: "Accesos Directos",
        component: AccesosDirectos
    }
];

export default cabeceraRoutes;