import React, {useEffect, useState} from 'react';
import {
    Grid,
    IconButton,
    TextField
} from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Autocomplete from '@mui/material/Autocomplete';
import CancelIcon from '@mui/icons-material/Cancel';
import {obtenerProductos} from "../../Util/Contexts/ProductosContext";

function not(a, b) {
    return a.filter((value) => value !== b);
}

export default function ProductosPrecios({dataList = [], onChangeList, disabled,ivaRetiene,ivaTraslada, mostrarTotal}) {
    const [state, setState] = useState({
        allProductos: [],
        productosDisponibles: []
    })

    const [dataProducto, setDataProducto] = useState({
        producto: null,
        m_cImporte: 0,
        m_nIdProducto: 0,
        m_sDescripcion: '',
    })

    useEffect(value => {
        getAllProductos()
    }, [])


    const getAllProductos = () => {
        obtenerProductos().then(respuesta => {
            setState(state => {
                return {
                    ...state,
                    allProductos: respuesta.data,
                }
            })
        });
    }

    const getProductosNoSeleccionados = () => {
        let productosDisponibles =[]
        state.allProductos.forEach(x => productosDisponibles.push(x))
        dataList.forEach(i => {
            productosDisponibles = productosDisponibles.filter(j => parseInt(j.m_nIdProducto) !== parseInt(i.m_nIdProducto))

        })
        return productosDisponibles
    }

    const handleChange = (event) => {
        event.preventDefault()
        setDataProducto(dataProducto => {
            return {
                ...dataProducto,
                [event.target.name]: event.target.value
            }
        })
    }

    const handleChangeAutocomplete = (input, value) => {
        setDataProducto(dataProducto => {
            return {
                ...dataProducto,
                [input]: value
            }
        })
    }

    const onSubmit = (event) => {
        if (event){
            event.preventDefault()
        }
        // this.props.addConcepto(state)
        if (dataProducto.producto === null){
            return
        }
        if (dataProducto.m_cImporte < 0){
            return
        }
        dataProducto.m_nIdProducto = dataProducto.producto.m_nIdProducto
        dataProducto.m_sDescripcion = dataProducto.producto.m_sDescripcion
        dataList.push(dataProducto)
        onChangeList([], dataList)
        setDataProducto({
            producto: null,
            m_cImporte: 0,
            m_nIdProducto: 0,
            m_sDescripcion: '',
        })
    }

    const removeConcepto = (event, item) => {
        if (event !== undefined) {
            event.preventDefault()
        }
        onChangeList([], not(dataList, item))
    }

    const handleRowClick = (event, index, concepto) => {
        if (!disabled) {
            removeConcepto(undefined, concepto)
            setDataProducto(concepto)
        }
    }

    return (
        <div>
            {
                !disabled &&
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <div className="input">
                            <Autocomplete
                                value={dataProducto.producto}
                                freeSolo
                                fullWidth
                                onChange={(event, newValue) => {
                                    handleChangeAutocomplete("producto", newValue)
                                }}
                                id="producto"
                                disableClearable
                                forcePopupIcon={false}
                                disabled={disabled}
                                options={getProductosNoSeleccionados()}
                                getOptionLabel={(option) =>
                                    option ? option.m_nIdProducto+'-'+option.m_sDescripcion : ''
                                }
                                variant="outlined"
                                style={{
                                    transform: "translate(14px, 10px) scale(1) !important"
                                }}
                                renderInput={(params) => (
                                    <div>
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            size="small"
                                            label="Producto"
                                            className="form-control"
                                            margin="dense"
                                            InputProps={{
                                                ...params.InputProps,
                                                style: {height: "33px", fontSize: "14px"},
                                                type: "search",
                                                disableUnderline: true,

                                            }}
                                        />
                                    </div>
                                )}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                        <div className="input">
                        <TextField variant="outlined" margin="dense"
                                   onChange={handleChange}
                                   className="form-control"
                                   type="number"
                                   fullWidth
                                   label="Importe"
                                   style={{textAlign: "right"}}
                                   min="0"
                                   onKeyDown={e => {if (e.code === "Enter"){e.preventDefault();onSubmit()}}}
                                   value={dataProducto.m_cImporte}
                                   name="m_cImporte"
                        />
                    </div>
                    </Grid>
                    <Grid item xs>
                        <IconButton onClick={onSubmit} style={{padding: "0px"}} size="large">
                            <AddBoxIcon style={{fill: "green", fontSize: "xx-large"}}/>
                        </IconButton>
                    </Grid>
                </Grid>
            }

            <div className="row">
                <div className="col-md-12 col-sm-12" style={{padding: "5px"}}>
                    {
                        dataList.length !== 0 &&
                        <table style={{width: "100%"}}>
                            <tr>
                                <th style={{textAlign: "left"}}> Producto</th>
                                {/*{mostrarRangos && <th style={{textAlign: "left"}}> Min</th>}
                                {mostrarRangos && <th style={{textAlign: "left"}}> Max</th>}*/}
                                <th style={{textAlign: "left"}}> Importe</th>
                                {/*<th style={{textAlign: "left"}}> Traslada</th>
                                <th style={{textAlign: "left"}}> Importe IVA</th>
                                <th style={{textAlign: "left"}}> Retiene</th>
                                <th style={{textAlign: "left"}}> Importe Ret</th>*/}
                            </tr>
                            {
                                dataList.map((c, index) => (
                                    <tr onDoubleClick={(e) => handleRowClick(e, index, c)} key={c.m_nIdProducto}>
                                        <td style={{textAlign: "left"}}>{c.m_nIdProducto+'-'+c.m_sDescripcion}</td>
                                        <td style={{textAlign: "left"}}>${parseFloat(c.m_cImporte).toFixed(2)}</td>
                                        {/*{mostrarRangos && <td style={{textAlign: "left"}}>{c.rangoMinimo} Kg</td>}
                                        {mostrarRangos && <td style={{textAlign: "left"}}>{c.rangoMaximo} Kg</td>}
                                        <td style={{textAlign: "left"}}>{state.impuestos.length !== 0 && (state.impuestos.find(i => i.m_nIdImpuesto === parseInt(c.traslada)) ? state.impuestos.find(i => i.m_nIdImpuesto === parseInt(c.traslada)).m_sImpuesto : "No Aplica")}</td>
                                        <td style={{textAlign: "left"}}>${parseFloat(c.importeIVA).toFixed(2)}</td>
                                        <td style={{textAlign: "left"}}>{state.impuestos.length !== 0 && (state.impuestos.find(i => i.m_nIdImpuesto === parseInt(c.retiene)) ? state.impuestos.find(i => i.m_nIdImpuesto === parseInt(c.retiene)).m_sImpuesto : "No Aplica")}</td>
                                        <td style={{textAlign: "left"}}>${parseFloat(c.importeRet).toFixed(2)}</td>*/}
                                        {
                                            !disabled &&
                                            <td>
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        removeConcepto(e, c)
                                                    }}
                                                    size="large">
                                                    <CancelIcon style={{fill: "red", fontSize: "x-large"}}/>
                                                </IconButton>
                                            </td>
                                        }
                                    </tr>
                                ))
                            }
                        </table>
                    }
                </div>
            </div>
            {
                mostrarTotal &&
                <div className="row">
                    <div className="col-md-12 col-sm-12"
                         style={{padding: "5px", backgroundColor: "white", backgroundClip: "content-box"}}>

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
                            }}> ${parseFloat(dataList.reduce((total, arg) => total + parseFloat(arg.m_cImporte), 0)).toFixed(2)}</div>
                        </div>
                        <div className="col-md-12 col-sm-12"
                             style={{alignItems: "right", display: "inline-flex", justifyContent: "flex-end"}}>

                            {/*<div style={{
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
                                <div>{`${state.impuestos.length !== 0 ? state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t)) ? state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t)).m_sImpuesto : "" : ""} `} ${parseFloat(dataList.filter(c => c.traslada === t).reduce((total, arg) => total + parseFloat(arg.importeIVA), 0)).toFixed(2)}<br/>
                                </div>))} {ivaRetiene.map(t => (
                                <div>{`${state.impuestos.length !== 0 ? `${state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t)) ? state.impuestos.find(i => i.m_nIdImpuesto === parseInt(t)).m_sImpuesto : ""}` : ""} `} ${parseFloat(dataList.filter(c => c.retiene === t).reduce((total, arg) => total + parseFloat(arg.importeRet), 0)).toFixed(2)}<br/>
                                </div>))} </div>*/}
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
                            }}>
                                ${parseFloat(dataList.reduce((total, arg) => total + parseFloat(arg.m_cImporte), 0) + dataList.filter(c => ivaTraslada.find(t => t === c.traslada) !== null).reduce((total, arg) => total + parseFloat(arg.importeIVA), 0) - dataList.filter(c => ivaTraslada.find(t => t === c.traslada) !== null).reduce((total, arg) => total + parseFloat(arg.importeRet), 0)).toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
