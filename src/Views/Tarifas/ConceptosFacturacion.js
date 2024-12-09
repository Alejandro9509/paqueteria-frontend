import React, {Component, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import {
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    Select,
    TextField, Tooltip
} from '@mui/material';
import PageviewIcon from "@mui/icons-material/Pageview";
import AddBoxIcon from '@mui/icons-material/AddBox';
import Autocomplete from '@mui/material/Autocomplete';
import CancelIcon from '@mui/icons-material/Cancel';
import {
    useTable,
    useFilters,
    useAsyncDebounce,
    useSortBy,
} from "react-table";
import {
    obtenerConceptosFacturacion,
    obtenerImpuestosByConceptosFacturacion
} from '../../Util/Contexts/ConceptosFacturacionContext';
import {obtenerProductos} from "../../Util/Contexts/ProductosContext";
import {API_HEADERS, dataGridLocaleText} from "../../Constants";
import {getUniqueListBy} from "../../Util/Util";
import {DataGrid} from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import {obtenerImpuestos} from "../../Util/Contexts/ImpuestosContext";
import DeleteIcon from "@mui/icons-material/Delete";
const headers = API_HEADERS

/**Props usadas:
 * conceptosBase={listado} : listado de conceptos de los que se puede elegir para agregar.
 * onChangeList={funcion} : funcion que regresa el listado de conceptos actualizados (no funciona).
 * dataList={listado} : recibe el listado de conceptos que se estará modificando.
 * consulta={booleano} : indica si es consulta para inhabilitar los inputs.
 * mostrarRangos={booleano} : indica si se van a mostrar los inputs de rangos y la información en listados
 * mostrarImpuestos={booleano} : indica si se van a mostrar los inputs de impuestos y la información en listados
 * keys={any} : clave que se le agregará a cada concepto para temas de filtrado.
 * agregarConcepto={funcion} : funcion a la que se le pasará el concepto que se va agregar al listado
 * eliminarConcepto={funcion} : funcion a la que se le pasará el concepto que se va eliminar del listado
 * ivaRetiene={listado} : listado de ids de los impuestos retiene usados por los conceptos
 * ivaTraslada={listado} : listado de ids de los impuestos traslada usados por los conceptos
 * mostrarTotales={booleano} : indica si se quiere que se muestren los totales de los conceptos
 * */
export default function ConceptosFacturacion(props) {
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const [state, setState] = useState({
        impuestos: [],
        ivaTraslada: [],
        ivaRetiene: [],
        tiposCalculo: [],
        columns: []
    })

    const [concepto, setConcepto] = useState({
        id:Math.floor(Math.random() * 10000),
        concepto: null,
        idConcepto: 0,
        importe: 0,
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
        agregadoDesde: props.keys
    })

    const resetConcepto = () => {
        setConcepto({
            id:Math.floor(Math.random() * 10000),
            concepto: props.conceptoFijo || null,
            idConcepto: props.conceptoFijo? props.conceptoFijo.m_nIdConceptosFacturacion : 0,
            importe: 0,
            nombreConcepto: props.conceptoFijo? props.conceptoFijo.m_sConcepto : '',
            importeRet: 0,
            retiene:  props.conceptoFijo? props.conceptoFijo.arClsDetalle.find(i => i.m_bPredeterminado && !i.m_bTrasladado).m_nIdImpuesto : 0,
            traslada:  props.conceptoFijo? props.conceptoFijo.arClsDetalle.find(i => i.m_bPredeterminado && i.m_bTrasladado).m_nIdImpuesto : 0,
            importeIVA: 0,
            rangoMinimo: 0,
            rangoMaximo: 0,
            tipoCalculo: 0,
            tipoMedida: 0,
            descuento: 0,
            agregadoDesde: props.keys
        })
    }

    const calcularImpuestos = (traslada, retiene, importe) => {
        setConcepto(concepto => {
            return { ...concepto,retiene: retiene, importe: importe, traslada: traslada }
        })
        if (state.impuestos.find(i => i.m_nIdImpuesto === parseInt(traslada)) != null) {
            const impuesto = state.impuestos.find(i => i.m_nIdImpuesto === parseInt(traslada))
            setConcepto(concepto=>{
                return {
                    ...concepto,
                    importeIVA: parseFloat((parseFloat(impuesto.m_nPorcentaje) / 100) * parseFloat(importe)).toFixed(2),
                    retiene: retiene,
                    importe: importe,
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
                    importe: importe,
                    traslada: traslada
                }
            })
        }
    }

    const calcularDescuento = (event) => {
        if (event.keyCode == 13){
            calcularImpuestos(concepto.traslada, concepto.retiene, concepto.importe - (concepto.importe * (concepto.descuento/100)))
        }
    }

    const handleChange = (event) => {
        event.preventDefault()
        if (event.target.name === "importe") {
            calcularImpuestos(concepto.traslada, concepto.retiene, event.target.value)
        } else if (event.target.name === "traslada") {
            calcularImpuestos(event.target.value, concepto.retiene, concepto.importe)
        } else if (event.target.name === "retiene") {
            calcularImpuestos(concepto.traslada, event.target.value, concepto.importe)
        } else {
            setConcepto(concepto => {
                return {
                    ...concepto,
                    [event.target.name]: event.target.value
                }
            })
        }
    }

    useEffect(value => {
        definirColumnas()
        if (state.impuestos.length === 0 ){
            getAllImpuestos()
        }
        if (state.tiposCalculo.length === 0 ){
            getAlTiposCalculo()
        }
        if (props.conceptosBase === undefined && props.conceptoFijo){
            obtenerImpuestosByConceptosFacturacion(props.conceptoFijo.m_nIdConceptosFacturacion).then(respuesta => {
                props.conceptoFijo.arClsDetalle = respuesta.data
                setConcepto(concepto => {
                    return {
                        ...concepto,
                        concepto: props.conceptoFijo,
                        idConcepto: props.conceptoFijo.m_nIdConceptosFacturacion,
                        importe: props.conceptoFijo.m_cImporte || 0,
                        nombreConcepto: props.conceptoFijo.m_sConcepto || '',
                        importeRet: props.conceptoFijo.m_cImporteRetiene || 0,
                        retiene: props.mostrarImpuestos ? respuesta.data.find(i => i.m_bPredeterminado && !i.m_bTrasladado).m_nIdImpuesto : respuesta.data.find(i => i.m_bPredeterminado && !i.m_bTrasladado).m_nIdImpuesto,
                        traslada: props.mostrarImpuestos ? respuesta.data.find(i => i.m_bPredeterminado && i.m_bTrasladado).m_nIdImpuesto : respuesta.data.find(i => i.m_bPredeterminado && i.m_bTrasladado).m_nIdImpuesto,
                        importeIVA: props.conceptoFijo.m_cImporteIva || 0
                    }
                })
            })
        }
    },[])

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

    /**Al seleccionar un concepto del listado del autocomplete*/
    const handleConceptoClick = (event, newValue) => {
        obtenerImpuestosByConceptosFacturacion(newValue.m_nIdConceptosFacturacion).then(respuesta => {
            newValue.arClsDetalle = respuesta.data
            if (respuesta.data.length > 0){
                setConcepto(concepto =>{
                    return {
                        ...concepto,
                        concepto: newValue,
                        idConcepto: newValue.m_nIdConceptosFacturacion,
                        importe: newValue.m_cImporte || 0,
                        nombreConcepto: newValue.m_sConcepto,
                        importeRet: newValue.m_cImporteRetiene || 0,
                        retiene: props.mostrarImpuestos ? respuesta.data.find(i => i.m_bPredeterminado && !i.m_bTrasladado).m_nIdImpuesto : respuesta.data.find(i => i.m_bPredeterminado && !i.m_bTrasladado).m_nIdImpuesto,
                        traslada: props.mostrarImpuestos ? respuesta.data.find(i => i.m_bPredeterminado && i.m_bTrasladado).m_nIdImpuesto : respuesta.data.find(i => i.m_bPredeterminado && i.m_bTrasladado).m_nIdImpuesto,
                        importeIVA: newValue.m_cImporteIva || 0
                    }
                })
            }
        });

    }

    const onSubmit = (event) => {
        event.preventDefault()
        props.agregarConcepto(concepto)
        resetConcepto()
    }

    const removeConcepto = (item) => {
        props.eliminarConcepto(item)
    }

    /** Cuando se le pica al editar de algun concepto*/
    const handleRowClick = (item) => {
        if (!props.consult) {
            item.concepto = props.conceptoFijo || props.conceptosBase.find(i => i.m_nIdConceptosFacturacion === item.idConcepto)
            setConcepto(item)
            removeConcepto(item)
        }
    }

    const handleDeleteClick = (item) => {
        removeConcepto(item)
    };

    /**Se definen las columnas que se van a mostrar*/
    const definirColumnas = () => {
        const {mostrarImpuestos, mostrarDescuento, mostrarRangos, mostrarConcepto, mostrarTipoMedida, mostrarTipoCalculo} = props
        let columns = []
        if (!(mostrarConcepto === false)){
            columns.push(
                {
                    headerName: "Concepto",
                    field: "nombreConcepto",
                    width: 250,
                },
            )
        }
        if (!(mostrarTipoMedida  === false)){
            columns.push(
                {
                    headerName: "Medida",
                    field: "tipoMedida",
                    width: 100,
                    valueFormatter: ({ value }) => `${value == 1 ? "Kg" : value == 2 ? "Tons" : value == 3 ? "Piezas" : value == 4 ? "Rangos" : ""}`,
                },
            )
        }
        if (mostrarRangos){
            columns.push(
                {
                    headerName: "Mínimo",
                    field: "rangoMinimo",
                    width: 100,
                },
                {
                    headerName: "Máximo",
                    field: "rangoMaximo",
                    width: 100,
                },
            )
        }
        columns.push(
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
        )
        if (!(mostrarTipoCalculo === false)){
            columns.push(
                {
                    headerName: "Cálculo",
                    field: "tipoCalculo",
                    width: 100,
                    valueFormatter: ({value}) =>
                        `${value == 1 ? "Fijo" : value == 2 ? "Factor" : value == 3 ? "Producto" : ""} `,

                },
            )
        }

        /*if (mostrarImpuestos){
            columns.push(
                {
                    headerName: "Traslada",
                    field: "traslada",
                    width: 200,
                    valueFormatter: ({value}) => `${state.impuestos.find(i => i.m_nIdImpuesto === parseInt(value)).m_sImpuesto} `,
                },
                {
                    headerName: "Retiene",
                    field: "retiene",
                    width: 200,
                    valueFormatter: ({value}) => `${state.impuestos.find(i => i.m_nIdImpuesto === parseInt(value)).m_sImpuesto} `,
                },
            )
        }*/
        if (mostrarDescuento){
            columns.push(
                {
                    headerName: "Descuento",
                    field: "descuento",
                    type:'number',
                    width: 150,
                    valueFormatter: ({ value }) => `${value}%`,

                },
            )
        }

        columns.push(
            {
                headerName: "Acciones",
                sortable: false, filterable: false,
                field: "",
                minWidth: 250,
                renderCell: (row) => {
                    return (
                        <div>
                            <IconButton color="inherit" size="small" aria-label="delete" onClick={() => handleRowClick(row.row)}>
                                <EditIcon fontSize="large" />
                            </IconButton>
                            <IconButton color="inherit" size="small" aria-label="delete" onClick={() => handleDeleteClick(row.row)}>
                                <DeleteIcon fontSize="large" />
                            </IconButton>
                        </div>
                    )
                }
            },
        )
        setState(state => {
            return{
                ...state,
                columns: columns
            }
        })
    }

    return (
        <div>
            <div className="row">
                <Grid container spacing={1}>
                    <Grid item xs={2}>
                        <div className="input">
                            <Autocomplete
                                value={props.conceptoFijo ? props.conceptoFijo :  concepto.concepto}
                                freeSolo
                                onChange={(event, newValue) => handleConceptoClick(event, newValue)}
                                id="concepto"
                                disableClearable
                                forcePopupIcon={false}
                                disabled={props.conceptoFijo ? true :  props.consulta}
                                options={props.conceptosBase ? props.conceptosBase : []}
                                getOptionLabel={(option) =>
                                    option.m_sConcepto
                                }
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
                    {!(props.mostrarTipoMedida === false) &&
                    <Grid item xs={2}>
                        <label className="input select" style={{ width: "100%" }}>
                            <FormControl fullWidth variant="outlined" margin="dense">
                                <InputLabel id="tipoLabel">Medida</InputLabel>
                                <Select
                                    labelId="tipoMedidaLabel"
                                    label="Medida"
                                    className="form-control"
                                    onChange={handleChange}
                                    name="tipoMedida"
                                    value={concepto.tipoMedida}
                                >
                                    <option key={0} value={0}>Selecciona</option>
                                    <option key={1} value={1}>Kg</option>
                                    <option key={2} value={2}>Toneladas</option>
                                    <option key={3} value={3}>Piezas</option>
                                    <option key={3} value={4}>Rangos</option>

                                </Select>
                            </FormControl>
                        </label>
                    </Grid>
                    }
                    {props.mostrarRangos &&
                    <Grid item xs={2}>
                        <div className="input">
                            <TextField variant="outlined" margin="dense"
                                       onChange={handleChange}
                                       className="form-control"
                                       type="number"
                                       label="Min"
                                       style={{textAlign: "right"}}
                                       value={concepto.rangoMinimo}
                                       name="rangoMinimo"
                            />
                        </div>
                    </Grid>
                    }
                    {props.mostrarRangos &&
                    <Grid item xs={2}>
                        <div className="input">
                            <TextField variant="outlined" margin="dense"
                                       onChange={handleChange}
                                       className="form-control"
                                       type="number"
                                       label="Max"
                                       style={{textAlign: "right"}}
                                       value={concepto.rangoMaximo}
                                       name="rangoMaximo"
                            />
                        </div>
                    </Grid>
                    }
                    <Grid item xs={2}>
                        <div className="input">
                            <TextField variant="outlined" margin="dense"
                                       onChange={handleChange}
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
                    {props.mostrarImpuestos &&
                    <Grid item xs={2}>
                        <label className="input select" style={{width: "100%"}}>
                            <FormControl fullWidth variant="outlined" margin="dense">
                                <InputLabel id="trasladaLabel">Traslada</InputLabel>
                                <Select
                                    labelId="trasladaLabel"
                                    label="Traslada"
                                    className="form-control"
                                    value={concepto.traslada}
                                    onChange={handleChange}
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
                    }
                    {props.mostrarImpuestos &&
                    <Grid item xs={2}>
                        <div className="input">
                            <TextField variant="outlined" margin="dense"
                                       onChange={handleChange}
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
                    }
                    {props.mostrarImpuestos &&
                    <Grid item xs={2}>
                        <label className="input select" style={{width: "100%"}}>
                            <FormControl fullWidth variant="outlined" margin="dense">
                                <InputLabel id="retieneLabel">Retiene</InputLabel>
                                <Select
                                    labelId="retieneLabel"
                                    label="Retiene"
                                    className="form-control"
                                    onChange={handleChange}
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
                    }
                    {props.mostrarImpuestos &&
                    <Grid item xs={2}>
                        <div className="input">
                            <TextField variant="outlined" margin="dense"
                                       onChange={handleChange}
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
                    }

                    {!(props.mostrarTipoCalculo === false) &&
                        <Grid item xs={2}>
                            <label className="input select" style={{width: "100%"}}>
                            <FormControl fullWidth variant="outlined" margin="dense">
                                <InputLabel id="tipoLabel">Tipo Cálculo</InputLabel>
                                <Select
                                    labelId="tipoLabel"
                                    label="Tipo Cálculo"
                                    className="form-control"
                                    onChange={handleChange}
                                    name="tipoCalculo"
                                    value={concepto.tipoCalculo}
                                >
                                    <option key={0} value={0}>Selecciona</option>
                                    {state.tiposCalculo.map((t) =>
                                        (t.m_nIdTarifaTipoCalculo == 3 ? (concepto.tipoMedida == 3 || concepto.tipoMedida == 4) &&
                                            <option key={t.m_nIdTarifaTipoCalculo}
                                                    value={t.m_nIdTarifaTipoCalculo}>{t.m_sTarifaTipoCalculo}</option>
                                            : <option key={t.m_nIdTarifaTipoCalculo}
                                                      value={t.m_nIdTarifaTipoCalculo}>{t.m_sTarifaTipoCalculo}</option>))
                                    }
                                </Select>
                            </FormControl>
                        </label>
                        </Grid>
                    }

                    {props.mostrarDescuento &&
                        <Grid item xs={2}>
                            <div className="input">
                                <TextField variant="outlined" margin="dense"
                                           onChange={handleChange}
                                           className="form-control"
                                           type="number"
                                           style={{textAlign: "right"}}
                                           disabled={!props.mostrarDescuento}
                                           label="Porcentaje Descuento"
                                           step="1"
                                           min="0"
                                           value={concepto.descuento}
                                           name="descuento"
                                           helperText={"Presione enter una vez escrito el porcentaje para aplicar el cálculo."}
                                           onKeyDown={calcularDescuento}
                                />
                            </div>
                        </Grid>
                    }
                    <Grid item xs>
                        <IconButton onClick={onSubmit} style={{ padding: "0px" }} size="large">
                            <AddBoxIcon style={{ fill: "green", fontSize: "xx-large" }} />
                        </IconButton>
                    </Grid>
                </Grid>
            </div>

            <div className="row">

                <div className="col-md-12 col-sm-12" style={{ padding: "5px" }}>
                    <div className="row" style={{ height: '100%'}}>
                        <DataGrid
                            localeText={dataGridLocaleText}
                            density="compact"
                            columns={state.columns}
                            rows={props.dataList}
                            hideFooterPagination
                            autoHeight {...{dataSet:'Commodity', rowLength: 4, maxColumns: 6}}
                            getRowId={(row) => row.id}
                            // onRowSelected={(row) => handleRowClick(row.data)}
                        />
                    </div>

                </div>
                {
                    props.mostrarTotales &&
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
                            }}> ${parseFloat(props.dataList.reduce((total, arg) => total + parseFloat(arg.importe), 0)).toFixed(2)}</div>
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
                            }}>  {props.ivaTraslada.map(t => (
                                <div>{`${state.impuestos.length !== 0 ? 
                                    state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t)) ? 
                                        state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t)).m_sImpuesto : 
                                        "" : 
                                    ""} `} ${parseFloat(props.dataList.filter(c => c.traslada === t).reduce((total, arg) => total + parseFloat(arg.importeIVA), 0)).toFixed(2)}<br/>
                                </div>))} {props.ivaRetiene.map(t => (
                                <div>{`${state.impuestos.length !== 0 ? 
                                    `${state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t)) ? 
                                        state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t)).m_sImpuesto : 
                                        ""}` : 
                                    ""} `} ${parseFloat(props.dataList.filter(c => c.retiene === t).reduce((total, arg) => total + parseFloat(arg.importeRet), 0)).toFixed(2)}<br/>
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
                                props.dataList.reduce((total, arg) => total + parseFloat(arg.importe), 0) +
                                props.dataList.reduce((total, arg) => total + parseFloat(arg.importeIVA), 0)+
                                props.dataList.reduce((total, arg) => total + parseFloat(arg.importeRet), 0)
                            ).toFixed(2)}</div>
                        </div>
                    </div>
                }


            </div>

        </div>
    );
}
