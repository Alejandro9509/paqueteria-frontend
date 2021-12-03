import React, {useEffect, useState} from "react";
import {FormControl, Grid, InputLabel, Select} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import AddBoxIcon from "@material-ui/icons/AddBox";
import EditIcon from '@material-ui/icons/Edit';
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
    const [openDialog, setOpenDialog] = useState(false)
    const [row, setRow] = useState(0)
    const [dataComplemento, setDataComplemento] = useState({
        claveProducto: '',
        claveUnidad: '',
        UnidadSAT: '',
        ProductoSAT: '',
        embalajeSAT:'',
        claveEmbalaje:''
    })
    const [dataSAT, setDataSAT] = useState([])
    const [dataSATUnidades, setDataSATUnidades] = useState([])
    const [dataSATEmbalajes, setDataSATEmbalajes] = useState([])

    function RowMenuCell(props) {
        const { api, id } = props;
        setRow(id);

        const handleDeleteClick = (event) => {
            event.stopPropagation();
            console.log("id==>", id);
            let row = dataPaquetes.filter((p) => p.id == id)[0];
            console.log(row);
            handlePaqueteClick(row);
            // api.updateRows([{ id, _action: 'delete' }]);
        };

        const handleOpenClick = (event) => {
            event.stopPropagation();
            if (dataSAT.length === 0 ) {
                getAllSATServicios()
            }
            if (dataSATUnidades.length === 0 ) {
                getAllSATUnidades()
            }
            if (dataSATEmbalajes.length === 0 ) {
                getAllSATEmbalajes()
            }

            let row = dataPaquetes.filter((p) => p.m_nIdPaquete == id)[0];
            setDataComplemento({
                claveProducto: row.m_nClaveSATProducto||'',
                claveUnidad: row.m_nClaveSATUnidad||'',
                UnidadSAT: row.m_sUnidadSAT||'',
                ProductoSAT: row.m_sProductoSAT||'',
                embalajeSAT: row.m_sEmbalajeSAT||'',
                claveEmbalaje:row.m_sClaveEmbalaje||''
            });
            console.log(row);
            setOpenDialog(true);
        };

        return (
            <div>
                {/*<IconButton
              color="primary"
              size="small"
              aria-label="save"
              onClick={handleOpenClick}
            >
              <SaveIcon fontSize="large" />
            </IconButton>*/}
                <IconButton color="inherit" size="small" aria-label="delete" onClick={handleDeleteClick}>
                    <EditIcon fontSize="large" />
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
            field: 'complementos',
            headerName: 'Complementos',
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
    const [dataEmbalaje, setDataEmbalaje] = React.useState([]);
    const [dataProductos, setDataProductos] = useState([])
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
        agregadoDesde: keys
    })
    const [paquete, setPaquete] = useState({
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
        agregadoDesde: keys
    })
    const [state, setState] = useState({
        impuestos: [],
        ivaTraslada: [],
        ivaRetiene: [],
        tiposCalculo: [],
        columns: []
    })

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

        return true
    }

    const addPaquetev2 = (event) => {
        console.log(concepto)
        let paq = concepto
        if (validarPaquetes(paq)){

            dataPaquetes.push(paq);
            resetPaquete()

            onChangeList(dataPaquetes)
        }else{
            showSuccess("Rellene los campos obligatorios.")
        }
    }

    const removePaquetev2 = (event) => {
        event.preventDefault()
        resetPaquete()

    }

    const handlePaqueteClick = (data) =>{
        if(!disabled){
            onChangeList(dataPaquetes.filter((i) => i.id != data.id))
            /*if (dataProductos.length === 0 ){
                obtenerProductoById(data.m_nIdProducto).then((respuesta) =>{
                    data.producto = respuesta.data
                    data.m_sProducto = respuesta.data.m_sDescripcion
                })
            }else if (data.m_nIdProducto){
                data.producto = dataProductos.find((i) => i.m_nIdProducto == data.m_nIdProducto)
                data.m_sProducto = data.producto.m_sDescripcion
            }*/
            console.log(data)
            setConcepto(data)
        }

    }

    const handleChangePaqueteProductov2 = (event, newValue) => {
        if (newValue){
            setPaquete(paquete =>{
                return{
                    ...paquete,
                    producto: newValue,
                    m_nIdProducto: newValue.m_nIdProducto || 0,
                    m_rLargo: newValue.m_xLargo,
                    m_rAlto: newValue.m_xAlto,
                    m_rAncho: newValue.m_xAncho,
                    m_rPeso: newValue.m_xPeso,
                    m_nIdTipoEmbalaje: newValue.m_nIdEmbalaje,
                    m_sTipoEmbalaje: dataEmbalaje.find((i) => i.m_nIdEmbalaje == newValue.m_nIdEmbalaje).m_sNombre,
                    m_sDescripcion: newValue.m_nIdProducto== 1 ? "" : newValue.m_sDescripcion,
                    m_sProducto: newValue.m_sDescripcion
                }
            })
            setPaquete(paquete =>{
                return{
                    ...paquete,
                    m_rVolumen: paquete.m_rLargo * paquete.m_rAlto * paquete.m_rAncho
                }})
        }else{
            setPaquete(paquete =>{
                return{
                    ...paquete,
                    producto: null,
                    m_nIdProducto:  0,
                }
            })
        }
    };

    const calcularDescuento = (event) => {
        if (event.keyCode == 13){
            calcularImpuestos(concepto.traslada, concepto.retiene, concepto.importe - (concepto.importe * (concepto.descuento/100)))
        }
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

    const handleChangePaquetev2 = (event) => {
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
    };

    const handleChangeComplementoSat = (idComplemento, {m_sClaveSAT,m_sDescripcion}) => {
        debugger
        let index = dataPaquetes.findIndex(d=> d.m_nIdPaquete == row)
        if(index !=-1){

            if (idComplemento === 1){
                setDataComplemento(dataComplemento =>{
                    return {
                        ...dataComplemento,
                        claveProducto: m_sClaveSAT,
                        ProductoSAT: m_sDescripcion,
                    }
                });
                /*dataPaquetes[index].m_nClaveSATProducto = data.m_sClaveSAT;
                dataPaquetes[index].m_sProductoSAT = data.m_sDescripcion;*/
            }else if (idComplemento === 2){
                setDataComplemento(dataComplemento =>{
                    return {
                        ...dataComplemento,
                        claveUnidad: m_sClaveSAT,
                        UnidadSAT: m_sDescripcion,
                    }
                });
                /*dataPaquetes[index].m_nClaveSATUnidad = data.m_sClaveSAT;
                dataPaquetes[index].m_sUnidadSAT = data.m_sDescripcion;*/
            }else if (idComplemento === 3){
                setDataComplemento(dataComplemento =>{
                    return {
                        ...dataComplemento,
                        claveEmbalaje: m_sClaveSAT,
                        embalajeSAT: m_sDescripcion
                    }
                });
                /*dataPaquetes[index].m_sClaveEmbalaje = m_sClaveSAT;
                dataPaquetes[index].m_sEmbalajeSAT = m_sDescripcion;*/
            }
            console.log(dataComplemento)
        }
    }

    const resetPaquete = () =>{
        setConcepto(concepto => {
            return {
                ...concepto,
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
                agregadoDesde: keys
            }
        })
    }

    const handleClickProducto = () => {
        if (dataProductos.length === 0 ){
            getAllProductos()
        }
        if (dataEmbalaje.length === 0 ) {
            getAllEmbalajes()
        }
    }

    const getAllProductos = () => {
        const url = `${process.env.REACT_APP_API_URL}/Productos/GetListado`;
        axios.get(url, {headers}).then(respuesta => {
            setDataProductos(respuesta.data)
        });
    }

    const handleAceptar = (data)=>{
        var index = dataPaquetes.findIndex(d=> d.m_nIdPaquete == row)
        if(index !=-1){
            dataPaquetes[index].m_nClaveSATProducto = dataComplemento.claveProducto;
            dataPaquetes[index].m_sProductoSAT = dataComplemento.ProductoSAT;
            dataPaquetes[index].m_nClaveSATUnidad = dataComplemento.claveUnidad;
            dataPaquetes[index].m_sUnidadSAT = dataComplemento.UnidadSAT;
            dataPaquetes[index].m_sClaveEmbalaje = dataComplemento.claveEmbalaje;
            dataPaquetes[index].m_sEmbalajeSAT = dataComplemento.embalajeSAT;
            console.log(dataPaquetes)
            onChangeList(dataPaquetes)
            showSuccess("Complemento Agregado!")
            dialogVisible(false)
        }


    }

    function dialogVisible(isVisible){
        setOpenDialog(isVisible)

    }

    function getAllEmbalajes() {
        obtenerEmbalajes().then((respuesta) => {
            setDataEmbalaje(respuesta.data);
        });
    }

    function getAllSATServicios() {
        obtenerSATServicios().then((respuesta) => {
            setDataSAT(respuesta.data);
        });
    }

    const getAllSATEmbalajes = () => {
        obtenerSATEmbalajes().then((respuesta) => {
            setDataSATEmbalajes(respuesta.data );
        });
    }

    function  getAllSATUnidades() {
        obtenerSATUnidades().then((respuesta) => {
            setDataSATUnidades(respuesta.data );
        });
    }

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
                    <Grid item xs={2}>
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
                    <Grid item xs={2}>
                        <label className="input select" style={{ width: "100%" }}>
                            <FormControl fullWidth variant="outlined" margin="dense">
                                <InputLabel id="tipoLabel">Medida</InputLabel>
                                <Select
                                    labelId="tipoMedidaLabel"
                                    label="Medida"
                                    className="form-control"
                                    onChange={handleChangePaquetev2}
                                    name="tipoMedida"
                                    value={concepto.tipoMedida}
                                >
                                    <option key={0} value={0}>Selecciona</option>
                                    <option key={1} value={1}>Kg</option>
                                    <option key={2} value={2}>Toneladas</option>
                                    <option key={3} value={3}>Piezas</option>

                                </Select>
                            </FormControl>
                        </label>
                    </Grid>
                    <Grid item xs={2}>
                        <div className="input">
                            <TextField variant="outlined" margin="dense"
                                       onChange={handleChangePaquetev2}
                                       className="form-control"
                                       type="number"
                                       label="Min"
                                       style={{textAlign: "right"}}
                                       value={concepto.rangoMinimo}
                                       name="rangoMinimo"
                            />
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                        <div className="input">
                            <TextField variant="outlined" margin="dense"
                                       onChange={handleChangePaquetev2}
                                       className="form-control"
                                       type="number"
                                       label="Max"
                                       style={{textAlign: "right"}}
                                       value={concepto.rangoMaximo}
                                       name="rangoMaximo"
                            />
                        </div>
                    </Grid>
                    <Grid item xs={2}>
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
                    <Grid item xs={2}>
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
                    <Grid item xs={2}>
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
                    <Grid item xs={2}>
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
                    <Grid item xs={2}>
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

                    <Grid item xs={2}>
                        <label className="input select" style={{width: "100%"}}>
                            <FormControl fullWidth variant="outlined" margin="dense">
                                <InputLabel id="tipoLabel">Tipo Cálculo</InputLabel>
                                <Select
                                    labelId="tipoLabel"
                                    label="Tipo Cálculo"
                                    className="form-control"
                                    onChange={handleChangePaquetev2}
                                    name="tipoCalculo"
                                    value={concepto.tipoCalculo}
                                >
                                    <option key={0} value={0}>Selecciona</option>
                                    {state.tiposCalculo.map((t) =>
                                        (t.m_nIdTarifaTipoCalculo == 3 ? concepto.tipoMedida == 3 &&
                                            <option key={t.m_nIdTarifaTipoCalculo}
                                                    value={t.m_nIdTarifaTipoCalculo}>{t.m_sTarifaTipoCalculo}</option>
                                            : <option key={t.m_nIdTarifaTipoCalculo}
                                                      value={t.m_nIdTarifaTipoCalculo}>{t.m_sTarifaTipoCalculo}</option>))
                                    }
                                </Select>
                            </FormControl>
                        </label>
                    </Grid>

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
                                       helperText={"Presione enter una vez escrito el porcentaje para aplicar el cálculo."}
                                       onKeyDown={calcularDescuento}
                            />
                        </div>
                    </Grid>
                    <Grid item xs>
                        <IconButton onClick={addPaquetev2} style={{ padding: "0px" }}>
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
                            dataPaquetes.reduce((total, arg) => total + parseFloat(arg.importeIVA), 0)+
                            dataPaquetes.reduce((total, arg) => total + parseFloat(arg.importeRet), 0)
                        ).toFixed(2)}</div>
                    </div>
                </div>


            </div>

        </div>
    )
}

export default ConceptosFacturacionGuias;