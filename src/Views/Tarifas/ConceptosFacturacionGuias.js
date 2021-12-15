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
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import AddBoxIcon from "@material-ui/icons/AddBox";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {DataGrid} from "@material-ui/data-grid";
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
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
const headers = API_HEADERS

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

function ConceptosFacturacionGuias({dataPaquetes = [],onChangeList, disabled,keys, conceptosBase=[],ivaRetiene, ivaTraslada}) {

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
                <IconButton color="inherit" size="small" aria-label="delete" onClick={handleEditClick}>
                    <EditIcon fontSize="large" />
                </IconButton>
                <IconButton color="inherit" size="small" aria-label="delete" onClick={handleDeleteClick}>
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
            valueFormatter: ({ value }) => `${value}%`,

        },
        {
            headerName: "Importe Original",
            field: "importeInicial",
            type:'number',
            width: 150,
            valueFormatter: ({value}) => currencyFormatter.format(Number(value)),
        },
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
        const url = `${process.env.REACT_APP_API_URL}/TipoCalculo/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            setState(state =>{
                return { ...state, tiposCalculo: respuesta.data }
            })
        });
    }

    const validarPaquetes = (paquete) => {
        return paquete.idConcepto !== 0
    }

    const addPaquetev2 = (event) => {
        console.log(concepto)
        let paq = concepto
        if (validarPaquetes(paq)){

            dataPaquetes.push(paq);
            resetPaquete()

            onChangeList(dataPaquetes)
        }else{
            showSuccess("No se pueden agregar conceptos vacíos.")
        }
    }

    /**Reacciona al hacer clic en editar concepto*/
    const handleEditConcepto = (data) =>{
        if(!disabled){
            onChangeList(dataPaquetes.filter((i) => i.id != data.id))
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

    return(
        <div>
            <div className="row">
                <Grid container spacing={1}>
                    <Grid item xs>
                        <div className="input">
                            <Autocomplete
                                value={concepto.concepto}
                                freeSolo
                                onChange={(event, newValue) => handleConceptoClick(event, newValue)}
                                id="concepto"
                                disableClearable
                                forcePopupIcon={false}
                                disabled={disabled}
                                options={conceptosBase}
                                getOptionLabel={(option) => option.m_sConcepto}
                                variant="outlined"
                                style={{transform: "translate(14px, 10px) scale(1) !important"}}
                                renderInput={(params) => (
                                    <div>
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Concepto"
                                            className="form-control"
                                            margin="dense"
                                        />
                                    </div>
                                )}
                            />
                        </div>
                    </Grid>
                    <Grid item xs>
                        <div className="input">
                            <TextField variant="outlined" margin="dense"
                                       onChange={handleChangePaquetev2}
                                       className="form-control"
                                       type="number"
                                       label="Importe"
                                       style={{textAlign: "right"}}
                                       step="1"
                                       min="0"
                                       value={concepto.importe}
                                       name="importe"
                            />
                        </div>
                    </Grid>
                    <Grid item xs>
                        <label className="input select" style={{width: "100%"}}>
                            <FormControl fullWidth variant="outlined" margin="dense">
                                <InputLabel id="trasladaLabel">Traslada</InputLabel>
                                <Select
                                    labelId="trasladaLabel"
                                    label="Traslada"
                                    className="form-control"
                                    value={concepto.traslada}
                                    onChange={handleChangePaquetev2}
                                    name="traslada"
                                >
                                    <option key={0} value={0}>Selecciona</option>
                                    {state.impuestos.filter(i => i.m_nTIpoCalculo === 1).map((impuesto) => (
                                        <option
                                            key={impuesto.m_nIdImpuesto}
                                            value={impuesto.m_nIdImpuesto}
                                        >
                                            {impuesto.m_sImpuesto}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </label>
                    </Grid>
                    <Grid item xs>
                        <div className="input">
                            <TextField variant="outlined" margin="dense"
                                       onChange={handleChangePaquetev2}
                                       className="form-control"
                                       type="number"
                                       style={{textAlign: "right"}}
                                       disabled
                                       label="Importe IVA"
                                       step="1"
                                       min="0"
                                       value={concepto.importeIVA}
                                       name="importeIVA"
                            />
                        </div>
                    </Grid>
                    <Grid item xs>
                        <label className="input select" style={{width: "100%"}}>
                            <FormControl fullWidth variant="outlined" margin="dense">
                                <InputLabel id="retieneLabel">Retiene</InputLabel>
                                <Select
                                    labelId="retieneLabel"
                                    label="Retiene"
                                    className="form-control"
                                    onChange={handleChangePaquetev2}
                                    name="retiene"
                                    value={concepto.retiene}
                                >
                                    <option key={0} value={0}>Selecciona</option>
                                    {state.impuestos.filter(i => i.m_nTIpoCalculo === 2).map((impuesto) => (
                                        <option
                                            key={impuesto.m_nIdImpuesto}
                                            value={impuesto.m_nIdImpuesto}
                                        >
                                            {impuesto.m_sImpuesto}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </label>
                    </Grid>
                    <Grid item xs>
                        <div className="input">
                            <TextField variant="outlined" margin="dense"
                                       onChange={handleChangePaquetev2}
                                       className="form-control"
                                       type="number"
                                       style={{textAlign: "right"}}
                                       disabled
                                       label="Importe Ret"
                                       step="1"
                                       min="0"
                                       value={concepto.importeRet}
                                       name="importeRet"
                            />
                        </div>
                    </Grid>
                    <Grid item xs>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={state.aplicaDescuento}
                                    onChange={handleChangePaquetev2}
                                    name="aplicaDescuento"
                                    color="primary"
                                />
                            }
                            label="Agregar descuento"
                        />
                    </Grid>
                    {state.aplicaDescuento &&
                    <Grid item container spacing={1}>
                        <RadioGroup aria-label="gender" name="aplicarDescuentoA" value={state.aplicarDescuentoA} onChange={handleChangePaquetev2}>
                            <FormControlLabel value="Concepto" control={<Radio />} label="Aplicar a concepto" />
                            <FormControlLabel value="Total" control={<Radio />} label="Aplicar a total" />
                        </RadioGroup>
                        <Grid item xs={2}>
                            <div className="input">
                                <TextField variant="outlined" margin="dense"
                                           onChange={handleChangePaquetev2}
                                           className="form-control"
                                           type="number"
                                           style={{textAlign: "right"}}
                                           label="Porcentaje Descuento"
                                           step="1"
                                           min="0"
                                           value={concepto.descuento}
                                           name="descuento"
                                           helperText={`Importe inicial: ${concepto.importeInicial}`}
                                           InputProps={{
                                               style: {
                                                   height: "33px",
                                                   fontSize: "14px",
                                               },
                                               type: "search",
                                               disableUnderline: true,
                                               endAdornment: (
                                                   <InputAdornment position="end">
                                                       <IconButton
                                                           padding="0px"
                                                           style={{paddingRight: "0px",}}
                                                           onClick={calcularDescuento}
                                                           disabled={!(concepto.descuento.length > 0 && concepto.descuento > 0)}
                                                       >
                                                           <ArrowForwardIcon
                                                               style={{
                                                                   color: "#F9A03E",
                                                                   fontSize: 32,
                                                                   paddingInlineEnd: 0,
                                                                   paddingRight: 0,
                                                                   paddingBlockEnd: 0,
                                                                   paddingLeft: 0,
                                                                   paddingBlock: 0,
                                                                   cursor:"pointer"
                                                               }}
                                                           />
                                                       </IconButton>
                                                   </InputAdornment>
                                               ),
                                           }}
                                />
                            </div>
                        </Grid>
                    </Grid>
                    }
                    <Grid item container xs={12}>
                        {/*<IconButton onClick={addPaquetev2} style={{ padding: "0px" }}>
                            <AddBoxIcon style={{ fill: "green", fontSize: "xx-large" }} />
                        </IconButton>*/}
                        {/*<Paper onClick={addPaquetev2} style={{width:'100%', height:'50px',backgroundColor: "green"}}/>*/}
                        <Card style={{backgroundColor: "green",width:'100%',fontSize: "large", textAlign:'center', color:'white'}}>
                            <CardActionArea onClick={addPaquetev2} style={{height:'30px'}}>
                                Agregar concepto
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>
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
                        }}> ${parseFloat(dataPaquetes.reduce((total, arg) => total + parseFloat(arg.importe), 0)).toFixed(2)}</div>
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
                        }}>  {ivaTraslada.map(t => (
                            <div>{`${state.impuestos.length !== 0 ?
                                state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t)) ?
                                    state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t)).m_sImpuesto :
                                    "" :
                                ""} `} ${parseFloat(dataPaquetes.filter(c => c.traslada === t).reduce((total, arg) => total + parseFloat(arg.importeIVA), 0)).toFixed(2)}<br/>
                            </div>))} {ivaRetiene.map(t => (
                            <div>{`${state.impuestos.length !== 0 ?
                                `${state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t)) ?
                                    state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t)).m_sImpuesto :
                                    ""}` :
                                ""} `} ${parseFloat(dataPaquetes.filter(c => c.retiene === t).reduce((total, arg) => total + parseFloat(arg.importeRet), 0)).toFixed(2)}<br/>
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
                            dataPaquetes.reduce((total, arg) => total + parseFloat(arg.importe), 0) +
                            dataPaquetes.reduce((total, arg) => total + parseFloat(arg.importeIVA), 0)-
                            dataPaquetes.reduce((total, arg) => total + parseFloat(arg.importeRet), 0)
                        ).toFixed(2)}</div>
                    </div>
                </div>


            </div>

        </div>
    )
}

export default ConceptosFacturacionGuias;