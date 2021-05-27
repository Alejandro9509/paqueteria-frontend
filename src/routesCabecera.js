import Tutoriales from "./Views/Tutoriales/Tutoriales";
import Actualizacion from "./Views/Actualizacion/Actualizacion";
import AccesosDirectos from "./Views/AccesosDirectos/AccesosDirectos";


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
        path: "/AccesosDirectos",
        name: "Accesos Directos",
        component: AccesosDirectos
    }
];

export default cabeceraRoutes;