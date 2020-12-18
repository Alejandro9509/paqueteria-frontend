import DepartamentoPage from './Views/Departamento';
import RecoleccionPage from './Views/Recoleccion';
import EmbalajesPage from './Views/Embalajes';
import EmbarquePage from './Views/Embarque';

const dashboardRoutes = [
  {
    path: "/Departamento",
    name: "Indicadores",
    icon: <i className="fa fa-pie-chart" />,
    component: DepartamentoPage,
  },
  {
    path: "/Departamento",
    name: "Configuraciones",
    icon: <i className="fa fa-cog" />,                   //<IconoConfiguraciones className="fa" />,
    component: DepartamentoPage,
  },
  {
    path: "/Departamento",
    name: "Catálogos",
    icon: <i className="fa fa-book" />,                   //<IconoCatalogo />,
    component: DepartamentoPage,
  },
  {
    path: "/Recolección",
    name: "Recolección",
    icon: <i className="zmdi zmdi-local-shipping" />,
    component: RecoleccionPage,
  },
  {
    path: "/Embarque",
    name: "Embarque",
    icon: <i className="fa fa-dropbox" />,
    component: EmbarquePage,
  },
  {
    path: "/Departamento",
    name: "Guías",
    icon: <i className="zmdi zmdi-assignment" />,
    component: DepartamentoPage,
  },
  {
    path: "/Departamento",
    name: "Informes",
    icon: <i className="fa fa-file-text" />,
    component: DepartamentoPage,
  },
  {
    path: "/Departamento",
    name: "Viajes",
    icon: <i className="fa fa-road" />,
    component: DepartamentoPage,
  },
  {
    path: "/Embalajes",
    name: "Embalajes",
    icon: <i className="fa fa-cube" />,
    component: EmbalajesPage,
  },
];

export default dashboardRoutes;
