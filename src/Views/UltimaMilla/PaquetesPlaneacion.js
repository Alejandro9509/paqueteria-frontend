import React, {Component} from 'react';
import {obtenerGuiaUltimaMilla} from "../../Util/Contexts/GuiaContext";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    Radio,
    RadioGroup,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Typography
} from "@mui/material";
import {
    obtenerPaquetesInforme,
    obtenerPaquetesUnidadOperador,
    obtenerPaquetesViaje
} from "../../Util/Contexts/UltimaMillaContext";

class PaquetesPlaneacion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paquetes: [],
            tipoBusqueda: "3",
            order: "asc",
            idInforme: 0,
            dataInformes: [],
            dataOperadores: [],
            dataUnidades: [],
            orderBy: "m_sDescripcion",
            dataViajes: [],
            idOperador: "0",
            idUnidad: "0"
        }
        this.getAllPaquetes = this.getAllPaquetes.bind(this)
        this.handleInforme = this.handleInforme.bind(this)
        this.handleViaje = this.handleViaje.bind(this)
        this.handleUnidadOperador = this.handleUnidadOperador.bind(this)
        this.handleRequestSort = this.handleRequestSort.bind(this)
        this.handleSelectAllClickevent = this.handleSelectAllClickevent.bind(this)
    }

    componentDidMount() {
        /*obtenerInformesEstatus(7).then(({data}) => {
            this.setState({
                dataInformes: data
            })
        })
        obtenerViajesEstatus(5).then(({data}) => {
            this.setState({
                dataViajes: data
            })
        })
        obtenerUnidades().then(({data}) => {
            this.setState({dataUnidades: data})
        })
        obtenerOperadores().then(({data}) => {
            this.setState({dataOperadores: data})
        })*/
        // this.getAllPaquetes()
    }

    getAllPaquetes() {
        //"0", "0", this.props.data.sucursalSeleccionada.m_nIdSucursal, 4
        obtenerGuiaUltimaMilla(this.props.zonasIds, this.props.tipoServicio).then(({data}) => {
            this.setState({paquetes: data})
        })
    }

    descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => this.descendingComparator(a, b, orderBy)
            : (a, b) => -this.descendingComparator(a, b, orderBy);
    }

    stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    handleRequestSort(event, property) {
        const isAsc = this.state.orderBy === property && this.state.order === 'asc';
        this.setState({
            order: isAsc ? 'desc' : 'asc', orderBy: property
        })
    };

    createSortHandler(property, event) {
        this.handleRequestSort(event, property);
    };

    handleSelectAllClickevent(event) {
        if (event.target.checked) {
            const newSelecteds = this.state.paquetes;
            this.props.selectPaquetes(newSelecteds)
            return;
        }
        this.props.selectPaquetes([])
    };

    handleClick(event, row) {
        const selectedIndex = this.props.paquetesSeleccionadas.map(u => u.m_nId).indexOf(row.m_nId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(this.props.paquetesSeleccionadas, row);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(this.props.paquetesSeleccionadas.slice(1));
        } else if (selectedIndex === this.props.paquetesSeleccionadas.length - 1) {
            newSelected = newSelected.concat(this.props.paquetesSeleccionadas.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                this.props.paquetesSeleccionadas.slice(0, selectedIndex),
                this.props.paquetesSeleccionadas.slice(selectedIndex + 1),
            );
        }
        this.props.selectPaquetes(newSelected)
    };

    handleInforme(value){
        obtenerPaquetesInforme(value, this.props.zonasIds).then(({data}) => {
            this.setState({paquetes: data, idInforme: value})
        })
    }

    handleViaje(value){
        obtenerPaquetesViaje(value, this.props.zonasIds).then(({data}) => {
            this.setState({paquetes: data, idViaje: value})
        })
    }

    handleUnidadOperador(idUnidad, idOperador){
        obtenerPaquetesUnidadOperador(idUnidad, idOperador, this.props.zonasIds).then(({data}) => {
            this.setState({paquetes: data, idOperador: idOperador, idUnidad: idUnidad})
        })
    }

    render() {
        const {classes} = this.props;
        const isSelected = (row) => this.props.paquetesSeleccionadas.find(u => u.m_nId === row) !== null;

        return (
            <Dialog open={this.props.open} fullWidth maxWidth={"lg"} onClose={this.props.close}>
                <TableContainer className={"j-forms"} style={{height: "400px", padding: "15px"}}>
                    <Typography variant={"h3"}>Seleccionar Paquetes </Typography>
                    {/*<Grid container spacing={2} style={{padding: "10px"}}>
                        <Grid item>
                            <div className="input">
                                <TextField variant="outlined" margin="dense" label="Fecha inicial"
                                           value={this.props.data.startDate}
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           onChange={event => {
                                               this.props.changeDate(event.target.name, event.target.value);
                                               this.getAllPaquetes()
                                           }}
                                           name="startDate"
                                           class="form-control"
                                           type="date"
                                />
                            </div>
                        </Grid>
                        <Grid item>
                            <div className="input">
                                <TextField variant="outlined" margin="dense" label="Fecha final"
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           value={this.props.data.finishDate}
                                           onChange={event => {
                                               this.props.changeDate(event.target.name, event.target.value);
                                               this.getAllPaquetes()
                                           }}
                                           name="finishDate"
                                           class="form-control"
                                           type="date"
                                />
                            </div>
                        </Grid>
                        <Grid item>
                            <div className="input">
                                <TextField variant="outlined" margin="dense" label="Hora inicial"
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           value={this.props.data.startTime}
                                           name="startTime"
                                           onChange={event => {
                                               this.props.changeDate(event.target.name, event.target.value);
                                               this.getAllPaquetes()
                                           }}
                                           class="form-control"
                                           type="time"
                                />
                            </div>
                        </Grid>
                        <Grid item>
                            <div className="input">
                                <TextField variant="outlined" margin="dense" label="Hora final"
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           value={this.props.data.finishTime}
                                           name="finishTime"
                                           onChange={event => {
                                               this.props.changeDate(event.target.name, event.target.value);
                                               this.getAllPaquetes()
                                           }}
                                           class="form-control"
                                           type="time"
                                />
                            </div>
                        </Grid>
                    </Grid>*/}
                    <Grid container spacing={2} style={{padding: "10px"}} alignItems={"center"}>
                        <Typography variant={"h4"}>Buscar por: </Typography>
                        <FormControl component="fieldset" style={{paddingLeft: "5px"}}>
                            <RadioGroup row aria-label="type-search" name="row-radio-buttons-group"
                                        value={this.state.tipoBusqueda}
                                        onChange={e => this.setState({tipoBusqueda: e.target.value})} defaultValue="3">
                                <FormControlLabel value="1" labelPlacement="start" control={<Radio/>} label="Informe"/>
                                <FormControlLabel value="2" labelPlacement="start" control={<Radio/>} label="Viaje"/>
                                <FormControlLabel value="3" labelPlacement="start" control={<Radio/>}
                                                  label="Unidad/Operador"/>
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    {
                        this.state.tipoBusqueda === "1" &&
                        <Grid container spacing={2} style={{padding: "10px"}} alignItems={"center"}>
                            <Grid item sm={12} md={6}>
                                <label className="label">
                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel id="idEmbarqueLabel">Folio Informe</InputLabel>
                                        <Select
                                            native
                                            labelId="idEmbarqueLabel"
                                            label="Folio Informe"
                                            className="form-control"
                                            required
                                            onChange={event => (this.handleInforme(event.target.value))}
                                            id="idEmbarque"
                                            read="true"
                                            value={this.state.idInforme}>
                                            <option value="0">
                                                Seleccionar
                                            </option>
                                            {this.state.dataInformes.map(
                                                (embarque) => (
                                                    <option key={embarque.m_nIdInforme}
                                                            value={embarque.m_nIdInforme}>
                                                        {
                                                            embarque.m_sFolioInforme
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </Select>
                                    </FormControl>
                                </label>
                            </Grid>
                        </Grid>
                    }
                    {
                        this.state.tipoBusqueda === "2" &&
                        <Grid container spacing={2} style={{padding: "10px"}} alignItems={"center"}>
                            <Grid item sm={12} md={6}>
                                <label className="label">
                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel id="idEmbarqueLabel">Folio Viaje</InputLabel>
                                        <Select
                                            native
                                            labelId="idEmbarqueLabel"
                                            label="Folio Viaje"
                                            className="form-control"
                                            required
                                            onChange={event => (this.handleViaje(event.target.value))}
                                            id="idViaje"
                                            read="true"
                                            value={this.state.idViaje}
                                        >
                                            <option value="0">
                                                Seleccionar
                                            </option>
                                            {this.state.dataViajes.map(
                                                (embarque) => (
                                                    <option key={embarque.m_nIdViaje}
                                                            value={embarque.m_nIdViaje}>
                                                        {
                                                            embarque.m_sFolioViaje
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </Select>
                                    </FormControl>
                                </label>
                            </Grid>
                        </Grid>
                    }
                    {
                        this.state.tipoBusqueda === "3" &&
                        <Grid container spacing={2} style={{padding: "10px"}} alignItems={"center"}>
                            <Grid item sm={12} md={6}>
                                <label className="label">
                                    <FormControl fullWidth variant="outlined"
                                                 margin="dense">
                                        <InputLabel id="idEmbarqueLabel">Operador</InputLabel>
                                        <Select
                                            native
                                            labelId="idEmbarqueLabel"
                                            label="Operador"
                                            className="form-control"
                                            required
                                            onChange={event => (this.handleUnidadOperador(this.state.idUnidad, event.target.value  ))}
                                            id="idViaje"
                                            read="true"
                                            value={this.state.idOperador}
                                        >
                                            <option value="0">
                                                Seleccionar
                                            </option>
                                            {this.state.dataOperadores.map(
                                                (embarque) => (
                                                    <option key={embarque.m_nIdOperador}
                                                            value={embarque.m_nIdOperador}>
                                                        {
                                                            embarque.m_sNombreCompleto
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </Select>
                                    </FormControl>
                                </label>
                            </Grid>
                            <Grid item sm={12} md={6}>
                                <label className="label">
                                    <FormControl fullWidth variant="outlined"
                                                 margin="dense">
                                        <InputLabel id="idUnidadLabel">Unidad</InputLabel>
                                        <Select
                                            native
                                            labelId="idUnidadLabel"
                                            label="Unidad"
                                            className="form-control"
                                            required
                                            onChange={event => (this.handleUnidadOperador(event.target.value,  this.state.idOperador))}
                                            id="idUnidad"
                                            read="true"
                                            value={this.state.idUnidad}
                                        >
                                            <option value="0">
                                                Seleccionar
                                            </option>
                                            {this.state.dataUnidades.map(
                                                (embarque) => (
                                                    <option key={embarque.m_nIdUnidad}
                                                            value={embarque.m_nIdUnidad}>
                                                        {
                                                            embarque.m_sCodigo + " " + embarque.m_sDescripcion
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </Select>
                                    </FormControl>
                                </label>
                            </Grid>
                        </Grid>
                    }
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={this.props.paquetesSeleccionadas.length > 0 && this.props.paquetesSeleccionadas.length < this.state.paquetes.length}
                                        checked={this.state.paquetes.length > 0 && this.props.paquetesSeleccionadas.length === this.state.paquetes.length}
                                        onChange={this.handleSelectAllClickevent}
                                        inputProps={{'aria-label': 'select all desserts'}}
                                    />
                                </TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_sFolio" ? this.state.order : false}
                                    align="left">
                                    <TableSortLabel
                                        active={this.state.orderBy === "m_sFolio"}
                                        direction={this.state.orderBy === "m_sFolio" ? this.state.order : 'asc'}
                                        onClick={(event) => this.createSortHandler("m_sFolio", event)}
                                    >
                                        Folio
                                        {this.state.orderBy === "m_sFolio" ? (
                                            <span className={classes.visuallyHidden}>
                                            {this.state.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </span>
                                        ) : null}
                                    </TableSortLabel>

                                </TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_sDomicilioDestinatario" ? this.state.order : false}
                                    align="left">
                                    Tipo
                                </TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_sDomicilioDestinatario" ? this.state.order : false}
                                    align="left">
                                    Volumen
                                </TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_sTipoCobro" ? this.state.order : false}
                                    align="left">
                                    Tipo de cobro
                                </TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_sTipoCobro" ? this.state.order : false}
                                    align="left">
                                    Zona
                                </TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_sTipoCobro" ? this.state.order : false}
                                    align="left">
                                    Cliente
                                </TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_bClienteBloqueado" ? this.state.order : false}
                                    align="left">
                                    Estatus cliente
                                </TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_sNombreDestinatario" ? this.state.order : false}
                                    align="left">
                                    Domicilio
                                </TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_sNombreDestinatario" ? this.state.order : false}
                                    align="left">
                                    Flete
                                </TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_sNombreOperador" ? this.state.order : false}
                                    align="left">
                                    Ventana de entrega
                                </TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_dFechaRegistro" ? this.state.order : false}
                                    align="left">
                                    Fecha
                                </TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_sEstatusGuia" ? this.state.order : false}
                                    align="left">
                                    Estatus
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.stableSort(this.state.paquetes, this.getComparator(this.state.order, this.state.orderBy)).map((u, index) => {
                                    const isItemSelected = isSelected(u.m_nId);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    onClick={(event) => this.handleClick(event, u)}
                                                    checked={isItemSelected}
                                                    inputProps={{'aria-labelledby': labelId}}
                                                />
                                            </TableCell>
                                            <TableCell align="left">
                                                {u.m_sFolio}
                                            </TableCell>
                                            <TableCell align="left">
                                                {u.m_bEsRecoleccion ? "Recolección" : "Entrega"}
                                            </TableCell>
                                            <TableCell align="left">
                                                {u.m_bEsRecoleccion ? u.m_parrPaquetes.reduce((a, b) => +a + +b.m_rVolumen, 0) : u.m_arrPaquetes.reduce((a, b) => +a + +b.m_xVolumen, 0)}
                                            </TableCell>
                                            <TableCell align="left">
                                                {u.m_sTipoCobro}
                                            </TableCell>
                                            <TableCell align="left">
                                                {u.m_sZona}
                                            </TableCell>
                                            <TableCell style={{color: u.m_bClienteBloqueado ? "red": "black"}} align="left">
                                                {u.m_bClienteBloqueado ? "Bloqueado" : "Activo"}
                                            </TableCell>
                                            <TableCell align="left">
                                                {u.m_bEsRecoleccion ? u.m_sNombreRemitente : u.m_sNombreDestinatario}
                                            </TableCell>
                                            <TableCell align="left">
                                                {u.m_bEsRecoleccion ? u.m_sDomicilioRemitente : u.m_sDomicilioDestinatario}
                                            </TableCell>
                                            <TableCell align="left">
                                                {u.m_bEsRecoleccion ? "N/A" : u.m_nImporteFlete}</TableCell>
                                            <TableCell align="left">
                                                {u.m_bEsRecoleccion ? (u.m_bRecoleccionConCita ? "" : "Sin cita") : ""}
                                            </TableCell>
                                            <TableCell align="left">
                                                {u.m_dFechaRegistro}
                                            </TableCell>
                                            <TableCell align="left">
                                                {u.m_bEsRecoleccion ? u.m_sEstatusRecoleccion : u.m_sEstatusEmbarque}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>

                <DialogActions>
                    <Button color={"primary"} variant={"contained"} onClick={() => this.props.close()}>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

PaquetesPlaneacion.propTypes = {};

export default PaquetesPlaneacion;
