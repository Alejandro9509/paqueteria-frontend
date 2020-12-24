import DepartamentoPage from './Views/Departamento';
import RecoleccionPage from './Views/Recoleccion';
import EmbalajesPage from './Views/Embalajes';
import EmbarquePage from './Views/Embarque';
import CatalogosPage from './Views/Catalogos';

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
    path: "/Catalogos",
    name: "Catálogos",
    icon: "fa fa-book",
    component: CatalogosPage,
  },
  {
    path: "/Recolección",
    name: "Recolección",
    icon: "zmdi zmdi-local-shipping",
    component: RecoleccionPage,
  },
  {
    path: "/Embarque",
    name: "Embarque",
    icon: "fa fa-dropbox",
    component: EmbarquePage,
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
  {
    path: "/Embalajes",
    name: "Embalajes",
    icon: "fa fa-cube",
    component: EmbalajesPage,
  },
];

export default dashboardRoutes;
