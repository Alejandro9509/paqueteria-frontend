import DepartamentoPage from './Views/Departamento';
import RecoleccionPage from './Views/Recoleccion';
import EmbalajesPage from './Views/Embalajes'
import GrupoUnidadesPage from './Views/GrupoUnidades'
import InformesPage from './Views/Informes'

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
      path: "/Informes",
      name: "Informes",
      icon: "fa fa-file-text",
      component: InformesPage,
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
  {
    path: "/GrupoDeUnidades",
    name: "Grupo de Unidades",
    icon: "fa fa-truck",
    component: GrupoUnidadesPage,
  }
];

export default dashboardRoutes;
