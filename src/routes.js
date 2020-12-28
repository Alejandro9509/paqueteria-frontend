import DepartamentoPage from './Views/Departamento';
import RecoleccionPage from './Views/Recoleccion';
import EmbarquePage from './Views/Embarque';
import EmbalajesPage from './Views/Embalajes'
import GrupoUnidadesPage from './Views/GrupoUnidades'
import UnidadesPage from './Views/Unidades';
import RemitentesDestinatariosPage from './Views/RemitentesDestinatarios';
import OperadoresPage from './Views/Operadores';
import PlantillaPage from './Views/PlantillaSinPasos';
import CatalogosPage from './Views/Catalogos';

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
    path: "/Catalogos",
    name: "Catálogos",
    icon: <i className="fa fa-book" />,                   //<IconoCatalogo />,
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
  }
];

export default dashboardRoutes;
