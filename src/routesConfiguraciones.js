import React from 'react';
import MonedaPage from './Views/Moneda';
import FormatoImpresionPage from './Views/FormatosImpresion/FormatoImpresion';
import {ReactComponent as GFormatosIcon} from './iconos/Configuracion/Icono Formatos/icono_formatos.svg';
import {ReactComponent as GMonedaIcon} from './iconos/Configuracion/Icono Moneda/icono_moneda.svg';
import {ReactComponent as GCuentaCorreoIcon} from './iconos/Configuracion/Icono Correo/icono_correo.svg';
import CuentasCorreo from "./Views/CuentasCorreo/CuentasCorreo";
import {validarDerecho} from "./Util/Util";

const configurationRoutes = [

  {
    path: "/FormatosImpresion",
    name: "Formatos Impresión",
    icon:  <GFormatosIcon/>,
    component: FormatoImpresionPage,
    visible: true
  },
  {
    path: "/Moneda",
    name: "Moneda",
    icon:  <GMonedaIcon/>,
    component: MonedaPage,
    isDialog: false,
    visible: validarDerecho(9101211)
  },
  {
    path: "/CuentasCorreo",
    name: "Cuentas Correo",
    icon:  <GCuentaCorreoIcon/>,
    component: CuentasCorreo,
    isDialog: true,
    visible: validarDerecho(9101212)
  },
]

export default configurationRoutes;
