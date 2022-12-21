import React, {Component, useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Typography} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {obtenerClavesCancelacionSAT} from "../../Util/Contexts/SATContext";
import TextField from "@material-ui/core/TextField";
import DialogTableClientes from "../Clientes/DialogTableClientes";
import {obtenerParametrosConfiguracion} from "../../Util/Contexts/ParametrosConfiguracionContext";
import {obtenerRecoleccionId} from "../../Util/Contexts/RecoleccionContext";
import {obtenerGuiaRecoleccionPorFolio} from "../../Util/Contexts/UltimaMillaContext";
import {obtenerTipoCobro} from "../../Util/Contexts/TipoCobroContext";
import {obtenerTipoSeguro} from "../../Util/Contexts/TipoSeguroContext";
import InputAdornment from "@material-ui/core/InputAdornment";
import Paquetes from "../Paquetes/Paquetes";

class CancelarSAT extends Component {
    constructor(props) {
        super(props);
        this.state= {
            catalogoSAT: [],
            openDialogRecoleccion: false,
            idGuia: 0
        }
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        obtenerClavesCancelacionSAT().then(({data}) =>{
            this.setState({
                catalogoSAT: data,
                folioRelacionado: this.props.data.folioSustituye
            })
        })
    }

    handleChange = (event) => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value,
        });
        if (event.target.name === 'idCancelacionSAT' && event.target.value === '01'){
            try {
                obtenerGuiaRecoleccionPorFolio(this.props.data.m_sFolio).then(respuesta => {
                    let idRecoleccion = respuesta.data.data.m_nIdRecoleccion
                    this.setState({openDialogRecoleccion: true,idGuia: idRecoleccion})
                }).catch(err => {
                    console.log(err);
                })
            }catch(err) {
                console.log(err);
            }


        }
    };
    onSubmit(e){
        e.preventDefault()
        const data = this.state
        data.motivoSAT = this.state.catalogoSAT.find(c => c.m_nid === this.state.idCancelacionSAT).m_sDescripcion
        data.folioRelacionado = this.state.idCancelacionSAT === "01" ? data.folioRelacionado : "0"
        this.props.close()
        this.props.onSubmit(data)
    }
    render() {
        return (
            <div>
                <Dialog open={this.state.openDialogRecoleccion} onClose={() => this.setState({openDialogRecoleccion: false})} fullWidth maxWidth={"xl"}>
                    <DialogTitle><Typography variant={"h3"}>Modificar recoleccion</Typography></DialogTitle>
                    <DialogContent>
                        <RecoleccionResumen idRecoleccion={this.state.idGuia? this.state.idGuia : 0}/>
                    </DialogContent>
                </Dialog>
                <Dialog open={this.props.open} onClose={() => this.props.close()} fullWidth maxWidth={"md"}>
                    <DialogTitle><Typography variant={"h3"}>Cancelar SAT - {this.props.data.folioCancelar}</Typography></DialogTitle>
                    <DialogContent>
                        <Typography>Folio: {this.props.data.m_sFolio}</Typography>
                        <br/>
                        <form onSubmit={this.onSubmit}>
                            <label className="input select" style={{width:"100%"}}>
                                <FormControl fullWidth variant="outlined" margin="dense" required>
                                    <InputLabel id="idMotivoCancelacionSATLabel">Motivo cancelación SAT</InputLabel>
                                    <Select
                                        labelId="idMotivoCancelacionSATLabel"
                                        className="form-control"
                                        value={this.state.idCancelacionSAT}
                                        onChange={this.handleChange}
                                        id="idMotivoCancelacionSAT"
                                        label="Motivo cancelación"
                                        name={"idCancelacionSAT"}
                                        required
                                        InputProps={{
                                            id: "idMotivoCancelacionSAT",
                                            name: "idCancelacionSAT"
                                        }}
                                    >
                                        {this.state.catalogoSAT.filter(i => this.props.esInforme ? i.m_nid !== "01" : true).map((estatus) => (
                                            <MenuItem
                                                key={estatus.m_nid}
                                                value={estatus.m_nid}
                                            >
                                                {estatus.m_nid+' - '+estatus.m_sDescripcion}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </label>

                            <br/>
                            {
                                this.state.idCancelacionSAT === "01" &&
                                < div className="input select">
                                    <TextField variant="outlined" margin="dense"
                                               onChange={this.handleChange}
                                               className="form-control"
                                               type="text" required
                                               fullWidth
                                               label="Folio Fiscal sustituye"
                                               value={this.state.folioRelacionado}
                                               id="idFolioRelacionado"
                                               name="folioRelacionado"
                                    />
                                </div>
                            }
                            <br/>
                            <div className="input select">
                                <TextField variant="outlined" margin="dense"
                                           onChange={this.handleChange}
                                           className="form-control"
                                           type="text"
                                           fullWidth
                                           required
                                           label="Motivo Cancelación"
                                           value={this.state.motivoCancelacion}
                                           id="motivoCancelacion"
                                           name="motivoCancelacion"
                                />
                            </div>
                            <DialogActions>
                                <Button variant={"contained"} color={"default"} onClick={() => this.props.close()}>Cancelar</Button>
                                <Button variant={"contained"} type={"submit"} color={"primary"}>Aceptar</Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

        );
    }
}

CancelarSAT.propTypes = {};

export default CancelarSAT;

/**Props:
 * idRecoleccion int
 * }*/
export function RecoleccionResumen(props) {

    const [configuraciones, setConfiguraciones] = React.useState({
        idsTiposCobroSeleccionArray: [],
        detectarTipoCobro: false,
        limpiarProducto: false,
    })
    const [dataTipoCobro, setDataTipoCobro] = React.useState([]);
    const [dataTiposSeguro, setDataTiposSeguro] = useState([])
    const [dataPaquetes, setDataPaquetes] = useState([])
    const [state, setState] = useState({
        openDialog: false
    })
    const [data, setData] = useState({
        "folio": "",
        "idTipoCobro": '',
        "cliente": {
            m_nIdCliente: 0,
            m_sNombreFiscal: ''
        },
        "idTipoSeguro": '',
        "porcentajeSeguro": '',
        "valorDeclarado": '',
        "observaciones": "",
        "complementosSat": [],
        "idRemitente": 0,
        "remitente": "",
        "numeroRemitente": 0,
        "idDestinatario": 0,
        "destinatario": "",
        "numeroDestinatario": 0,
        "recoleccionDiferenteDomicilio": false,
        "conCita": false,
        "conceptosFacturacion": []
    })
    useEffect(() => {
        if (props.idRecoleccion > 0){
            obtenerRecoleccionId(props.idRecoleccion).then((respuesta) => {
                console.log(respuesta.data)
                setData({
                    ...data,
                    folio: respuesta.data.m_sFolioRecoleccion,
                    cliente: respuesta.data.cliente,
                    idTipoCobro: respuesta.data.m_nIdTipoDeCobro,
                    idTipoSeguro: respuesta.data.m_nIdTipoSeguro,
                    porcentajeSeguro: respuesta.data.m_xPorcentajeSeguro,
                    valorDeclarado: respuesta.data.m_xValorDeclarado,
                    observaciones: respuesta.data.m_sObservaciones

                })
                setDataPaquetes(respuesta.data.m_parrPaquetes)
            });
        }

    },[props.idRecoleccion])

    useEffect(() => {
        obtenerTipoCobro().then((respuesta) => {
            respuesta.data.forEach((i) => {
                i.valid = true
            })
            setDataTipoCobro(respuesta.data);
        });
        obtenerTipoSeguro().then(({data}) => {
            setDataTiposSeguro(data)
        })
        obtenerParametrosConfiguracion().then(respuesta => {
            setConfiguraciones((config) => {
                return {
                    ...config,
                    idsTiposCobroSeleccionArray: respuesta.data.TiposCobroActivos ? respuesta.data.TiposCobroActivos.split(',') : [],
                    detectarTipoCobro: respuesta.data.DetectarTipoCobro,
                    limpiarProducto: respuesta.data.LimpiarProducto,
                }
            })
        })

    },[])

    const handlePatrocinadorSelected = (row) => {
        setData(data => {
            return {
                ...data,
                cliente: row.data,
                idTipoSeguro: row.data.m_nIdTipoSeguro !== 0 ? row.data.m_nIdTipoSeguro : 5,
                porcentajeSeguro:  row.data.m_cPorcentajeSeguro,
                aplicaSeguro: row.data.m_bTieneSeguro,
                idTipoCobro: configuraciones.detectarTipoCobro ? row.data.m_bSinCredito ? "10" : "11" : state.tipoCobro,
                observaciones: row.data.m_nIdTipoSeguro === 1 ? ("Aseguradora: " + row.data.m_sAseguradora + ", Poliza: " + row.data.m_sPoliza) : "",
            }
        })
        setState({...state, openDialog: false})
    }

    const handleChange = (event) => {
        setData(data => {
            return {
                ...data,
                [event.target.name]: event.target.value,
            }
        });
        if (event.target.name === 'idTipoSeguro'){
            setData(data => {
                return {
                    ...data,
                    porcentajeSeguro: dataTiposSeguro.find(item => item.m_nIdTipoSeguro === event.target.value).m_xPorcentaje,
                    aplicaSeguro: (event.target.value === 3) || (event.target.value === 4),
                    valorDeclarado: 0
                }
            });
        }

    }

    const handleListPaquetesChange = (newList) => {
        setDataPaquetes(newList)
    }

    return(
        <div>
            <Dialog open={state.openDialog} onClose={() => setState({...state, openDialog: false})} fullWidth maxWidth="md">
                <DialogContent>
                    <DialogTableClientes dialogVisible={(isVisible) => { setState({ ...state,openDialog: isVisible })}}
                                         handlePatrocinadorSelected={handlePatrocinadorSelected}/>
                </DialogContent>
            </Dialog>
            <section id={"informacionGeneral"}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={2}>
                        <TextField variant="outlined" margin="dense"
                                   className="form-control"
                                   label="Folio"
                                   value={data.folio}
                                   readOnly
                                   disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={10}/>
                    <Grid item xs={12} sm>
                        <TextField
                            variant="outlined"
                            label="Responsable de pago"
                            margin="dense"
                            required
                            value={data.cliente.m_sNombreFiscal}
                            error={data.cliente.m_bCreditoVencido && !data.cliente.m_bSinCredito}
                            helperText={ (data.cliente.m_bCreditoVencido && !data.cliente.m_bSinCredito) ? "El cliente presenta saldo vencido. Días de crédito: " + data.cliente.m_nDiasCredito : ""}
                            placeholder={"No. Cliente: Nombre fiscal"}
                            InputLabelProps={{shrink: true}}
                            onClick={()=>{ setState({ ...state, openDialog: true})}}
                        />
                    </Grid>
                    <Grid item xs={12} sm>
                        <TextField
                            name="idTipoSeguro"
                            select
                            label="Tipo seguro"
                            value={data.idTipoSeguro}
                            onChange={handleChange}
                            variant="outlined"
                        >
                            {dataTiposSeguro.map((option) => (
                                <MenuItem key={option.m_nIdTipoSeguro} value={option.m_nIdTipoSeguro}>
                                    {option.m_sDescripcion}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm>
                        <TextField
                            variant="outlined" margin="dense"
                            className="form-control"
                            type="number"
                            label="Porcentaje de seguro"
                            onChange={handleChange}
                            value={data.porcentajeSeguro}
                            placeholder="%"
                            name="porcentajeSeguro"
                            InputProps={{endAdornment: <InputAdornment position="start">%</InputAdornment>}}
                        />
                    </Grid>
                    <Grid item xs={12} sm>
                        <TextField
                            variant="outlined" margin="dense"
                            className="form-control"
                            type="number"
                            label="Valor Declarado"
                            onChange={handleChange}
                            value={data.valorDeclarado}
                            placeholder="$"
                            name="valorDeclarado"
                            InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}
                        />
                    </Grid>
                    <Grid item xs={12} sm>
                        <TextField
                            variant="outlined"
                            margin="dense"
                            label="Observaciones"
                            value={data.observaciones}
                            onChange={handleChange}
                            name="observaciones"
                            InputLabelProps={{shrink: true}}
                        />
                    </Grid>
                    <Grid item xs={12} sm>
                        <TextField
                            variant="outlined" margin="dense"
                            select
                            label="Tipo de cobro"
                            value={data.idTipoCobro}
                            name={"idTipoCobro"}
                            onChange={handleChange}
                        >
                            {dataTipoCobro.filter(item => configuraciones.idsTiposCobroSeleccionArray.find(i => i == item.m_nCodigo)).map((tipoCobro) => (
                                <MenuItem
                                    key={tipoCobro.m_nIdTipoCobro}
                                    value={tipoCobro.m_nIdTipoCobro}
                                >
                                    {tipoCobro.m_sDescripcion}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            </section>
            <section id={"paquetes"}>
                <Paquetes
                    dataPaquetes={dataPaquetes}
                    onChangeList={handleListPaquetesChange}
                    // disabled={state.agregar === "Consultar" || state.recoleccionConEmbarque}
                    cliente={data.cliente}
                    limpiarProducto={configuraciones.limpiarProducto}
                />
            </section>
        </div>
    )

}
