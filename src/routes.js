import DepartamentoPage from './Views/Departamento';
import RecoleccionPage from './Views/Recoleccion';
import EmbarquePage from './Views/Embarque';
import EmbalajesPage from './Views/Embalajes'
import GrupoUnidadesPage from './Views/GrupoUnidades'
import InformesPage from './Views/Informes'
import UnidadesPage from './Views/Unidades';
import RemitentesDestinatariosPage from './Views/RemitentesDestinatarios';
import OperadoresPage from './Views/Operadores';
import PlantillaPage from './Views/PlantillaSinPasos';
import CatalogosPage from './Views/Catalogos';
import ConfiguracionPage from './Views/Configuracion';
import RutasPage from './Views/Rutas';




const dashboardRoutes = [
  {
    path: "/Departamento",
    name: "Indicadores",
    icon: <i className="fa fa-pie-chart" />,
    component: DepartamentoPage,
  },
  {
    path: "/Configuracion",
    name: "Configuraciones",
    icon: <i className="fa fa-cog" />,                   //<IconoConfiguraciones className="fa" />,
    component: ConfiguracionPage,
  },
  {
    path: "/Catalogos",
    name: "Catálogos",
    icon: <i className="zmdi zmdi-collection-text" />,                   //<IconoCatalogo />,
    component: CatalogosPage,
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
    icon: <i className="fa fa-archive" />,
    component: EmbarquePage,
  },
  {
    path: "/Departamento",
    name: "Guías",
    icon: <i className="zmdi zmdi-assignment" />,
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
    icon: <i className="fa fa-road" />,
    component: DepartamentoPage,
  },
  {
    path: "/Embalajes",
    name: "Embalajes",
    icon: <i className="fa fa-cube" />,
    component: EmbalajesPage,
  },
  {
    path: "/GrupoDeUnidades",
    name: "Grupo de Unidades",
    icon: <i className="fa fa-truck"/>,
    component: GrupoUnidadesPage,
  },  {
    path: "/Unidades",
    name: "Unidades",
    icon: <i className="fa fa-cube"/>,
    component: UnidadesPage,
  },
  {
    path: "/RemitentesDestinatarios",
    name: "RemitentesDestinatarios",
    icon: <i className="fa fa-cube" />,
    component: RemitentesDestinatariosPage,
  },
  {
    path: "/Operadores",
    name: "Operadores",
    icon: <i className="fa fa-cube" />,
    component: OperadoresPage,
  }
  ,
  {
    path: "/PlantillaSinPasos",
    name: "Plantilla",
    icon: <i className="fa fa-cube" />,
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
