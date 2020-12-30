import React from "react";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import catalogRoutes from '../routesCatalogos';
import {
  Link,
} from 'react-router-dom';
import $ from 'jquery';
window.jQuery = window.$ = $;

function Recoleccion() {

  const [state, setState] = React.useState({
    showPopUp: false,
    agregar: "Agregar",
    idRecoleccion: 0,
    fechaInicial: "",
    fechaIcinial2: "",
    sucursalListado: 0,
    estatusListado: 0,
    idSucursalAgregar: 0,
    folioRecoleccion: "",
    folioEmbarque: "",
    folioGuía: "",
    folioInforme: "",
    fechaHoraCreacion: "",
    estatusRecoleccion: 0,
    moneda: "",
    tipoCambio: "",
    tipoCobro: "",
    nombreRemitente: "",
    RFCRemitente: "",
    domicilioRemitente: "",
    codigoPostalRemitente: "",
    ciudadRemitente: "",
    correoRemitente: "",
    telefonoRemitente: "",
    contactoRemitente: "",
    origenRemitente: "",
    nombreDestinatario: "",
    RFCDestinatario: "",
    domicilioDestinatario: "",
    codigoPostalDestinatario: "",
    ciudadDestinatario: "",
    correoDestinatario: "",
    telefonoDestinatario: "",
    contactoDestinatario: "",
    destinoDestinatario: "",
    ciudadRemitente: "",
    ciudadDestinatario: "",
    fechaRecoleccion: "",
    horaRecoleccion: "",
    fechaEntrega: "",
    horaEntrega: "",
    codigoPostalRecoleccion: "",
    ciudadRecoleccion: "",
    zonaRecoleccion: "",
    domicilioRecoleccion: "",
    recogerEn: "",
    datosAdicionalesRecoleccion: "",
    codigoPostalEntrega: "",
    ciudadEntrega: "",
    zonaEntrega: "",
    domicilioEntrega: "",
    entregaEn: "",
    datosAdicionalesEntrega: "",
    cantidadDePaquetes: 0,
    cantidadDeSobres: 0,
    diferenteRecoleccion: false,
    diferenteEntrega: false,
  })

  return (
    <div>

      <header className="topbar clearfix">
        <Cabecera />
      </header>

      {/*Leftbar Start Here*/}
      <aside className="iconic-leftbar">
        <BarraLateralIzquierda />
      </aside>
      {/*Leftbar End Here*/}

      {/*Page Container Start Here*/}
      <section className="main-container">
        <div className="container-fluid">
          {catalogRoutes.map((r, index) => {
            return (

              <Link to={r.path}>
                <div className="col-md-2" style={{ textAlign: "center" }}>
                  <div className="input">
                    <button type="button" key={index} className="boton-de-catalogos" >
                      {r.icon}
                    </button>
                  </div>
                  <label>{r.name}</label>
                </div>
              </Link>
            )
          })}
        </div>

      </section>
      {/*Page Container End Here*/}

      {/*Rightbar Start Here*/}
      <aside className="rightbar">
        <BarraLateralDerecha />
      </aside>

    </div>

  );
}

export default Recoleccion;
