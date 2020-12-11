import DepartamentoPage from './Views/Departamento';
import RecoleccionPage from './Views/Recoleccion';


const dashboardRoutes = [
  {
    path: "/Departamento",
    name: "Indicadores",
    icon: "fa fa-pie-chart",
    component: DepartamentoPage,
  },
  {
    path: "/Departamento",
    name: "Configuraciones",
    icon: "fa fa-cog",
    component: DepartamentoPage,
  },
  {
    path: "/Departamento",
    name: "Catálogos",
    icon: "fa fa-book",
    component: DepartamentoPage,
  },
  {
    path: "/Recolección",
    name: "Recolección",
    icon: "zmdi zmdi-local-shipping",
    component: RecoleccionPage,
  },
  {
    path: "/Departamento",
    name: "Embarque",
    icon: "fa fa-dropbox",
    component: DepartamentoPage,
  },
  {
    path: "/Departamento",
    name: "Guías",
    icon: "zmdi zmdi-assignment",
    component: DepartamentoPage,
  },
  {
    path: "/Departamento",
    name: "Informes",
    icon: "fa fa-file-text",
    component: DepartamentoPage,
  },
  {
    path: "/Departamento",
    name: "Viajes",
    icon: "fa fa-road",
    component: DepartamentoPage,
  },
];

export default dashboardRoutes;
