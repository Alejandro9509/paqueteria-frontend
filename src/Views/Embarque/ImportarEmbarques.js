import React, {Component, useState} from 'react';
import PropTypes from 'prop-types';
import {
    Button, Collapse,
    Dialog,
    DialogContent,
    FormControl,
    Grid,
    Input,
    InputLabel, List, ListItem, ListItemIcon, ListItemText,
    Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField
} from "@material-ui/core";

// import ExpandLess from '@material-ui/icons/ExpandLess';
// import ExpandMore from '@material-ui/icons/ExpandMore';
// import StarBorder from '@material-ui/icons/StarBorder';
// import DialogTableClientes from "../../Components/Clientes/DialogTableClientes";
// import DialogTableRemDes from "../../Components/RemitenteDestinatario/DialogTableRemDes";
// import DialogAgregarProductos from "./DialogAgregarProductos";
// import {obtenerZonaOperativaByIdCodigoPostal} from "../../Util/Contexts/ZonaOperativaContext";
import MenuItem from "@material-ui/core/MenuItem";
// import {obtenerSucursalesActivas} from "../../Util/Contexts/SucursalContext";
// import * as XLSX from "xlsx";
import {importarProductos} from "../../Util/Contexts/ProductosContext";
import {
    getCurrentDateTime,
    getRandomId,
    showError,
    showSuccess,
    getCurrentDate,
    getCurrentTime,
    readExcel, DEFAULT_FORMAT
} from "../../Util/Util";
// import {agregarEmbarquesImportados, importarEmbarquesServicio} from "../../Util/Contexts/EmbarquesContext";
// import {DataGrid} from "@material-ui/data-grid";
// import {dataGridLocaleText} from "../../Constants";
// import IconButton from "@material-ui/core/IconButton";
// import EditIcon from "@material-ui/icons/Edit";
// import {confirmAlert} from "react-confirm-alert";
// import DeleteIcon from "@material-ui/icons/Delete";
import {FilePond} from "react-filepond";
import {descargarPlantillaImportarEmbarque} from "../../Util/Contexts/UtileriasContext";
import {ExpandLess} from "@material-ui/icons";
import ExpandMore from "@material-ui/icons/ExpandMore";
import {DataGrid} from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import {validarEmbarquesImportados} from "../../Util/Contexts/EmbarquesContext";
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';

/*class ImportarEmbarques extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
            dataSucursal: [],
            archivo: [],
            embarques: []
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.importarInformacion = this.importarInformacion.bind(this)
    }


    componentDidMount() {
        obtenerSucursalesActivas().then(({data}) => {
            this.setState({
                dataSucursal: data
            })
        })
    }



    onSubmit(e) {
        e.preventDefault()
        var params = [...this.state.embarques]
        let fechaActual = getCurrentDate().replace("T", " ");
        params = params.map(p => ({...p, fechaRegistro: getCurrentDateTime().replace("T"," ")}))

        if (this.state.fechaEmbarque<fechaActual){
            showError("No se pueden importar embarques con fechas pasadas.")
            return
        }else{
            agregarEmbarquesImportados(params).then(({data}) => {
                showSuccess(data)
                this.props.mostrarListado()
            })
        }
    }

    importarInformacion() {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(this.state.archivo[0]);

            fileReader.onload = (e) => {
                const bufferArray = e.target.result;

                const wb = XLSX.read(bufferArray, {type: "buffer"});

                const wsname = wb.SheetNames[1];
                const ws = (wb.Sheets[wsname]);


                const data = XLSX.utils.sheet_to_json(ws, {range: 1});
                resolve(data);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
        promise.then((d) => {
            let productos = [];
            d.forEach(item => {
                if (item['CINE'] !== undefined) {
                    productos.push(
                        {
                            idCliente: this.state.idCliente,
                            idSucursal: this.state.idSucursal,
                            fecha: getCurrentDateTime().replace("T", " "),
                            destinatario: item['CINE'],
                            codigoProducto: item['ITEMPRODUCT'],
                            cantidad: item['QUANTITY'],
                            horaEntrega: this.state.horaEntrega,
                            fechaEmbarque: this.state.fechaEmbarque
                        }
                    )
                }
            })

            console.log(productos)

            if (productos.length == 0) {
                showError("Los datos introducidos son incorrectos o estan vacíos.");
                return;
            } else {
                importarEmbarquesServicio(productos).then(({data}) => {
                    this.setState({embarques: data.map(d => ({...d, id:getRandomId()}))})
                })
            }
        });
    }

    render() {

        const handleOnChangeCliente = (row) => {
            this.setState({
                idCliente: row.data.m_nIdCliente,
                cliente: row.data.m_sNombreFiscal,
                openDialog: false,
                disabledAgregarProductos: false
            })
        }
        const handleChangeAutoCompleteRemitenteDestinatario = (row) => {
            this.setState({openDialog: false, disabledZonasOperativas: false})

        }

        const handleOnClickCliente = (event) => {
            this.setState({openDialog: true, openDialogToOpen: 'CLIENTES'})
        }

        const handleOnChange = (event) => {

            this.setState({
                [event.target.name]: event.target.value
            })

        }

        const columnsProductos = [

            {
                headerName: "Cantidad",
                field: "cantidad",
                type: 'number',
                valueGetter: ({value}) => value ? `${value}pz` : '',
                flex:1
            },
            {
                headerName: "Producto",
                field: "producto",
                flex: 1,
            },
        ];


        return (
            <section className={"main-container"} style={{marginLeft: "0px", padding: "0px"}}>
                <Dialog
                    open={this.state.openDialog}
                    onClose={() => this.setState({openDialog: false})}
                    fullWidth maxWidth="md"
                >
                    <DialogContent>
                        {this.state.openDialogToOpen === 'CLIENTES' &&
                            <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                                <DialogTableClientes dialogVisible={(value) => this.setState({openDialog: value})}
                                                     handlePatrocinadorSelected={handleOnChangeCliente}/>
                            </div>
                        }
                        {this.state.openDialogToOpen === 'DESTINATARIOS' &&
                            <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                                <DialogTableRemDes
                                    dialogVisible={(value) => this.setState({openDialog: value})}
                                    openDialog={this.state.openDialog}
                                    porCliente={true}
                                    idCliente={this.state.idCliente}
                                    handleChangeAutoCompleteRemitenteDestinatario={handleChangeAutoCompleteRemitenteDestinatario}
                                    agregarEmbarque={true}
                                />
                            </div>
                        }
                    </DialogContent>
                </Dialog>
                <div className={"content-fluid"}>
                    <div className={'row'}>
                        <div className="widget-wrap">
                            <form className="j-forms" onSubmit={this.onSubmit}>
                                <div className="widget-container">
                                    <div className="widget-content">
                                        <h2>Importar Embarques</h2>
                                        <Grid container spacing={1}>
                                            <Grid item xs={3}>
                                                <TextField
                                                    id="FechaEmbarque"
                                                    name="fechaEmbarque"
                                                    label="Fecha de Embarque"
                                                    variant="outlined"
                                                    value={this.state.fechaEmbarque}
                                                    onChange={handleOnChange}
                                                    required={true}
                                                    type="date"
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                        min: {getCurrentDateTime}
                                                    }}
                                                    inputProps={{ max: "2125-12-31"}}/>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField
                                                    id="HoraEmbarque"
                                                    name="horaEntrega"
                                                    label="Hora de Embarque"
                                                    variant="outlined"
                                                    value={this.state.horaEntrega}
                                                    onChange={handleOnChange}
                                                    required={true}
                                                    type="time"
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}/>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField
                                                    variant="outlined"
                                                    label="Cliente"
                                                    required
                                                    value={this.state.cliente ? this.state.cliente : null}
                                                    InputLabelProps={{shrink: true}}
                                                    onClick={handleOnClickCliente}
                                                />
                                            </Grid>

                                            <Grid item xs={3}>
                                                <FormControl
                                                    fullWidth
                                                    variant="outlined"
                                                    margin="dense"

                                                >
                                                    <InputLabel id="IdSucursalLabel">
                                                        Sucursal
                                                    </InputLabel>
                                                    <Select
                                                        label="Sucursal"
                                                        labelId="IdSucursalLabel"
                                                        value={this.state.idSucursal ?? ""}
                                                        id="idSucursal"
                                                        name="idSucursal"
                                                        onChange={handleOnChange}
                                                    >
                                                        {this.state.dataSucursal.map((sucursal) => (
                                                            <MenuItem
                                                                key={sucursal.m_nIdSucursal}
                                                                value={sucursal.m_nIdSucursal}
                                                            >
                                                                {sucursal.m_sSucursal}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <input
                                                    type={"file"}
                                                    required
                                                    accept={"xlsx"}
                                                    onChange={e => this.setState({archivo: e.target.files})}
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Button fullWidth color={"primary"} variant={"contained"}
                                                        onClick={() => this.importarInformacion()}>Importar</Button>
                                            </Grid>
                                            <Grid item xs={12}>
                                                Embarques
                                            </Grid>
                                            <Grid item xs={12}>

                                                <List>
                                                    {
                                                        this.state.embarques.map((e, i) => {
                                                            const open = this.state.embarqueSeleccionado === i
                                                            return (
                                                                <>
                                                                    <ListItem key={i} button
                                                                              onClick={() => this.setState({embarqueSeleccionado: i === this.state.embarqueSeleccionado ? -1 : i})}>
                                                                        <ListItemText primary={"Embarque #" + (i + 1)}/>
                                                                        {open ? <ExpandLess/> : <ExpandMore/>}
                                                                    </ListItem>
                                                                    <Collapse in={open}
                                                                              timeout="auto" unmountOnExit>
                                                                        <List component="div" disablePadding>
                                                                            <ListItem button>
                                                                                <Grid container spacing={1}>
                                                                                    <Grid item xs={6}>
                                                                                        <TextField
                                                                                            variant="outlined"
                                                                                            label="Fecha registro"
                                                                                            required
                                                                                            value={getCurrentDateTime().replace("T"," ")}
                                                                                            InputLabelProps={{shrink: true}}
                                                                                        />
                                                                                    </Grid>
                                                                                    <Grid item xs={6}>
                                                                                        <TextField
                                                                                            variant="outlined"
                                                                                            label="Destinatario"
                                                                                            required
                                                                                            value={e.destinatario}
                                                                                            InputLabelProps={{shrink: true}}
                                                                                        />
                                                                                    </Grid>
                                                                                    <Grid item xs={12}>
                                                                                        <div className="row" style={{
                                                                                            height: `${(e.productos.length * 20) + 80}px`,
                                                                                            width: "100%"
                                                                                        }}>

                                                                                            <DataGrid
                                                                                                localeText={dataGridLocaleText}
                                                                                                density="compact"
                                                                                                pageSize={10}
                                                                                                rowHeight={33}
                                                                                                columns={columnsProductos}
                                                                                                rows={e.productos.map(p => ({...p, id:getRandomId()}))}
                                                                                                getRowId={(row) => row.id}

                                                                                            />
                                                                                        </div>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </ListItem>
                                                                        </List>
                                                                    </Collapse>
                                                                </>
                                                            )
                                                        })
                                                    }
                                                </List>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </div>
                                <div className="row">
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Button type={"submit"} className="btn btn-primary primary-btn">
                                                Aceptar
                                            </Button>
                                            <Button type={"button"} onClick={() => this.props.mostrarListado()}
                                                    className="btn btn-secondary secondary-btn">Cancelar
                                            </Button>
                                        </Grid>

                                    </Grid>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}*/

// ImportarEmbarques.propTypes ={};

function ImportarEmbarquesV2(props) {
    const [files, setFiles] = useState([])
    const [state, setState] = useState({
        fechaEmbarque: getCurrentDate(),
        horaEntrega: getCurrentTime(),
        dialogVisible: false,
        dataSucursal: [],
        archivo: [],
        embarques: []
    })

    const handleOnChange = (event) => {

        setState({
            ...state,
            [event.target.name]: event.target.value
        })

    }

    const handleOnupdatefiles = (newFiles) => {
        setFiles(newFiles)
    }

    const handleOnDescargarPlantillaClick = () => {
        descargarPlantillaImportarEmbarque().then(response => {
            // create file link in browser's memory
            let file = new Blob([response.data],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
            const href = URL.createObjectURL(file);

            // create "a" HTML element with href to file & click
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', 'plantillaImportarEmbarques.xlsx'); //or any other extension
            document.body.appendChild(link);
            link.click();

            // clean up "a" element & remove ObjectURL
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        })
    }

    const handleOnImportarClick = () => {
        if (files.length === 0){
            return
        }
        readExcel(DEFAULT_FORMAT,files[0].file).then((resultado)=>{
            let params = {
                embarques: resultado
            }
            console.log(resultado)
            console.log(params)
            // showMessage("Subiendo...",3000,"success")
            /*agregarGuiasImportadas(resultado).then((r)=>{
                showMessage("Guias creadas exitosamente",3000,"success")
            })*/
            validarEmbarquesImportados(params).then(respuesta => {
                console.log(respuesta.data)
                setState({
                    ...state,
                    embarques: respuesta.data
                })
            }).catch((error)=>{
                // showMessage(err,2000,"warning")
                console.log('error al validar: ' + error)
            })
        }).catch((err)=>{
            // showMessage(err,2000,"warning")
            console.log('error al importar' + err)
        })
    }

    return(
        <section className={"main-container"} style={{marginLeft: "0px", padding: "0px"}}>
            {/*<Dialog
                open={this.state.openDialog}
                onClose={() => this.setState({openDialog: false})}
                fullWidth maxWidth="md"
            >
                <DialogContent>
                    {this.state.openDialogToOpen === 'CLIENTES' &&
                        <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                            <DialogTableClientes dialogVisible={(value) => this.setState({openDialog: value})}
                                                 handlePatrocinadorSelected={handleOnChangeCliente}/>
                        </div>
                    }
                    {this.state.openDialogToOpen === 'DESTINATARIOS' &&
                        <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                            <DialogTableRemDes
                                dialogVisible={(value) => this.setState({openDialog: value})}
                                openDialog={this.state.openDialog}
                                porCliente={true}
                                idCliente={this.state.idCliente}
                                handleChangeAutoCompleteRemitenteDestinatario={handleChangeAutoCompleteRemitenteDestinatario}
                                agregarEmbarque={true}
                            />
                        </div>
                    }
                </DialogContent>
            </Dialog>*/}
            <div className={"content-fluid"}>
                <div className={'row'}>
                    <div className="widget-wrap">
                        <form className="j-forms" >
                            <div className="widget-container">
                                <div className="widget-content">
                                    <h2>Importar Embarques</h2>
                                    <Grid container spacing={1}>
                                        {/*<Grid item xs={3}>
                                            <TextField
                                                id="FechaEmbarque"
                                                name="fechaEmbarque"
                                                label="Fecha de Embarque"
                                                variant="outlined"
                                                value={state.fechaEmbarque}
                                                onChange={handleOnChange}
                                                required={true}
                                                type="date"
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true,
                                                    min: {getCurrentDateTime}
                                                }}
                                                inputProps={{ max: "2125-12-31"}}/>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                id="HoraEmbarque"
                                                name="horaEntrega"
                                                label="Hora de Embarque"
                                                variant="outlined"
                                                value={state.horaEntrega}
                                                onChange={handleOnChange}
                                                required={true}
                                                type="time"
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}/>
                                        </Grid>*/}
                                        {/*<Grid item xs={3}>
                                            <TextField
                                                variant="outlined"
                                                label="Cliente"
                                                required
                                                // value={this.state.cliente ? this.state.cliente : null}
                                                InputLabelProps={{shrink: true}}
                                                // onClick={handleOnClickCliente}
                                            />
                                        </Grid>*/}

                                        {/*<Grid item xs={3}>
                                            <TextField
                                                select
                                                label="Sucursal"
                                                labelId="IdSucursalLabel"
                                                value={state.idSucursal ?? ""}
                                                id="idSucursal"
                                                name="idSucursal"
                                                fullWidth
                                                variant="outlined"
                                                margin="dense"
                                                // onChange={handleOnChange}
                                            >
                                                {state.dataSucursal.map((sucursal) => (
                                                    <MenuItem
                                                        key={sucursal.m_nIdSucursal}
                                                        value={sucursal.m_nIdSucursal}
                                                    >
                                                        {sucursal.m_sSucursal}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>*/}
                                        <Grid item xs={3}>
                                            <FilePond
                                                files={files}
                                                onupdatefiles={(files) => handleOnupdatefiles(files)}
                                                labelIdle='Haz click aquí para seleccionar un documento'
                                            />
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Button fullWidth
                                                    color={"primary"}
                                                    variant={"contained"}
                                                    onClick={() => handleOnImportarClick()}
                                            >Importar</Button>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Button fullWidth
                                                    color={"primary"}
                                                    variant={"contained"}
                                                    onClick={() => handleOnDescargarPlantillaClick()}
                                            >Descargar plantilla</Button>
                                        </Grid>
                                        <Grid item xs={12}>Embarques</Grid>
                                        <Grid item xs={12}>

                                            <List>
                                                {
                                                    state.embarques.map((e, i) => {
                                                        const open = state.embarqueSeleccionado === i
                                                        return (
                                                            <>
                                                                <ListItem key={i} button
                                                                          onClick={() => setState({...state, embarqueSeleccionado: i === state.embarqueSeleccionado ? -1 : i})}>
                                                                    <ListItemText primary={"Embarque #" + (e.numeroEmbarque)}/>
                                                                    {!e.success && <InfoRoundedIcon color={"error"} fontSize={"large"}/> }
                                                                    {open ? <ExpandLess/> : <ExpandMore/>}
                                                                </ListItem>
                                                                <Collapse in={open}
                                                                          timeout="auto" unmountOnExit>
                                                                    <List component="div" disablePadding>
                                                                        <ListItem button>
                                                                            {/*<Grid container spacing={1}>
                                                                                <Grid item xs={6}>
                                                                                    <TextField
                                                                                        variant="outlined"
                                                                                        label="Fecha registro"
                                                                                        required
                                                                                        value={getCurrentDateTime().replace("T"," ")}
                                                                                        InputLabelProps={{shrink: true}}
                                                                                    />
                                                                                </Grid>
                                                                                <Grid item xs={6}>
                                                                                    <TextField
                                                                                        variant="outlined"
                                                                                        label="Destinatario"
                                                                                        required
                                                                                        value={e.nombreDestinatario}
                                                                                        InputLabelProps={{shrink: true}}
                                                                                    />
                                                                                </Grid>
                                                                                <Grid item xs={12}>
                                                                                    <div className="row" style={{
                                                                                        height: `${(e.productos.length * 20) + 80}px`,
                                                                                        width: "100%"
                                                                                    }}>

                                                                                        <DataGrid
                                                                                            localeText={dataGridLocaleText}
                                                                                            density="compact"
                                                                                            pageSize={10}
                                                                                            rowHeight={33}
                                                                                            columns={columnsProductos}
                                                                                            rows={e.productos.map(p => ({...p, id:getRandomId()}))}
                                                                                            getRowId={(row) => row.id}

                                                                                        />
                                                                                    </div>
                                                                                </Grid>
                                                                            </Grid>*/}
                                                                            {
                                                                                e.success ?
                                                                                <>


                                                                                    <Grid container>
                                                                                        <Grid item xs={6}>
                                                                                            Cliente: {e.data.cliente}<br/>
                                                                                            Tipo de seguro: {e.data.tipoSeguro}<br/>
                                                                                            % de seguro: {e.data.porcentajeSeguro}<br/>
                                                                                            Valor declarado: {e.data.valorDeclarado}<br/>
                                                                                            Validar timbrado de factura: {e.data.validarTimbradoFactura?"Sí":"No"}<br/>
                                                                                            Observaciones: {e.data.observaciones}<br/><br/>
                                                                                        </Grid>
                                                                                        <Grid item xs={6}>
                                                                                            Entrega en sucursal: {e.data.entregaEnSucursal?"Sí":"No"}<br/>
                                                                                            Entrega en diferente domicilio: {e.data.entregaDiferenteDomicilio?"Sí":"No"}<br/>
                                                                                            Latitud: {e.data.latitud}<br/>
                                                                                            Longitud: {e.data.longitud}<br/>
                                                                                            Entrega con cita: {e.data.conCita?"Sí":"No"}<br/>
                                                                                            Ruta: {e.data.ruta}
                                                                                        </Grid>
                                                                                        <Grid item xs={6}>
                                                                                            Remitente: {e.data.nombreRemitente}<br/>
                                                                                            Código Postal: {e.data.codigoPostalRemitente}<br/>
                                                                                            Correo: {e.data.correoRemitente}<br/>
                                                                                            Origen: {e.data.origen}<br/>
                                                                                        </Grid>
                                                                                        <Grid item xs={6}>
                                                                                            Destinatario: {e.data.nombreDestinatario}<br/>
                                                                                            Código Postal: {e.data.codigoPostalRemitente}<br/>
                                                                                            Correo: {e.data.correoRemitente}<br/>
                                                                                            Destino: {e.data.destino}<br/>
                                                                                            Zona operativa: {e.data.zonaDestinatario}<br/>
                                                                                        </Grid>
                                                                                        <Grid item xs={12} sm={8}>
                                                                                            <TableContainer style={{
                                                                                                height: "100%",
                                                                                                padding: "0px",
                                                                                                paddingRight: "0px"
                                                                                            }}>
                                                                                                <Table size="small">
                                                                                                    <TableHead>
                                                                                                        <TableRow>
                                                                                                            <TableCell
                                                                                                                style={{borderBottom: "none",fontWeight: "bold"}}
                                                                                                                align="left">
                                                                                                                Cantidad
                                                                                                            </TableCell>
                                                                                                            <TableCell
                                                                                                                style={{borderBottom: "none",fontWeight: "bold"}}
                                                                                                                align="left">Descripcion</TableCell>
                                                                                                            <TableCell
                                                                                                                style={{borderBottom: "none",fontWeight: "bold"}}
                                                                                                                align="left">Embalaje</TableCell>
                                                                                                            <TableCell
                                                                                                                style={{borderBottom: "none",fontWeight: "bold"}}
                                                                                                                align="left">Largo</TableCell>
                                                                                                            <TableCell
                                                                                                                style={{borderBottom: "none",fontWeight: "bold"}}
                                                                                                                align="left">Alto</TableCell>
                                                                                                            <TableCell
                                                                                                                style={{borderBottom: "none",fontWeight: "bold"}}
                                                                                                                align="left">Ancho</TableCell>
                                                                                                        </TableRow>
                                                                                                    </TableHead>
                                                                                                    <TableBody>
                                                                                                        {
                                                                                                            e.data.paquetes.map((item, index) => (
                                                                                                                <TableRow key={index}>
                                                                                                                    <TableCell
                                                                                                                        style={{borderBottom: "none"}}
                                                                                                                        align="left">
                                                                                                                        {item.cantidad}
                                                                                                                    </TableCell>
                                                                                                                    <TableCell
                                                                                                                        style={{borderBottom: "none"}}
                                                                                                                        align="left">
                                                                                                                        {item.descripcion}
                                                                                                                    </TableCell>
                                                                                                                    <TableCell
                                                                                                                        style={{borderBottom: "none"}}
                                                                                                                        align="left">
                                                                                                                        {item.embalaje}
                                                                                                                    </TableCell>
                                                                                                                    <TableCell
                                                                                                                        style={{borderBottom: "none"}}
                                                                                                                        align="left">
                                                                                                                        {item.largo}
                                                                                                                    </TableCell>
                                                                                                                    <TableCell
                                                                                                                        style={{borderBottom: "none"}}
                                                                                                                        align="left">
                                                                                                                        {item.alto}
                                                                                                                    </TableCell>
                                                                                                                    <TableCell
                                                                                                                        style={{borderBottom: "none"}}
                                                                                                                        align="left">
                                                                                                                        {item.ancho}
                                                                                                                    </TableCell>
                                                                                                                </TableRow>
                                                                                                            ))
                                                                                                        }
                                                                                                    </TableBody>
                                                                                                </Table>

                                                                                            </TableContainer>
                                                                                        </Grid>
                                                                                    </Grid>



                                                                                </>
                                                                                    :
                                                                                    <>
                                                                                        {e.message}
                                                                                    </>
                                                                            }

                                                                        </ListItem>
                                                                    </List>
                                                                </Collapse>
                                                            </>
                                                        )
                                                    })
                                                }
                                            </List>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                            <div className="row">
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Button type={"submit"} className="btn btn-primary primary-btn">
                                            Aceptar
                                        </Button>
                                        <Button type={"button"} onClick={() => {console.log('cancelar')}}
                                                className="btn btn-secondary secondary-btn">Cancelar
                                        </Button>
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
export default ImportarEmbarquesV2;
