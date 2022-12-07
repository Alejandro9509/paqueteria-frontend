import React from 'react';

import DepartamentoPage from './Views/Departamento';
import ClientePage from './Views/Clientes';
import EmbalajesPage from './Views/Embalajes';
import RemDesPage from './Views/RemitentesDestinatarios';
import UnidadesPage from './Views/Unidades';
import OperadoresPage from './Views/Operadores';
import RutasPage from './Views/Rutas';
import TipoServicioPage from './Views/TiposServicio';
import EstatusUnidadPage from './Views/EstatusUnidad';
import TipoCobroPage from './Views/TipoCobro';
import TiposViaje from './Views/TipoViaje'
import CasetaPage from './Views/Caseta';
import GrupoClientePage from './Views/GrupoCliente';
import GrupoUnidadPage from './Views/GrupoUnidades';
import ImpuestosPage from './Views/Impuestos';
import PuestoPage from './Views/Puesto';
import EstatusViajePage from './Views/EstatusViaje';
import EstatusEmbarquePage from './Views/EstatusEmbarque';
import EstatusRecoleccionPage from './Views/EstatusRecoleccion';
import EstatusGuiaPage from './Views/EstatusGuia';
import EstatusInformePage from './Views/EstatusInforme';
import EstatusDocumentoPage from './Views/EstatusDocumento';
import ConceptosFacturacionPage from './Views/ConceptosFacturacion/ConceptosFacturacion';
import TarifasPage from './Views/Tarifas/Tarifas';
import ParametrosConfiguracionPage from './Views/ParametrosConfiguracion/ParametrosConfiguracion';
import ClasificacionViajePage from './Views/ClasificacionViajes/ClasificacionViaje';
import PlantillaCorreo from './Views/PlantillaCorreo';
import CondicionesRecepcionEntrega from './Views/CondicionesRecepcionEntrega/CondicionesRecepcionEntrega';
import Productos from "./Views/Productos/Productos";
import Convenios from "./Views/Convenios/Convenios";
import Seguros from "./Views/Seguros/Seguros"
import {ReactComponent as TServicioIcon} from './iconos/Catalogos/Icono Tipos Servicio/icono_tipo_servicio.svg';

import {ReactComponent as EDocumentosIcon} from './iconos/Catalogos/Icono Estatus Documento/icono_estatus_documento.svg';
import {ReactComponent as GClienteIcon} from './iconos/Catalogos/Icono Grupo Clientes/icono_grupo_cliente.svg';
import {ReactComponent as BancoIcon} from './iconos/Catalogos/Icono Banco/icono_banco.svg';
import {ReactComponent as CasetaIcon} from './iconos/Catalogos/Icono Caseta/icono_caseta.svg';
import {ReactComponent as ClasificacionIcon} from './iconos/Catalogos/Icono Clasificacion Viaje/icono_clasificacion_viaje.svg';
import {ReactComponent as ClienteIcon} from './iconos/Catalogos/Icono Cliente/icono_cliente.svg';
import {ReactComponent as CFacturaIcon} from './iconos/Catalogos/Icono Conceptos Factura/icono_conceptos_factura.svg';
import {ReactComponent as ConfiguracionIcon} from './iconos/Catalogos/Icono Configuracion/icono_configuracion.svg';
import {ReactComponent as DepartamentoIcon} from './iconos/Catalogos/Icono Departament/icono_departamento.svg';
import {ReactComponent as EmbalajeIcon} from './iconos/Catalogos/Icono Embalaje/icono_embalaje.svg';
import {ReactComponent as EEmbarqueIcon} from './iconos/Catalogos/Icono Estatus Embarque/icono_estatus_embarque.svg';
import {ReactComponent as EGuiaIcon} from './iconos/Catalogos/Icono Estatus Guia/icono_estatus_guia.svg';
import {ReactComponent as EInformeIcon} from './iconos/Catalogos/Icono Estatus Informe/icono_estatus_informe.svg';
import {ReactComponent as ERecoleccionIcon} from './iconos/Catalogos/Icono Estatus Recoleccion/icono_estatus_recoleccion.svg';
import {ReactComponent as EUnidadIcon} from './iconos/Catalogos/Icono Estatus Unidad/icono_estatus_unidad.svg';
import {ReactComponent as EViajeIcon} from './iconos/Catalogos/Icono Estatus Viaje/icono_estatus_viaje.svg';
import {ReactComponent as GeocercaIcon} from './iconos/Catalogos/Icono Geocercas/icono_geocercas.svg';
import {ReactComponent as GUnidadesIcon} from './iconos/Catalogos/Icono Grupo Unidades/icono_grupo_unidades.svg';
import {ReactComponent as ImpuestosIcon} from './iconos/Catalogos/Icono Impuestos/icono_impuestos.svg';
import {ReactComponent as OperadorIcon} from './iconos/Catalogos/Icono Operador/icono_operador.svg';
import {ReactComponent as PConfiguracionIcon} from './iconos/Catalogos/Icono Parametros Configuracion/icono_parametros_configuracion.svg';
import {ReactComponent as ProveedoresIcon} from './iconos/Catalogos/Icono Proveedores/icono_proveedores.svg';
import {ReactComponent as PuestoIcon} from './iconos/Catalogos/Icono Puesto/icono_puesto.svg';
import {ReactComponent as RemDesIcon} from './iconos/Catalogos/Icono Rem Des/icono_rem_des.svg';
import {ReactComponent as TUnidadIcon} from './iconos/Catalogos/Icono Tipo Unidad/icono_tipo_unidad.svg';
import {ReactComponent as TCobreIcon} from './iconos/Catalogos/Icono Tipos de Cobro/icono_tipo_cobro.svg';
import {ReactComponent as TViajeIcon} from './iconos/Catalogos/Icono Tipos Viaje/icono_tipo_viaje.svg';
import {ReactComponent as UnidadesIcon} from './iconos/Catalogos/Icono Unidades/icono_unidades.svg';
import {ReactComponent as ViajesIcon} from './iconos/Catalogos/Icono Viajes/icono_viajes.svg';
import {ReactComponent as TarifasIcon} from './iconos/Catalogos/Icono Tarifas/icono_tarifas.svg';
import {ReactComponent as ConveniosIcon} from './iconos/Catalogos/Icono Convenios/icono_convenios.svg';
import {ReactComponent as PCorreosIcon} from './iconos/Catalogos/Icono Plantilla Correo/IconoPlantillaCorreoNaranja.svg';
import {ReactComponent as ProductosIcon} from './iconos/Catalogos/Icono Productos/IconoProductos.svg';
import {ReactComponent as ZonaTarifaIcon} from './iconos/Catalogos/Icono Zonas Tarifas/IconoTarifaZona.svg';
import TipoUnidad from "./Views/TipoUnidad/TipoUnidad";
import ZonaOperativa from "./Views/ZonasOperativas/ZonaOperativa";
import ZonaTarifas from "./Views/ZonasTarifas/ZonaTarifas";
import {validarDerecho} from "./Util/Util";


const catalogRoutes = [
  {
    path: "/Seguros",
    name: "Seguros",
    icon: <BancoIcon/>,
    component: Seguros,
    visible: true
  }
  ,
  {
    path: "/Embalajes",
    name: "Embalajes",
    icon: <EmbalajeIcon/>,
    component: EmbalajesPage,
      visible: validarDerecho(9101225)
  },
  {
    path: "/TiposServicio",
    name: "Tipos de Servicio",
    icon: <TServicioIcon/>,
    component: TipoServicioPage,
      visible: validarDerecho(9101224)
  },
  {
    path: "/EstatusViaje",
    name: "Estatus Viaje",
    icon: <EViajeIcon/>,
    component: EstatusViajePage,
      visible: validarDerecho(9101227)
  },
  {
    path: "/EstatusEmbarque",
    name: "Estatus Embarque",
    icon: <EEmbarqueIcon/>,
    component: EstatusEmbarquePage,
      visible: validarDerecho(9101228)
  },
  {
    path: "/EstatusRecoleccion",
    name: "Estatus Recolección",
    icon: <ERecoleccionIcon/>,
    component: EstatusRecoleccionPage,
      visible: validarDerecho(9101229)
  },
  {
    path: "/EstatusGuia",
    name: "Estatus Guías",
    icon: <EGuiaIcon/>,
    component: EstatusGuiaPage,
      visible: validarDerecho(9101230)
  },
  {
    path: "/EstatusInforme",
    name: "Estatus Informe",
    icon: <EInformeIcon/>,
    component: EstatusInformePage,
      visible: validarDerecho(9101231)
  },
  {
    path: "/EstatusDocumento",
    name: "Estatus Documentos",
    icon: <EDocumentosIcon/>,
    component: EstatusDocumentoPage,
      visible: validarDerecho(9101232)
  },
  /*{
    path: "/ClasificacionViaje",
    name: "Clasificación Viaje",
    icon: <ClasificacionIcon/>,
    component: ClasificacionViajePage,
      visible: validarDerecho(9101233)
  },*/
  {
    path: "/Tarifas",
    name: "Tarifas",
    icon: <TarifasIcon/>,
    component: TarifasPage,
      visible: validarDerecho(9101238)
  },
  {
    path: "/TipoCobro",
    name: "Tipos de Cobro",
    icon: <TCobreIcon/>,
    component: TipoCobroPage,
      visible: validarDerecho(9101239)
  },
   {
    path: "/ParametrosConfiguracion",
    name: "Parámetros Configuración",
    icon: <PConfiguracionIcon/>,
    component: ParametrosConfiguracionPage,
       visible: validarDerecho(9101202)
  },
  {
    path: "/PlantillaCorreo",
    name: "Plantilla de Correo",
    icon: <PCorreosIcon/>,
    component: PlantillaCorreo,
      visible: validarDerecho(9101383)
  },
  {
    path: "/Productos",
    name: "Productos",
    icon: <ProductosIcon/>,
    component: Productos,
      visible: validarDerecho(9101384)
  },
  {
    path: "/Convenios",
    name: "Convenios",
    icon: <ConveniosIcon/>,
    component: Convenios,
      visible: validarDerecho(9101385)
  },
  {
    path: "/ZonasOperativas",
    name: "Zonas Operativas",
    icon: <GeocercaIcon/>,
    component: ZonaOperativa,
      visible: validarDerecho(9101387)
  },
];

export default catalogRoutes;
