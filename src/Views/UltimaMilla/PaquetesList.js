import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    TableBody,
    Table,
    TableContainer,
    Paper,
    TableHead,
    TableCell,
    TableRow,
    Checkbox,
    withStyles,
    TableSortLabel, Typography, Grid, TextField
} from "@material-ui/core";
import {obtenerUnidades} from "../../Util/Contexts/UnidadesContext";
import {fade} from "@material-ui/core/styles";
import {obtenerGuia, obtenerGuiasFiltro, obtenerGuiaUltimaMilla} from "../../Util/Contexts/GuiaContext";
import {arrayGuias} from "../../Util/Data";

const useStyles = theme => ({
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    }
});

class PaquetesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paquetes: [],
            order: "asc",
            orderBy: "m_sDescripcion",
        }
        this.getAllPaquetes = this.getAllPaquetes.bind(this)
        this.handleRequestSort = this.handleRequestSort.bind(this)
        this.handleSelectAllClickevent = this.handleSelectAllClickevent.bind(this)
    }

    componentDidMount() {
        this.getAllPaquetes()
    }

    getAllPaquetes() {
        //"0", "0", this.props.data.sucursalSeleccionada.m_nIdSucursal, 4
        obtenerGuiaUltimaMilla(this.props.zonasIds,this.props.tipoServicio).then(({data}) => {
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
        const selectedIndex = this.props.paquetesSeleccionadas.map(u => u.m_nIdGuia).indexOf(row.m_nIdGuia);
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

    render() {
        const {classes} = this.props;
        const isSelected = (row) => this.props.paquetesSeleccionadas.find(u => u.m_nIdGuia === row) != null;


        return (
            <TableContainer className={"j-forms"} style={{height:"300px"}}>
                <Typography variant={"h4"}>Seleccionar Paquetes </Typography>
                <Grid container spacing={2} style={{padding:"10px"}}>
                    <Grid item >
                        <div className="input">
                            <TextField variant="outlined" margin="dense" label="Fecha inicial"
                                       value={this.props.data.startDate}
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       onChange={event => {this.props.changeDate(event.target.name, event.target.value); this.getAllPaquetes()}}
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
                                       onChange={event => {this.props.changeDate(event.target.name, event.target.value); this.getAllPaquetes()}}
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
                                       onChange={event => {this.props.changeDate(event.target.name, event.target.value); this.getAllPaquetes()}}
                                       class="form-control"
                                       type="time"
                            />
                        </div>
                    </Grid>
                    <Grid item >
                        <div className="input">
                            <TextField variant="outlined" margin="dense" label="Hora final"
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       value={this.props.data.finishTime}
                                       name="finishTime"
                                       onChange={event => {this.props.changeDate(event.target.name, event.target.value); this.getAllPaquetes()}}
                                       class="form-control"
                                       type="time"
                            />
                        </div>
                    </Grid>
                </Grid>
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
                                sortDirection={this.state.orderBy === "m_nFolioGuia" ? this.state.order : false}
                                align="left">
                                <TableSortLabel
                                    active={this.state.orderBy === "m_nFolioGuia"}
                                    direction={this.state.orderBy === "m_nFolioGuia" ? this.state.order : 'asc'}
                                    onClick={(event) => this.createSortHandler("m_nFolioGuia", event)}
                                >
                                    Guías
                                    {this.state.orderBy === "m_nFolioGuia" ? (
                                        <span className={classes.visuallyHidden}>
                                            {this.state.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </span>
                                    ) : null}
                                </TableSortLabel>

                            </TableCell>
                            <TableCell
                                sortDirection={this.state.orderBy === "m_sDomicilioDestinatario" ? this.state.order : false}
                                align="left">Volumen</TableCell>
                            <TableCell
                                sortDirection={this.state.orderBy === "m_nIdTIpoCobro" ? this.state.order : false}
                                align="left">Estatus pago</TableCell>
                            <TableCell
                                sortDirection={this.state.orderBy === "m_sNombreDestinatario" ? this.state.order : false}
                                align="left">Destinatario</TableCell>
                            <TableCell
                                sortDirection={this.state.orderBy === "m_sDomicilioDestinatario" ? this.state.order : false}
                                align="left">Destino</TableCell>
                            <TableCell
                                sortDirection={this.state.orderBy === "m_sNombreOperador" ? this.state.order : false}
                                align="left">Ventana de entrega</TableCell>
                            <TableCell sortDirection={this.state.orderBy === "m_sFechaHora" ? this.state.order : false}
                                       align="left">Fecha</TableCell>

                            <TableCell
                                sortDirection={this.state.orderBy === "m_sEstatusGuia" ? this.state.order : false}
                                align="left">Estatus</TableCell>
                            <TableCell align="left"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.stableSort(this.state.paquetes, this.getComparator(this.state.order, this.state.orderBy)).map((u, index) => {
                                const isItemSelected = isSelected(u.m_nIdGuia);
                                console.log(isItemSelected)
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
                                        <TableCell align="left">{u.m_nFolioGuia}</TableCell>
                                        <TableCell align="left">Capacidad</TableCell>
                                        <TableCell align="left">{u.m_nIdTIpoCobro === 3  ?  "Por cobrar destinatario" : u.m_nIdTIpoCobro === 5 ? "Por cobrar remitente" :  u.m_bPagado ? "Pagada" : "Pendiente de pago"}</TableCell>
                                        <TableCell align="left">{u.m_sNombreDestinatario}</TableCell>
                                        <TableCell align="left">{u.m_bEntregarMismoDomicilio ? u.m_sDomicilioDestinatario : u.m_sDomicilioEntrega}</TableCell>
                                        <TableCell align="left">Sin definir</TableCell>
                                        <TableCell align="left">{u.m_sFechaHora}</TableCell>
                                        <TableCell align="left">{u.m_sEstatusGuia}</TableCell>
                                        <TableCell align="left"></TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

PaquetesList.propTypes = {};

export default withStyles(useStyles)(PaquetesList);
