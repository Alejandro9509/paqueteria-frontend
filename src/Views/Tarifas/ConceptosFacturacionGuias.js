import React, {useEffect, useState} from "react";
import {
    Card, CardActionArea,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    Paper,
    Radio,
    RadioGroup,
    Select
} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {DataGrid} from "@mui/x-data-grid";
import {dataGridLocaleText} from "../../Constants";
import Noty from "noty";
import {obtenerEmbalajes} from "../../Util/Contexts/EmbalajesContext";
import axios from "axios";
import {API_HEADERS} from "../../Constants"
import {
    obtenerImpuestosByConceptosFacturacion,
    obtenerSATEmbalajes,
    obtenerSATServicios,
    obtenerSATUnidades,
} from "../../Util/Contexts/ConceptosFacturacionContext";
import {obtenerImpuestos} from "../../Util/Contexts/ImpuestosContext";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import DialogoNuevoConcepto from "./DialogoNuevoConcepto";
import {getUniqueListBy, validarDerecho} from "../../Util/Util";
const headers = API_HEADERS

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

function ConceptosFacturacionGuias({dataPaquetes = [],onChangeList, disabled,keys, conceptosBase=[],esRec,ivaRetiene, ivaTraslada}) {

    function RowMenuCell(props) {
        const { api, id } = props;

        const handleEditClick = (event) => {
            event.stopPropagation();
            let row = dataPaquetes.filter((p) => p.id === id)[0];
            handleEditConcepto(row);
        };

        const handleDeleteClick = (event) => {
            event.stopPropagation();
            let row = dataPaquetes.filter((p) => p.id === id)[0];
            handleDeleteConcepto(row);
        };

        return (
            <div>
                <IconButton disabled={esRec?!validarDerecho(9101506):!validarDerecho(9101501)} color="inherit" size="small" aria-label="delete" onClick={handleEditClick}>
                    <EditIcon fontSize="large" />
                </IconButton>
                <IconButton disabled={esRec?!validarDerecho(9101507):!validarDerecho(9101502)} color="inherit" size="small" aria-label="delete" onClick={handleDeleteClick}>
                    <DeleteIcon fontSize="large" />
                </IconButton>
            </div>
        );
    }

    const columnsPaquetes = React.useMemo(() => [
        {
            headerName: "Concepto",
            field: "nombreConcepto",
            width: 250,
        },
        {
            headerName: "Importe",
            field: "importe",
            type:'number',
            width: 150,
            valueFormatter: ({value}) => currencyFormatter.format(Number(value)),
        },
        {
            headerName: "IVA",
            field: "importeIVA",
            type:'number',
            width: 150,
            valueFormatter: ({value}) => currencyFormatter.format(Number(value)),
        },
        {
            headerName: "Retiene",
            field: "importeRet",
            type:'number',
            width: 150,
            valueFormatter: ({value}) => currencyFormatter.format(Number(value)),

        },
        {
            headerName: "Descuento",
            field: "descuento",
            type:'number',
            width: 150,
            valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),

        },
        !disabled &&
        {
            field: 'complementos',
            headerName: 'Acciones',
            renderCell: RowMenuCell,
            sortable: false,
            width: 90,
            headerAlign: 'center',
            filterable: false,
            align: 'center',
            disableColumnMenu: true,
            disableReorder: true,
        }
    ]);

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    const [concepto, setConcepto] = useState({
        id:Math.floor(Math.random() * 10000),
        concepto: null,
        idConcepto: 0,
        importe: 0,
        importeInicial: 0,
        nombreConcepto: "",
        importeRet: "0",
        retiene: 0,
        traslada: 0,
        importeIVA: "0",
        rangoMinimo: 0,
        rangoMaximo: 0,
        tipoCalculo: 0,
        tipoMedida: 0,
        descuento: 0,
        agregadoDesde: keys
    })
    const [state, setState] = useState({
        impuestos: [],
        ivaTraslada: [],
        ivaRetiene: [],
        tiposCalculo: [],
        columns: [],
        aplicaDescuento: false,
        aplicarDescuentoA: 'Concepto',
    })

    const resetPaquete = () =>{
        setConcepto(concepto => {
            return {
                ...concepto,
                id:Math.floor(Math.random() * 10000),
                concepto: null,
                idConcepto: 0,
                importe: 0,
                importeInicial: 0,
                nombreConcepto: "",
                importeRet: "0",
                retiene: 0,
                traslada: 0,
                importeIVA: "0",
                rangoMinimo: 0,
                rangoMaximo: 0,
                tipoCalculo: 0,
                tipoMedida: 0,
                descuento: 0,
                agregadoDesde: keys
            }
        })
    }

    useEffect(value => {
        if (state.impuestos.length === 0 ){
            getAllImpuestos()
        }
        if (state.tiposCalculo.length === 0 ){
            getAlTiposCalculo()
        }
    }, [])

    const getAllImpuestos = () => {
        obtenerImpuestos().then(respuesta => {
            setState(state =>{
                return { ...state, impuestos: respuesta.data }
            })
        });
    };

    const getAlTiposCalculo = () => {
        const url = `${process.env.REACT_APP_REPORT_URL}/api/TipoCalculo/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            setState(state =>{
                return { ...state, tiposCalculo: respuesta.data }
            })
        });
    }

    const validarPaquetes = (paquete) => {
        return paquete.idConcepto !== 0
    }

    const addPaquetev2 = (data) => {
        console.log(data)
        let paq = data
        /*if (validarPaquetes(paq)){

            dataPaquetes.push(paq);
            resetPaquete()

            onChangeList(dataPaquetes)
        }else{
            showSuccess("No se pueden agregar conceptos vacíos.")
        }*/
        const arraynew = []
        if (dataPaquetes.find(item => item.id === data.id)){
            dataPaquetes.forEach(item => {
                if (item.id === data.id){
                    item = data
                }
                arraynew.push(item)
            })
        }else{
            dataPaquetes.push(paq);
            dataPaquetes.forEach(item => {
                arraynew.push(item)
            })
        }
        onChangeList(arraynew)

    }

    /**Reacciona al hacer clic en editar concepto*/
    const handleEditConcepto = (data) =>{
        if(!disabled){
            // onChangeList(dataPaquetes.filter((i) => i.id != data.id))
            console.log(data)
            setConcepto(data)
        }

    }

    /**Reacciona al hacer clic en eliminar concepto*/
    const handleDeleteConcepto = (data) =>{
        if(!disabled){
            onChangeList(dataPaquetes.filter((i) => i.id != data.id))
        }

    }

    const calcularDescuento = (event) => {
        debugger
        if (state.aplicarDescuentoA === "Concepto"){
            setConcepto(concepto=>{
                return {
                    ...concepto,
                    importeInicial: parseFloat(concepto.importe).toFixed(2)
                }
            })
            calcularImpuestos(concepto.traslada, concepto.retiene, concepto.importe - (concepto.importe * (concepto.descuento/100)))
        }else if (state.aplicarDescuentoA === "Total"){
            dataPaquetes.forEach(item => {
                item.importe = item.importe * (concepto.descuento/100)
            })
            onChangeList(dataPaquetes)
        }

    }

    const calcularImpuestos = (traslada, retiene, importe) => {
        setConcepto(concepto => {
            return { ...concepto,retiene: retiene, importe: parseFloat(importe).toFixed(2), traslada: traslada }
        })
        if (state.impuestos.find(i => i.m_nIdImpuesto === parseInt(traslada)) != null) {
            const impuesto = state.impuestos.find(i => i.m_nIdImpuesto === parseInt(traslada))
            setConcepto(concepto=>{
                return {
                    ...concepto,
                    importeIVA: parseFloat((parseFloat(impuesto.m_nPorcentaje) / 100) * parseFloat(importe)).toFixed(2),
                    retiene: retiene,
                    importe: parseFloat(importe).toFixed(2),
                    traslada: traslada
                }
            })
        }
        if (state.impuestos.find(i => i.m_nIdImpuesto === parseInt(retiene)) != null) {
            const impuesto = state.impuestos.find(i => i.m_nIdImpuesto === parseInt(retiene))
            setConcepto(concepto=>{
                return {
                    ...concepto,
                    importeRet: parseFloat((parseFloat(impuesto.m_nPorcentaje) / 100) * parseFloat(importe)).toFixed(2),
                    retiene: retiene,
                    importe: parseFloat(importe).toFixed(2),
                    traslada: traslada
                }
            })
        }
    }

    const handleChangePaquetev2 = (event) => {
        event.preventDefault()
        if (event.target.name === "importe") {
            calcularImpuestos(concepto.traslada, concepto.retiene, event.target.value)
        } else if (event.target.name === "traslada") {
            calcularImpuestos(event.target.value, concepto.retiene, concepto.importe)
        } else if (event.target.name === "retiene") {
            calcularImpuestos(concepto.traslada, event.target.value, concepto.importe)
        } else if(event.target.name === "aplicaDescuento") {
            setState(state => {
                return {
                    ...state,
                    [event.target.name]: event.target.checked
                }
            })
        } else if(event.target.name === "aplicarDescuentoA") {
            setState(state => {
                return {
                    ...state,
                    [event.target.name]: event.target.value
                }
            })
        } else {
            setConcepto(concepto => {
                return {
                    ...concepto,
                    [event.target.name]: event.target.value
                }
            })
        }
    };

    /**Al seleccionar un concepto del listado del autocomplete*/
    const handleConceptoClick = (event, newValue) => {
        obtenerImpuestosByConceptosFacturacion(newValue.m_nIdConceptosFacturacion).then(respuesta => {
            newValue.arClsDetalle = respuesta.data
            console.log(newValue)
            if (respuesta.data.length > 0){
                setConcepto(concepto =>{
                    return {
                        ...concepto,
                        concepto: newValue,
                        idConcepto: newValue.m_nIdConceptosFacturacion,
                        importe: newValue.m_cImporte || 0,
                        nombreConcepto: newValue.m_sConcepto,
                        importeRet: newValue.m_cImporteRetiene || 0,
                        retiene: respuesta.data.find(i => i.m_bPredeterminado && !i.m_bTrasladado).m_nIdImpuesto,
                        traslada: respuesta.data.find(i => i.m_bPredeterminado && i.m_bTrasladado).m_nIdImpuesto,
                        importeIVA: newValue.m_cImporteIva || 0
                    }
                })
            }
        });

    }

    const round = (num) => {
        let m = Number((Math.abs(num) * 100).toPrecision(15));
        return Math.round(m) / 100 * Math.sign(num);
    }

    return(
        <div>
            <div className="row">
                <DialogoNuevoConcepto
                    agregarConcepto={addPaquetev2}
                    concepto={concepto}
                    dataPaquetes={dataPaquetes}
                    conceptosBase={conceptosBase}
                    keys={keys}
                    esRec={esRec}
                    disabled={disabled}
                    resetPaquete={resetPaquete}
                />
            </div>

            <div className="row">

                <div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>
                    <div className="row" style={{ height: '100%'}}>
                        <DataGrid
                            localeText={dataGridLocaleText}
                            density="compact"
                            columns={columnsPaquetes}
                            rows={dataPaquetes}
                            hideFooterPagination
                            autoHeight {...{dataSet:'Commodity', rowLength: 4, maxColumns: 6}}
                            getRowId={(row) => row.id}
                            // onRowSelected={(row) => handleRowClick(row.data)}
                        />
                    </div>

                </div>
                <div className="col-md-12 col-sm-12" style={{ padding: "5px", backgroundColor: "white", backgroundClip: "content-box" }}>

                    <div className="col-md-12 col-sm-12"
                         style={{alignItems: "right", display: "inline-flex", justifyContent: "flex-end"}}>
                        <div style={{margin: "5px", padding: "5px"}}>Subtotal</div>
                        <div style={{
                            margin: "4px",
                            padding: "4px",
                            marginRight: "15px",
                            backgroundColor: "white",
                            backgroundClip: "border-box",
                            borderStyle: "solid",
                            borderColor: "gray",
                            minWidth: "230px",
                            textAlign: "right"
                        }}> ${round(parseFloat(dataPaquetes.reduce((total, arg) => total + parseFloat(arg.importe), 0)))}</div>
                    </div>
                    <div className="col-md-12 col-sm-12"
                         style={{alignItems: "right", display: "inline-flex", justifyContent: "flex-end"}}>
                        <div style={{margin: "5px", padding: "5px"}}>Descuento</div>
                        <div style={{
                            margin: "4px",
                            padding: "4px",
                            marginRight: "15px",
                            backgroundColor: "white",
                            backgroundClip: "border-box",
                            borderStyle: "solid",
                            borderColor: "gray",
                            minWidth: "230px",
                            textAlign: "right"
                        }}> ${round(parseFloat(dataPaquetes.reduce((total, arg) => total + parseFloat(arg.descuento), 0)))}</div>
                    </div>
                    <div className="col-md-12 col-sm-12"
                         style={{alignItems: "right", display: "inline-flex", justifyContent: "flex-end"}}>

                        <div style={{
                            margin: "4px",
                            padding: "4px",
                            marginRight: "15px",
                            backgroundColor: "white",
                            backgroundClip: "border-box",
                            borderStyle: "solid",
                            borderColor: "gray",
                            minWidth: "230px",
                            textAlign: "right"
                        }}>  {getUniqueListBy(dataPaquetes, "traslada").map(t => (
                            <div>{`${state.impuestos.length !== 0 ?
                                state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t.traslada)) ?
                                    state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t.traslada)).m_sImpuesto :
                                    "" :
                                ""} `} ${round(parseFloat(dataPaquetes.filter(c => c.traslada === t.traslada).reduce((total, arg) => total + parseFloat(arg.importeIVA), 0)))}<br/>
                            </div>))}
                            {getUniqueListBy(dataPaquetes, "retiene").map(t => (
                            <div>{`${state.impuestos.length !== 0 ?
                                `${state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t.retiene)) ?
                                    state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t.retiene)).m_sImpuesto :
                                    ""}` :
                                ""} `} ${round(parseFloat(dataPaquetes.filter(c => c.retiene === t.retiene).reduce((total, arg) => total + parseFloat(arg.importeRet), 0)))}<br/>
                            </div>))} </div>
                    </div>
                    <div className="col-md-12 col-sm-12"
                         style={{alignItems: "right", display: "inline-flex", justifyContent: "flex-end"}}>
                        <div style={{margin: "5px", padding: "5px"}}>Total</div>
                        <div style={{
                            margin: "4px",
                            padding: "4px",
                            marginRight: "15px",
                            backgroundColor: "white",
                            backgroundClip: "border-box",
                            borderStyle: "solid",
                            borderColor: "gray",
                            minWidth: "230px",
                            textAlign: "right"
                        }}> ${parseFloat(
                            dataPaquetes.reduce((total, arg) => total + parseFloat(arg.importe), 0)
                            + dataPaquetes.reduce((total, arg) => total + parseFloat(arg.importeIVA), 0)
                            - dataPaquetes.reduce((total, arg) => total + parseFloat(arg.importeRet), 0)
                            - dataPaquetes.reduce((total, arg) => total + parseFloat(arg.descuento), 0)
                        ).toFixed(2)}</div>
                    </div>
                </div>


            </div>

        </div>
    )
}

export default ConceptosFacturacionGuias;