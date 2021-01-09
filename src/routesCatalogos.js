import DepartamentoPage from './Views/Departamento';
import RecoleccionPage from './Views/Recoleccion';
import EmbalajesPage from './Views/Embalajes';
import EmbarquePage from './Views/Embarque';
import CatalogosPage from './Views/Catalogos';
import RemDesPage from './Views/RemitentesDestinatarios';
import UnidadesPage from './Views/Unidades';
import OperadoresPage from './Views/Operadores';
import RutasPage from './Views/Rutas';
import TipoServicioPage from './Views/TiposServicio';
import EstatusUnidadPage from './Views/EstatusUnidad';
import TipoCobroPage from './Views/TipoCobro';

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
import {ReactComponent as AddendasIcon} from './iconos/Catalogos/Icono Addendas/icono_addendas.svg';


const catalogRoutes = [
  {
    path: "/Departamento",
    name: "Grupo Clientes",
    icon:  GClienteIcon,
    component: DepartamentoPage,
  },
  {
    path: "/Departamento",
    name: "Clientes",
    icon: ClienteIcon,
    component: DepartamentoPage,
  },
  {
    path: "/RemitenteDestinatarios",
    name: "Rem / Des",
    icon: RemDesIcon,
    component: RemDesPage,
  },
  {
    path: "/Recolección",
    name: "Puesto",
    icon: PuestoIcon,
    component: RecoleccionPage,
  },
  {
    path: "/Embarque",
    name: "Departamento",
    icon: DepartamentoIcon,
    component: EmbarquePage,
  },
  {
    path: "/Operador",
    name: "Operadores",
    icon: OperadorIcon,
    component: OperadoresPage,
  },
  {
    path: "/Departamento",
    name: "Tipo Unidad",
    icon: TUnidadIcon,
    component: DepartamentoPage,
  },
  {
    path: "/Departamento",
    name: "Grupo Unidades",
    icon: GUnidadesIcon,
    component: DepartamentoPage,
  },
  {
    path: "/Unidades",
    name: "Unidades",
    icon: UnidadesIcon,
    component: UnidadesPage,
  },


  {
    path: "/EstatusUnidad",
    name: "Estatus Unidades",
    icon: EUnidadIcon,
    component: EstatusUnidadPage,
  },
  {
    path: "/Embalajes",
    name: "Embalajes",
    icon: EmbalajeIcon,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Tipos Viaje",
    icon: TViajeIcon,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Estatus Viaje",
    icon: EViajeIcon,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Estatus Embarque",
    icon: EEmbarqueIcon,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Estatus Recolección",
    icon: ERecoleccionIcon,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Estatus Guías",
    icon: EGuiaIcon,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Estatus Informe",
    icon: EInformeIcon,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Estatus Documentos",
    icon: GClienteIcon,
    component: EmbalajesPage,
  },

  {
    path: "/Embalajes",
    name: "Clasificación Viaje",
    icon: ClasificacionIcon,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Casetas",
    icon: CasetaIcon,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Impuestos",
    icon: ImpuestosIcon,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Conceptos Fact.",
    icon: CFacturaIcon,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Rutas",
    icon: ViajesIcon,
    component: RutasPage,
  },
  {
    path: "/Embalajes",
    name: "Tarifas",
    icon: GClienteIcon,
    component: EmbalajesPage,
  },
  {
    path: "/TipoCobro",
    name: "Tipos de Cobro",
    icon: TCobreIcon,
    component: TipoCobroPage,
  },
  {
    path: "/Embalajes",
    name: "Parámetros Configuración",
    icon: PConfiguracionIcon,
    component: EmbalajesPage,
  },
];

export default catalogRoutes;
