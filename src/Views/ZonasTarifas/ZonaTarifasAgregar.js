import React, {useEffect, useState} from "react";
import {FormControl, Grid, InputLabel, Select} from "@material-ui/core";

import Noty from "noty";
import ZonaTarifasTabs from "./ZonaTarifasTabs";
import {agregarZonaTarifa, modificarZonaTarifa, obtenerByIdZonaTarifa} from "../../Util/Contexts/ZonaTarifaContext";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

function ZonaTarifasAgregar({idZona, consult}) {
    const [state, setState] = useState({})
    const [selec, setSelec] = useState({})
    useEffect(value => {
        if (idZona){
            obtenerByIdZonaTarifa(idZona).then(({data}) =>{
                setSelec(data)
            })
        }
    } ,[idZona])

    const handleDataCodigosPostalesChange = (data) => {
        setState(data)
    }

    const handleAceptar = (e) =>{
        e.preventDefault()
        console.log(state)
        let params = {
            m_nIdZona: state.idZona,
            m_sCodigoZona: state.codigoZona,
            m_nIdSucursal: state.idSucursal,
            m_sIdEstado: state.idEstado,
            m_sEstado: state.estado,
            m_sCodMunicipio: state.idMunicipio,
            m_sMunicipio: state.municipio,
            m_arrCP: state.selectedCP
        }
        console.log(JSON.stringify(params))
        if (state.idZona){
            modificarZonaTarifa(state.idZona, params).then(({data}) => {
                showSuccess(data)
                setSelec({})
            }).catch((err) => {
                console.log(err);
                showSuccess(err);
            });
        }else {
            agregarZonaTarifa(params).then(({data}) => {
                showSuccess(data)
                setSelec({})
            }).catch((err) => {
                console.log(err);
                showSuccess(err);
            });
        }
    }

    return(
        <section className={"main-container"} style={{ marginLeft: "0px", padding: "0px" }}>
            <div className={"content-fluid"}>
                <div className={'row'}>
                    <div className="widget-wrap">
                        <form className="j-forms" onSubmit={handleAceptar}>
                            <div className="widget-header">
                                <h2></h2>
                            </div>
                            <div className="widget-container">
                                <div className="widget-content">
                                    <ZonaTarifasTabs
                                        selec={selec}
                                        handleDataCodigosPostalesChange={handleDataCodigosPostalesChange}
                                        consult={consult}/>
                                </div>
                            </div>
                            <div className="row">
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <button type={"submit"} className="btn btn-primary primary-btn"  disabled={consult}>
                                            Aceptar
                                        </button>
                                    </Grid>

                                </Grid>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ZonaTarifasAgregar