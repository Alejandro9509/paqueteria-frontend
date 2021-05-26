import DepartamentoPage from './Views/Departamento';
import MonedaPage from './Views/Moneda';
import TipoCambio from './Views/TipoCambio';
import PaisesPage from './Views/Paises';
import CiudadesCodigoPostalPage from './Views/Ciudades';
import ParametrosPage from './Views/Parametros';
import SucursalesPage from './Views/Sucursal';
import UsuariosPage from './Views/Usuarios';
import FormatoImpresionPage from './Views/FormatosImpresion/FormatoImpresion';
import ZonasPage from './Views/Zonas/Zonas';

import {ReactComponent as GParametroIcon} from './iconos/Configuracion/Icono Parametros/icono_parametro.svg';
import {ReactComponent as GUsuarioIcon} from './iconos/Configuracion/Icono Usuarios/icono_usuarios.svg';
//import {ReactComponent as GPaisIcon} from './iconos/Configuracion/Icono Paises/icono_paises.svg';
import {ReactComponent as GCiudadIcon} from './iconos/Configuracion/Icono Ciudades/icono_ciudades.svg';
import {ReactComponent as GSucursalIcon} from './iconos/Configuracion/Icono Sucursales/icono_sucursal.svg';
import {ReactComponent as GZonasIcon} from './iconos/Configuracion/Icono Zonas/icono_zonas_color.svg';
import {ReactComponent as GFormatosIcon} from './iconos/Configuracion/Icono Formatos/icono_formatos.svg';
import {ReactComponent as GFoliosIcon} from './iconos/Configuracion/Icono Folios/icono_folios.svg';
import {ReactComponent as GTipoCambioIcon} from './iconos/Configuracion/Icono Tipo Cambio/icono_tipo_cambio.svg';
import {ReactComponent as GMonedaIcon} from './iconos/Configuracion/Icono Moneda/icono_moneda.svg';
import {ReactComponent as GCuentaCorreoIcon} from './iconos/Configuracion/Icono Correo/icono_correo.svg';
import {ReactComponent as GBitacoraIcon} from './iconos/Configuracion/Icono Bitacora/icono_bitacora.svg';
import Folios from "./Views/Folios/Folios";
import CuentasCorreo from "./Views/CuentasCorreo/CuentasCorreo";

const configurationRoutes = [

  {
    path: "/Parametros",
    name: "Parámetros",
    icon:  <GParametroIcon/>,
    component: ParametrosPage,
    isDialog: false
  },
  {
    path: "/Usuarios",
    name: "Usuarios",
    icon:  <GUsuarioIcon/>,
    component: UsuariosPage,
    isDialog: false
  },
  {
    path: "/Paises",
    name: "Países",
    icon: <GUsuarioIcon/>,
    component: PaisesPage,
    isDialog: false
  },
  {
    path: "/Ciudades",
    name: "Ciudades",
    icon:  <GCiudadIcon/>,
    component: CiudadesCodigoPostalPage,
    isDialog: false
  },
  {
    path: "/Sucursales",
    name: "Sucursales",
    icon:  <GSucursalIcon/>,
    component: SucursalesPage,
    isDialog: false
  },
  {
    path: "/Zonas",
    name: "Zonas",
    icon:  <GZonasIcon/>,
    component: ZonasPage,
    isDialog: false
  },
  {
    path: "/FormatosImpresion",
    name: "Formatos Impresión",
    icon:  <GFormatosIcon/>,
    component: FormatoImpresionPage,
    isDialog: false
  },
  {
    path: "/Folios",
    name: "Folios",
    icon:  <GFoliosIcon/>,
    component: Folios,
    isDialog: false
  },
  {
    path: "/TipoDeCambio",
    name: "Tipo de Cambio",
    icon:  <GTipoCambioIcon/>,
    component: TipoCambio,
    isDialog: false
  },
  {
    path: "/Moneda",
    name: "Moneda",
    icon:  <GMonedaIcon/>,
    component: MonedaPage,
    isDialog: false
  },
  {
    path: "/CuentasCorreo",
    name: "Cuentas Correo",
    icon:  <GCuentaCorreoIcon/>,
    component: CuentasCorreo,
    isDialog: true
  },
  {
    path: "/BitacoraProcesos",
    name: "Bitácora Procesos",
    icon:  <GBitacoraIcon/>,
    component: DepartamentoPage,
    isDialog: false
  },
]

export default configurationRoutes;
