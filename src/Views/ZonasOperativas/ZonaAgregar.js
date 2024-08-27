import React, {useEffect, useState} from "react";
import {FormControl, Grid, InputLabel, Select} from "@mui/material";
import CodigosPostalesZonas from "./CodigosPostalesZonas";
import {
    agregarZonaOperativa,
    modificarZonaOperativa,
    obtenerByIdZonaOperativa
} from "../../Util/Contexts/ZonaOperativaContext";
import Noty from "noty";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

function ZonaAgregar({idZona, consult,nuevo,showListado}) {
    const [state, setState] = useState({})
    const [selec, setSelec] = useState({})
    useEffect(value => {
        if (idZona){
            obtenerByIdZonaOperativa(idZona).then(({data}) =>{
                setSelec(data)
            })
        }
    } ,[idZona])

    const handleDataCodigosPostalesChange = (data) => {
        setState(data)
    }

    const handleAceptar = (e) =>{
        e.preventDefault()
        let params = {
            m_nIdZona: state.idZona,
            m_sCodigoZona: state.codigoZona,
            m_nIdSucursal: state.idSucursal,
            m_sIdEstado: state.idEstado,
            m_sEstado: state.estado,
            m_sCodMunicipio: state.idMunicipio,
            m_sMunicipio: state.municipio,
            m_arrCP: state.selectedCP,
            m_nIdOrigenDestino: state.idOrigenDestino,
            m_nIdPais: state.idPais,
            m_bAplicaEntrega:state.aplicaEntrega
        }
        console.log(JSON.stringify(params))
        if (state.idZona){
            modificarZonaOperativa(state.idZona, params).then(({data}) => {
                if (data.Estatus === true){
                    showSuccess("Modificado con éxito")
                    setSelec({})
                    showListado(e);
                }
            }).catch((err) => {
                console.log(err);
                showSuccess(err);
            });
        }else {
            agregarZonaOperativa(params).then(({data}) => {
                if (data.Estatus === true){
                    showSuccess("Agregado con éxito")
                    setSelec({})
                    showListado(e);
                }
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
                                    <CodigosPostalesZonas
                                        seleccion={selec}
                                        onChange={handleDataCodigosPostalesChange}
                                        consult={consult}
                                        nuevo={nuevo}
                                    />
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

export default ZonaAgregar