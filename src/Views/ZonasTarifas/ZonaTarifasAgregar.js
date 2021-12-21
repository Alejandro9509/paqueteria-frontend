import React, {useEffect, useState} from "react";
import {FormControl, Grid, InputLabel, Select} from "@material-ui/core";

import Noty from "noty";
import ZonaTarifasTabs from "./ZonaTarifasTabs";
import {agregarZonaTarifa, modificarZonaTarifa, obtenerByIdZonaTarifa} from "../../Util/Contexts/ZonaTarifaContext";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CodigosPostalesZonas from "../ZonasOperativas/CodigosPostalesZonas";
import ConceptosAdicionalesRecoleccion from "../Tarifas/ConceptosAdicionalesRecoleccion";
import ConceptosAdicionalesEntrega from "../Tarifas/ConceptosAdicionalesEntrega";
import {getUniqueListBy} from "../../Util/Util";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function ZonaTarifasAgregar({idZona, consult}) {
    const [state, setState] = useState({})
    const [ivas, setIvas] = useState({
        ivaRetiene:[],
        ivaTraslada:[]
    })
    const [selec, setSelec] = useState({})
    const [value, setValue] = React.useState(0);
    const [todosConceptos, setTodosConceptos] = useState([])
    const [conceptosRecoleccion, setConceptosRecoleccion] = useState([])
    const [conceptosEntrega, setConceptosEntrega] = useState([])

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(value => {
        if (idZona !== 0){
            obtenerByIdZonaTarifa(idZona).then(({data}) =>{
                console.log(data)
                setSelec(data)
                let conceptosCast = []
                data.m_arrArConceptos.forEach(element => {
                    let ivaTraslada = []
                    let ivaRetiene = []
                    conceptosCast.push({
                        idConcepto : element.m_nIdConceptosFacturacion,
                        importe: element.m_cImporte,
                        retiene: element.m_nIdImpuestoRetiene,
                        traslada: element.m_nIdImpuestoTraslada,
                        importeRet: element.m_cImporteRetiene,
                        importeIVA: element.m_cImporteIva,
                        rangoMinimo: element.m_xnRangoMinimo,
                        rangoMaximo: element.m_xnRangoMaximo,
                        nombreConcepto: element.m_sConcepto,
                        tipoCalculo: element.m_nIdTipoCalculo,
                        agregadoDesde: element.m_nIdAgregadoDesde,
                        tipoMedida: element.m_nIdTipoMedida
                    })
                    ivaTraslada = getUniqueListBy(conceptosCast, "traslada").map(i => i.traslada);
                    ivaRetiene = getUniqueListBy(conceptosCast, "retiene").map(i => i.retiene);
                    setIvas({ ivaRetiene: ivaRetiene, ivaTraslada: ivaTraslada })
                })

                setTodosConceptos(conceptosCast)
            })
        }
    } ,[idZona])

    const handleDataCodigosPostalesChange = (data) => {
        setState(data)
    }

    const addConcepto = (data) => {
        // const { conceptosRecoleccion, todosConceptos,conceptosAdicionales, conceptosManiobra, conceptosEntrega } = this.state
        let ivaTraslada = [];
        let ivaRetiene = [];
        const concept = {
            idConcepto : data.concepto.m_nIdConceptosFacturacion,
            concepto: data.concepto,
            importe: data.importe,
            retiene: data.retiene,
            traslada: data.traslada,
            importeRet: data.importeRet,
            importeIVA: data.importeIVA,
            rangoMinimo: data.rangoMinimo,
            rangoMaximo: data.rangoMaximo,
            nombreConcepto: data.concepto.m_sConcepto,
            tipoCalculo: data.tipoCalculo,
            agregadoDesde: data.agregadoDesde,
            tipoMedida: data.tipoMedida
        }
        let newArray = []
        todosConceptos.forEach((i) => newArray.push(i))
        newArray.push(concept)
        ivaTraslada = getUniqueListBy(newArray, "traslada").map(i => i.traslada);
        ivaRetiene = getUniqueListBy(newArray, "retiene").map(i => i.retiene);

        setIvas({ ivaRetiene: ivaRetiene, ivaTraslada: ivaTraslada })
        setTodosConceptos(newArray)
    }

    const removeConcepto = (item) => {
        // const newArrayConceptos = conceptosRecoleccion.filter(c => this.filtrarConceptoAdicionalManiobraEmbarqueRecoleccion(c, item))
        const newArrayTodosConceptos = todosConceptos.filter(c => c !== item)
        // this.setState({ conceptosRecoleccion: newArrayTodosConceptos, todosConceptos: newArrayTodosConceptos })
        setTodosConceptos(newArrayTodosConceptos)
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
            m_arrCP: state.selectedCP,
            m_arrArConceptos: todosConceptos.map(c => ({
                m_nIdConceptosFacturacion: c.idConcepto,
                m_cImporte: c.importe,
                m_nIdImpuestoTraslada: c.traslada,
                m_nIdImpuestoRetiene: c.retiene,
                m_cImporteRetiene: c.importeRet,
                m_cImporteIva: c.importeIVA,
                m_nIdTipoCalculo: c.tipoCalculo,
                m_xnRangoMinimo: c.rangoMinimo,
                m_xnRangoMaximo: c.rangoMaximo,
                m_nIdAgregadoDesde: c.agregadoDesde,
                m_nIdTipoMedida: c.tipoMedida
            })),
        }
        console.log(JSON.stringify(params))
        if (state.idZona){
            modificarZonaTarifa(state.idZona, params).then(({data}) => {
                showSuccess(data)
                setSelec(0)
            }).catch((err) => {
                console.log(err);
                showSuccess(err);
            });
        }else {
            agregarZonaTarifa(params).then(({data}) => {
                showSuccess(data)
                setSelec(0)
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
                                    <Box sx={{ width: '100%' }}>
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <Tabs value={value} onChange={handleChangeTab} aria-label="basic tabs example">
                                                <Tab label="Códigos Postales" {...a11yProps(0)} />
                                                <Tab label="Recoleccion" {...a11yProps(1)} />
                                                <Tab label="Entrega" {...a11yProps(2)} />
                                            </Tabs>
                                        </Box>
                                        <TabPanel value={value} index={0}>
                                            <div className={'row'}>
                                                <div className="widget-container">
                                                    <div className="widget-content">
                                                        <CodigosPostalesZonas
                                                            tarifa={true}
                                                            seleccion={selec}
                                                            onChange={handleDataCodigosPostalesChange}
                                                            consult={consult}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPanel>
                                        <TabPanel value={value} index={1}>
                                            <div className="widget-container">
                                                <div className="widget-content">
                                                    <ConceptosAdicionalesRecoleccion consult={consult}
                                                                                     select={{}}
                                                                                     conceptosAdicionales={todosConceptos.filter(i => i.agregadoDesde == 3)}
                                                                                     addConcepto={addConcepto}
                                                                                     removeConcepto={removeConcepto}
                                                                                     ivaRetiene={ivas.ivaRetiene}
                                                                                     ivaTraslada={ivas.ivaTraslada}/>
                                                </div>
                                            </div>

                                        </TabPanel>
                                        <TabPanel value={value} index={2}>
                                            <div className="widget-container">
                                                <div className="widget-content">
                                                    <ConceptosAdicionalesEntrega consult={consult}
                                                                                 select={{}}
                                                                                 conceptosAdicionales={todosConceptos.filter(i => i.agregadoDesde == 2)}
                                                                                 addConcepto={addConcepto}
                                                                                 removeConcepto={removeConcepto}
                                                                                 ivaRetiene={ivas.ivaRetiene}
                                                                                 ivaTraslada={ivas.ivaTraslada}/>
                                                </div>
                                            </div>
                                        </TabPanel>
                                    </Box>
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