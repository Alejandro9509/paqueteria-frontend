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
import {ReactComponent as SeguimientoIcon} from './iconos/Menu/Icono Tracking/Trackingnaranja.svg'
import {ReactComponent as TarifaZonaIcon} from './iconos/Catalogos/Icono Zonas Tarifas/IconoTarifaZona.svg'

import {ReactComponent as viajeIcon} from './iconos/Menu/IconoViajes/iconoViajes.svg';
import {ReactComponent as corteCajaIcon} from './iconos/Menu/IconoCorteCaja/IconoCorteCaja.svg';
import Seguimiento from "./Views/Seguimiento/Seguimiento";
import {validarDerecho} from "./Util/Util";
import BuscarTarifa from "./Views/BuscarTarifa/BuscarTarifa";

const dashboardRoutes = [
  {
    path: "/Indicadores",
    name: "Indicadores",
    icon: IndicadoresIcon,
    component: InicadoresPage,
    single: true,
    child:[],
    visible: validarDerecho(9101194)
  },
  {
    path: "/Configuracion",
    name: "Configuraciones",
    icon: ConfiguracionIcon,
    component: ConfiguracionPage,
    single: true,
    child:[],
    visible: validarDerecho(9101195)
  },
  {
    path: "/Catalogos",
    name: "Catálogos",
    icon: CatalogoIcon,
    component: CatalogosPage,
    single: true,
    child:  [],
    visible: validarDerecho(9101196)
    },
  {
    path: "/Recoleccion",
    name: "Recolección",
    icon: RecolecionIcon,
    component: RecoleccionPage,
    single: true,
    child:[],
    visible: validarDerecho(9101197)
  },
  {
    path: "/Embarque",
    name: "Embarque",
    icon: EmbarqueIcon,
    component: EmbarquePage,
    single: true,
    child:[],
    visible: validarDerecho(9101198)
  },
  {
    path: "/Embarque/:id",
    name: "Embarque",
    icon: EmbarqueIcon,
    component: EmbarquePage,
    single: true,
    child:[],
    visible:false
  },
  {
    path: "/Guia",
    name: "Guías",
    icon: GuiasIcon,
    component: GuiaPage,
    single: true,
    child:[],
    visible: validarDerecho(9101199)
  },
  {
    path: "/Informes",
      name: "Informes",
    icon: InformeIcon ,
    component: InformesPage,
    single: true,
    child:[],
    visible: validarDerecho(9101200)
  },
  {
    path: "/UltimaMilla",
    name: "Última Milla",
    icon: UltimaMillaIcono,
    component: UltimaMillaPage,
    single: true,
    newWindow: true,
    child:[],
    visible: validarDerecho(9101205)
  },
  {
    path: "/Viajes",
    name: "Viajes",
    icon: viajeIcon,
    component: ViajesPage,
    single: true,
    child:[],
    visible: validarDerecho(9101201)
  },
  {
    path: "/CorteCaja",
    name: "Corte de Caja",
    icon: corteCajaIcon,
    component: CorteCajaPage,
    single: true,
    child:[],
    visible: validarDerecho(9101203)
  },
  {
    path: "/Segumiento",
    name: "Seguimiento",
    icon: SeguimientoIcon,
    component: Seguimiento,
    single: true,
    child:[],
    visible: validarDerecho(9101204)
  },
  {
    path: "/Buscar_Tarifa",
    name: "Buscar Tarifa",
    icon: TarifaZonaIcon,
    component: BuscarTarifa,
    single: true,
    child:[],
    visible: validarDerecho(9101204),

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

