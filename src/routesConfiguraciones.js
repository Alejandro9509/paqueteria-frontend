import DepartamentoPage from './Views/Departamento';
import RecoleccionPage from './Views/Recoleccion';
import EmbalajesPage from './Views/Embalajes';
import EmbarquePage from './Views/Embarque';
import CatalogosPage from './Views/Catalogos';

const configurationRoutes = [
  {
    path: "/Departamento",
    name: "Parámetros",
    icon: <i className="zmdi zmdi-input-composite" />,
    component: DepartamentoPage,
  },
  {
    path: "/Departamento",
    name: "Usuarios",
    icon: <i className="zmdi zmdi-account-circle" />,
    component: DepartamentoPage,
  },
  {
    path: "/Catalogos",
    name: "Países",
    icon: <i className="fa fa-globe" />,
    component: CatalogosPage,
  },
  {
    path: "/Recolección",
    name: "Ciudades",
    icon: <i className="zmdi zmdi-city" />,
    component: RecoleccionPage,
  },
  {
    path: "/Embarque",
    name: "Sucursales",
    icon: <i className="zmdi zmdi-home" />,
    component: EmbarquePage,
  },
  {
    path: "/Departamento",
    name: "Zonas",
    icon: <i className="zmdi zmdi-pin-drop" />,
    component: DepartamentoPage,
  },
  {
    path: "/Departamento",
    name: "Formatos Impresión",
    icon: <i className="zmdi zmdi-file-text" />,
    component: DepartamentoPage,
  },
  {
    path: "/Departamento",
    name: "Folios",
    icon: <i className="fa fa-list-ol" />,
    component: DepartamentoPage,
  },
  {
    path: "/Embalajes",
    name: "Tipo de Cambio",
    icon: <i className="zmdi zmdi-money-box" />,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Moneda",
    icon: <i className="zmdi zmdi-money" />,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Cuentas Correo",
    icon: <i className="fa fa-envelope" />,
    component: EmbalajesPage,
  },
  {
    path: "/Embalajes",
    name: "Bitácora Procesos",
    icon: <i className="fa fa-pencil-square-o" />,
    component: EmbalajesPage,
  },
  
]

export default configurationRoutes;
