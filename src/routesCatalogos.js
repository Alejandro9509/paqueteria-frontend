import DepartamentoPage from './Views/Departamento';
import RecoleccionPage from './Views/Recoleccion';
import EmbalajesPage from './Views/Embalajes';
import EmbarquePage from './Views/Embarque';
import CatalogosPage from './Views/Catalogos';
import TipoServicioPage from './Views/TiposServicio'

const catalogRoutes = [
  {
    path: "/Departamento",
    name: "Grupo Clientes",
    icon: <i className="fa fa-users" />,
    component: DepartamentoPage,
  },
  {
    path: "/Departamento",
    name: "Clientes",
    icon: <i className="fa fa-user" />,
    component: DepartamentoPage,
  },
  {
    path: "/Catalogos",
    name: "Rem / Des",
    icon: <i className="fa fa-male" />,
    component: CatalogosPage,
  },
  {
    path: "/Recolección",
    name: "Puesto",
    icon: <i className="zmdi zmdi-account-o" />,
    component: RecoleccionPage,
  },
  {
    path: "/Embarque",
    name: "Departamento",
    icon: <i className="fa fa-sitemap" />,
    component: EmbarquePage,
  },
  {
    path: "/Departamento",
    name: "Operadores",
    icon: <i className="fa fa-users" />,
    component: DepartamentoPage,
  },
  {
    path: "/Departamento",
    name: "Tipo Unidad",
    icon: <i className="fa fa-users" />,
    component: DepartamentoPage,
  },
  {
    path: "/Departamento",
    name: "Grupo Unidades",
    icon: <i className="fa fa-users" />,
    component: DepartamentoPage,
  },
  {
    path: "/Embalajes",
    name: "Unidades",
    icon: <i className="fa fa-users" />,
    component: EmbalajesPage,
  },


  {
    path: "/Embalajes",
    name: "Estatus Unidades",
    icon: <i className="fa fa-users" />,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Embalajes",
    icon: <i className="fa fa-users" />,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Tipos Viaje",
    icon: <i className="fa fa-users" />,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Estatus Viaje",
    icon: <i className="fa fa-users" />,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Estatus Embarque",
    icon: <i className="fa fa-users" />,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Estatus Recolección",
    icon: <i className="fa fa-users" />,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Estatus Guías",
    icon: <i className="fa fa-users" />,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Estatus Informe",
    icon: <i className="fa fa-users" />,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Estatus Documentos",
    icon: <i className="fa fa-users" />,
    component: EmbalajesPage,
  },

  {
    path: "/Embalajes",
    name: "Clasificación Viaje",
    icon: <i className="fa fa-users" />,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Casetas",
    icon: <i className="fa fa-users" />,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Impuestos",
    icon: <i className="fa fa-users" />,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Conceptos Fact.",
    icon: <i className="fa fa-users" />,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Rutas",
    icon: <i className="fa fa-users" />,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Tarifas",
    icon: <i className="fa fa-users" />,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Tipos de Cobro",
    icon: <i className="fa fa-users" />,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Parámetros Configuración",
    icon: <i className="fa fa-users" />,
    component: EmbalajesPage,
  },
];

export default catalogRoutes;
