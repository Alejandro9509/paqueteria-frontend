import Tutoriales from "./Views/Tutoriales/Tutoriales";
import Actualizacion from "./Views/Actualizacion/Actualizacion";
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
    }
];

export default cabeceraRoutes;