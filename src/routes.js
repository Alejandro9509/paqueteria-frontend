import DepartamentoPage from './Views/Departamento';
import RecoleccionPage from './Views/Recoleccion';
import EmbalajesPage from './Views/Embalajes'
import GrupoUnidadesPage from './Views/GrupoUnidades'
import UnidadesPage from './Views/Unidades';
import RemitentesDestinatariosPage from './Views/RemitentesDestinatarios';
import OperadoresPage from './Views/Operadores';
import PlantillaPage from './Views/PlantillaSinPasos';
import RutasPage from './Views/Rutas';




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
  },  {
    path: "/Unidades",
    name: "Unidades",
    icon: "fa fa-cube",
    component: UnidadesPage,
  },
  {
    path: "/RemitentesDestinatarios",
    name: "RemitentesDestinatarios",
    icon: "fa fa-cube",
    component: RemitentesDestinatariosPage,
  },
  {
    path: "/Operadores",
    name: "Operadores",
    icon: "fa fa-cube",
    component: OperadoresPage,
  }
  ,
  {
    path: "/PlantillaSinPasos",
    name: "Plantilla",
    icon: "fa fa-cube",
    component: PlantillaPage,
  },
  {
    path: "/Rutas",
    name: "Rutas",
    icon: "fa fa-cube",
    component: RutasPage,
  }
];

export default dashboardRoutes;
