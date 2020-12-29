import DepartamentoPage from './Views/Departamento';
import RecoleccionPage from './Views/Recoleccion';
import EmbalajesPage from './Views/Embalajes'
import GrupoUnidadesPage from './Views/GrupoUnidades'
import UnidadesPage from './Views/Unidades';
import RemitentesDestinatariosPage from './Views/RemitentesDestinatarios';
import OperadoresPage from './Views/Operadores';
import PlantillaPage from './Views/PlantillaSinPasos';

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
    path: "/Departamento",
    name: "Configuraciones",
    icon: ConfiguracionIcon,
    component: DepartamentoPage,
    single: true,
    child:[]
  },
  {
    path: "/Departamento",
    name: "Catálogos",
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
    path: "/Embalajes",
    name: "Embarque",
    icon: EmbarqueIcon,
    component: EmbalajesPage,
    single: true,
    child:[]
  },
  {
    path: "/Departamento",
    name: "Guías",
    icon: GuiasIcon,
    component: DepartamentoPage,
    single: true,
    child:[]
  },
  {
    path: "/Departamento",
    name: "Informes",
    icon: InformeIcon ,
    component: DepartamentoPage,
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
  },
  {
    path: "/RemitentesDestinatarios",
    name: "RemitentesDestinatarios",
    icon: ConfiguracionIcon,
    component: RemitentesDestinatariosPage,
    single: true,
    child:[]
  },
  {
    path: "/PlantillaSinPasos",
    name: "Plantilla",
    icon: ConfiguracionIcon,
    component: PlantillaPage,
    single: true,
    child:[]
  }
];

export default dashboardRoutes;
