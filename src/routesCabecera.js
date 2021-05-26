import Tutoriales from "./Views/Tutoriales/Tutoriales";
import Actualizacion from "./Views/Actualizacion/Actualizacion";


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
    }
];

export default cabeceraRoutes;