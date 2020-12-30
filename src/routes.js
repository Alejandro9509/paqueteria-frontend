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



import {ReactComponent as ConfiguracionIcon} from './iconos/Menu/IconoConfiguraciones/iconoConfiguraciones.svg';
import {ReactComponent as IndicadoresIcon} from './iconos/Menu/IconoIndicadores/iconoIndicadores.svg';
import {ReactComponent as CatalogoIcon} from './iconos/Menu/IconoCatalogo/iconoCatalogo.svg';
import {ReactComponent as InformeIcon} from './iconos/Menu/IconoInforme/iconoInforme.svg';
import {ReactComponent as RecolecionIcon} from './iconos/Menu/IconoRecoleccion/iconoRecoleccion.svg';
import {ReactComponent as EmbarqueIcon} from './iconos/Menu/IconoEmbarque/iconoEmbarque.svg';
import {ReactComponent as GuiasIcon} from './iconos/Menu/IconoGuias/iconoGuia.svg';
import {ReactComponent as viajeIcon} from './iconos/Menu/IconoViajes/iconoViajes.svg';

const dashboardRoutes = [
  {
    path: "/Departamento",
    name: "Indicadores",
<<<<<<< HEAD
    icon: <i className="fa fa-pie-chart" />,
=======
    icon: IndicadoresIcon,
>>>>>>> feature/componentes
    component: DepartamentoPage,
    single: true,
    child:[]
  },
  {
    path: "/Configuracion",
    name: "Configuraciones",
<<<<<<< HEAD
    icon: <i className="fa fa-cog" />,                   //<IconoConfiguraciones className="fa" />,
    component: ConfiguracionPage,
=======
    icon: ConfiguracionIcon,
    component: DepartamentoPage,
    single: true,
    child:[]
>>>>>>> feature/componentes
  },
  {
    path: "/Catalogos",
    name: "Catálogos",
<<<<<<< HEAD
    icon: <i className="zmdi zmdi-collection-text" />,                   //<IconoCatalogo />,
    component: CatalogosPage,
=======
    icon: CatalogoIcon,
    component: DepartamentoPage,
    single: false,
    child: [
      {
        path: "/GrupoDeUnidades",
        name: "Grupo de Unidades",
        icon: ConfiguracionIcon,
        component: GrupoUnidadesPage,
      },  {
        path: "/Unidades",
        name: "Unidades",
        icon: ConfiguracionIcon,
        component: UnidadesPage,
      },
      {
        path: "/Operadores",
        name: "Operadores",
        icon: ConfiguracionIcon,
        component: OperadoresPage,
      }
    ]
>>>>>>> feature/componentes
  },
  {
    path: "/Recolección",
    name: "Recolección",
<<<<<<< HEAD
    icon: <i className="zmdi zmdi-local-shipping" />,
=======
    icon: RecolecionIcon,
>>>>>>> feature/componentes
    component: RecoleccionPage,
    single: true,
    child:[]
  },
  {
<<<<<<< HEAD
    path: "/Embarque",
    name: "Embarque",
    icon: <i className="fa fa-archive" />,
    component: EmbarquePage,
=======
    path: "/Embalajes",
    name: "Embarque",
    icon: EmbarqueIcon,
    component: EmbalajesPage,
    single: true,
    child:[]
>>>>>>> feature/componentes
  },
  {
    path: "/Departamento",
    name: "Guías",
<<<<<<< HEAD
    icon: <i className="zmdi zmdi-assignment" />,
=======
    icon: GuiasIcon,
>>>>>>> feature/componentes
    component: DepartamentoPage,
    single: true,
    child:[]
  },
  {
<<<<<<< HEAD
      path: "/Informes",
      name: "Informes",
      icon: <i className="fa fa-file-text" />,
      component: InformesPage,
=======
    path: "/Departamento",
    name: "Informes",
    icon: InformeIcon ,
    component: DepartamentoPage,
    single: true,
    child:[]
>>>>>>> feature/componentes
  },
  {
    path: "/Departamento",
    name: "Viajes",
<<<<<<< HEAD
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
=======
    icon: viajeIcon,
    component: DepartamentoPage,
    single: true,
    child:[]
>>>>>>> feature/componentes
  },
  {
    path: "/RemitentesDestinatarios",
    name: "RemitentesDestinatarios",
<<<<<<< HEAD
    icon: <i className="fa fa-cube" />,
=======
    icon: ConfiguracionIcon,
>>>>>>> feature/componentes
    component: RemitentesDestinatariosPage,
    single: true,
    child:[]
  },
  {
<<<<<<< HEAD
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
=======
    path: "/PlantillaSinPasos",
    name: "Plantilla",
    icon: ConfiguracionIcon,
    component: PlantillaPage,
    single: true,
    child:[]
>>>>>>> feature/componentes
  }
];

export default dashboardRoutes;
