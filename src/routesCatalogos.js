import React from 'react';

import EmbalajesPage from './Views/Embalajes';
import TipoServicioPage from './Views/TiposServicio';
import TipoCobroPage from './Views/TipoCobro';
import EstatusViajePage from './Views/EstatusViaje';
import EstatusEmbarquePage from './Views/EstatusEmbarque';
import EstatusRecoleccionPage from './Views/EstatusRecoleccion';
import EstatusGuiaPage from './Views/EstatusGuia';
import EstatusInformePage from './Views/EstatusInforme';
import EstatusDocumentoPage from './Views/EstatusDocumento';
import TarifasPage from './Views/Tarifas/Tarifas';
import ParametrosConfiguracionPage from './Views/ParametrosConfiguracion/ParametrosConfiguracion';
import PlantillaCorreo from './Views/PlantillaCorreo';
import Productos from "./Views/Productos/Productos";
import Convenios from "./Views/Convenios/Convenios";
import Seguros from "./Views/Seguros/Seguros"
import {ReactComponent as TServicioIcon} from './iconos/Catalogos/Icono Tipos Servicio/icono_tipo_servicio.svg';

import {ReactComponent as EDocumentosIcon} from './iconos/Catalogos/Icono Estatus Documento/icono_estatus_documento.svg';
import {ReactComponent as BancoIcon} from './iconos/Catalogos/Icono Banco/icono_banco.svg';
import {ReactComponent as EmbalajeIcon} from './iconos/Catalogos/Icono Embalaje/icono_embalaje.svg';
import {ReactComponent as EEmbarqueIcon} from './iconos/Catalogos/Icono Estatus Embarque/icono_estatus_embarque.svg';
import {ReactComponent as EGuiaIcon} from './iconos/Catalogos/Icono Estatus Guia/icono_estatus_guia.svg';
import {ReactComponent as EInformeIcon} from './iconos/Catalogos/Icono Estatus Informe/icono_estatus_informe.svg';
import {ReactComponent as ERecoleccionIcon} from './iconos/Catalogos/Icono Estatus Recoleccion/icono_estatus_recoleccion.svg';
import {ReactComponent as EViajeIcon} from './iconos/Catalogos/Icono Estatus Viaje/icono_estatus_viaje.svg';
import {ReactComponent as GeocercaIcon} from './iconos/Catalogos/Icono Geocercas/icono_geocercas.svg';
import {ReactComponent as PConfiguracionIcon} from './iconos/Catalogos/Icono Parametros Configuracion/icono_parametros_configuracion.svg';
import {ReactComponent as TCobreIcon} from './iconos/Catalogos/Icono Tipos de Cobro/icono_tipo_cobro.svg';
import {ReactComponent as TarifasIcon} from './iconos/Catalogos/Icono Tarifas/icono_tarifas.svg';
import {ReactComponent as ConveniosIcon} from './iconos/Catalogos/Icono Convenios/icono_convenios.svg';
import {ReactComponent as PCorreosIcon} from './iconos/Catalogos/Icono Plantilla Correo/IconoPlantillaCorreoNaranja.svg';
import {ReactComponent as ProductosIcon} from './iconos/Catalogos/Icono Productos/IconoProductos.svg';
import ZonaOperativa from "./Views/ZonasOperativas/ZonaOperativa";
import {validarDerecho} from "./Util/Util";
import PlantillasImportacionMain from "./Views/PlantillasImportacion/PlantillasImportacionMain";


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
    {
        path: "/PlantillasImportacion",
        name: "Plantillas de importacion embarques",
        icon: <EDocumentosIcon/>,
        component: PlantillasImportacionMain,
        visible: validarDerecho(9101387)
    },
];

export default catalogRoutes;
