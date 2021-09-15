import DepartamentoPage from './Views/Departamento';
import RecoleccionPage from './Views/Recoleccion';
import EmbarquePage from './Views/Embarque';
import GuiaPage from './Views/Guia';
import InformesPage from './Views/Informes'
import ViajesPage from './Views/Viajes'

import CatalogosPage from './Views/Catalogos';
import ConfiguracionPage from './Views/Configuracion';
import InicadoresPage from './Views/Indicadores';
import CorteCajaPage from './Views/CorteCaja/CorteCaja';
import Historial from './Views/Viajes/Historial';
import UltimaMillaPage from './Views/UltimaMilla/UltimaMilla';


import {ReactComponent as ConfiguracionIcon} from './iconos/Menu/IconoConfiguraciones/iconoConfiguraciones.svg';
import {ReactComponent as IndicadoresIcon} from './iconos/Menu/IconoIndicadores/iconoIndicadores.svg';
import {ReactComponent as CatalogoIcon} from './iconos/Menu/IconoCatalogo/iconoCatalogo.svg';
import {ReactComponent as InformeIcon} from './iconos/Menu/IconoInforme/iconoInforme.svg';
import {ReactComponent as RecolecionIcon} from './iconos/Menu/IconoRecoleccion/iconoRecoleccion.svg';
import {ReactComponent as EmbarqueIcon} from './iconos/Menu/IconoEmbarque/iconoEmbarque.svg';
import {ReactComponent as GuiasIcon} from './iconos/Menu/IconoGuias/iconoGuia.svg';
import {ReactComponent as UltimaMillaIcono} from './iconos/Menu/IconoUltimaMilla/IconoUltimaMilla.svg';

import {ReactComponent as viajeIcon} from './iconos/Menu/IconoViajes/iconoViajes.svg';


const dashboardRoutes = [
  {
    path: "/Indicadores",
    name: "Indicadores",
    icon: IndicadoresIcon,
    component: InicadoresPage,
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
    path: "/Recoleccion",
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
    path: "/UltimaMilla",
    name: "Última Milla",
    icon: UltimaMillaIcono,
    component: UltimaMillaPage,
    single: true,
    newWindow: true,
    child:[]
  },
  {
    path: "/Viajes",
    name: "Viajes",
    icon: viajeIcon,
    component: ViajesPage,
    single: true,
    child:[]
  },
  {
    path: "/CorteCaja",
    name: "Corte de Caja",
    icon: viajeIcon,
    component: CorteCajaPage,
    single: true,
    child:[]
  },
  /*{
    path: "/Tutoriales",
    name: "Tutoriales",
    icon: viajeIcon,
    component: Tutoriales,
    single: true,
    child:[]
  }*/

];

export default dashboardRoutes;
