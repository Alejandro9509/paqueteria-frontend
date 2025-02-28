import React, {Component} from 'react';
import {
    TableBody,
    Table,
    TableContainer,
    TableHead,
    TableCell,
    TableRow,
    Checkbox,
    TableSortLabel,
    Typography,
    TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {obtenerGuiaUltimaMilla} from "../../Util/Contexts/GuiaContext";
import {withStyles} from "@mui/styles";

const PREFIX = 'PaquetesList';

const classes = {
    visuallyHidden: `${PREFIX}-visuallyHidden`
};

const Root = styled('div')(({theme}) => ({
    [`& .${classes.visuallyHidden}`]: {
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
}));

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
            filtro: ''
        }
        this.getAllPaquetes = this.getAllPaquetes.bind(this)
        this.handleRequestSort = this.handleRequestSort.bind(this)
        this.handleSelectAllClickevent = this.handleSelectAllClickevent.bind(this)
        this.handleChangeFiltro = this.handleChangeFiltro.bind(this)
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
        if (event.target.checked && this.state.paquetes.filter(f => !f.m_bClienteBloqueado).length !== this.props.paquetesSeleccionadas.length) {
            const newSelecteds = this.state.paquetes.filter(f => !f.m_bClienteBloqueado);
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

    handleChangeFiltro = (event) => {
        this.setState({
            filtro: event.target.value
        });
    };

    render() {
        const {classes} = this.props;
        const isSelected = (row, esRecoleccion) => this.props.paquetesSeleccionadas.find(u => u.m_nId === row && u.m_bEsRecoleccion === esRecoleccion) != null;
        const datosFiltrados = this.stableSort(this.state.paquetes, this.getComparator(this.state.order, this.state.orderBy)).filter((objeto) => {
            return (objeto.m_sFolio).toLowerCase().includes(this.state.filtro.toLowerCase());
        });

        return (
            <Root>
                <br/>
                <TextField label="Filtrar por folio" value={this.state.filtro} onChange={this.handleChangeFiltro}
                           variant="outlined" margin={"dense"}/>
                <br/>
                <br/>
                <TableContainer className={"j-forms"} style={{height:"300px"}}>
                    <Typography variant={"h4"}>Seleccionar Paquetes </Typography>
                    {/*<Grid container spacing={2} style={{padding:"10px"}}>
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
                </Grid>*/}
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
                                <TableCell sortDirection={this.state.orderBy === "m_sFolio" ? this.state.order : false}
                                    align="left">
                                    <TableSortLabel
                                        active={this.state.orderBy === "m_sFolio"}
                                        direction={this.state.orderBy === "m_sFolio" ? this.state.order : 'asc'}
                                        onClick={(event) => this.createSortHandler("m_sFolio", event)}>
                                        Folio
                                        {
                                            this.state.orderBy === "m_sFolio" ? (
                                                    <span className={classes.visuallyHidden}>
                                                        {this.state.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </span>
                                            ) : null
                                        }
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_sDomicilioDestinatario" ? this.state.order : false}
                                    align="left">Tipo
                                </TableCell>
                                {/*<TableCell
                                sortDirection={this.state.orderBy === "m_sDomicilioDestinatario" ? this.state.order : false}
                                align="left">Volumen</TableCell>*/}

                                <TableCell
                                    sortDirection={this.state.orderBy === "m_sTipoCobro" ? this.state.order : false}
                                    align="left">
                                    Tipo de cobro
                                </TableCell>
                                <TableCell
                                    sortDirection={this.state.orderBy === "m_sZona" ? this.state.order : false}
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
                                datosFiltrados.map((u, index) => {
                                    const isItemSelected = isSelected(u.m_nId, u.m_bEsRecoleccion);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    disabled={u.m_bClienteBloqueado}
                                                    onClick={(event) => this.handleClick(event, u)}
                                                    checked={isItemSelected}
                                                    inputProps={{'aria-labelledby': labelId}}
                                                />
                                            </TableCell>
                                            <TableCell align="left">{u.m_sFolio}</TableCell>
                                            <TableCell align="left">{u.m_bEsRecoleccion ? "Recolección" : "Entrega"}</TableCell>
                                            {/*
                                        <TableCell align="left">{u.m_bEsRecoleccion ? u.m_parrPaquetes.reduce((a, b) => +a + +b.m_rVolumen, 0) : u.m_arrPaquetes.reduce((a, b) => +a + +b.m_xVolumen, 0)}</TableCell>
*/}
                                            <TableCell align="left">{u.m_sTipoCobro}</TableCell>
                                            <TableCell align="left">{u.m_sZona}</TableCell>
                                            <TableCell align="left">{u.m_bEsRecoleccion ? u.m_sNombreRemitente : u.m_sNombreDestinatario}</TableCell>
                                            <TableCell style={{color: u.m_bClienteBloqueado ? "red": "black"}}
                                                       align="left">{u.m_bClienteBloqueado ? "Bloqueado" : "Activo"}</TableCell>
                                            <TableCell align="left">{u.m_bEsRecoleccion ? u.m_sDomicilioRemitente: u.m_sDomicilioDestinatario}</TableCell>
                                            <TableCell align="left">{u.m_bEsRecoleccion ? (u.m_bRecoleccionConCita ? (u.m_bCitaPendiente ? "Cita pendiente" : (u.m_sFechaRecoleccionCita + " " + u.m_sHoraCitarRecoleccionMinima + " a " + u.m_sHoraCitaRecoleccionMaxima)) : "Sin cita") : u.m_bEmbarqueConCita ? u.m_bCitaPendiente ? "Cita pendiente" : (u.m_sFechaEmbarqueCita + " " + u.m_sHoraEmbarqueCitaMinima + " a " + u.m_sHoraEmbarqueCitaMaxima) : "Sin Cita"}</TableCell>
                                            <TableCell align="left">{u.m_dFechaRegistro}</TableCell>
                                            <TableCell align="left">{u.m_sEstatusUltimaMilla}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Root>
        );
    }
}

PaquetesList.propTypes = {};

export default withStyles(useStyles) (PaquetesList);
