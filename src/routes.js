import DepartamentoPage from './Views/Departamento';
import RecoleccionPage from './Views/Recoleccion';
import EmbarquePage from './Views/Embarque';
import GuiaPage from './Views/Guia';
import InformesPage from './Views/Informes'
import CatalogosPage from './Views/Catalogos';
import ConfiguracionPage from './Views/Configuracion';



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
    icon: IndicadoresIcon,
    component: DepartamentoPage,
    single: true,
    child:[]
  },
  {
    path: "/Configuracion",
    name: "Configuraciones",
    icon: ConfiguracionIcon,
    component: ConfiguracionPage,
    single: true,
    child:[]
  },
  {
    path: "/Catalogos",
    name: "Catálogos",
    icon: CatalogoIcon,
    component: CatalogosPage,
    single: true,
    child:  [] 
    },
  {
    path: "/Recolección",
    name: "Recolección",
    icon: RecolecionIcon,
    component: RecoleccionPage,
    single: true,
    child:[]
  },
  {
    path: "/Embarque",
    name: "Embarque",
    icon: EmbarqueIcon,
    component: EmbarquePage,
    single: true,
    child:[]
  },
  {
    path: "/Guia",
    name: "Guías",
    icon: GuiasIcon,
    component: GuiaPage,
    single: true,
    child:[]
  },
  {
    path: "/Informes",
      name: "Informes",
    icon: InformeIcon ,
    component: InformesPage,
    single: true,
    child:[]
  },
  {
    path: "/Departamento",
    name: "Viajes",
    icon: viajeIcon,
    component: DepartamentoPage,
    single: true,
    child:[]
  }
];

export default dashboardRoutes;
