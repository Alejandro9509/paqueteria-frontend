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
    TableSortLabel,
    Grid,
    Link,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
} from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import {obtenerUnidades, obtenerUnidadesUltimaMilla} from "../../Util/Contexts/UnidadesContext";
import { alpha, styled } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import {obtenerOperadores} from "../../Util/Contexts/OperadoresContext";
import {confirmAlert} from "react-confirm-alert";
import Tooltip from "@mui/material/Tooltip";
import {showSuccess} from "../../Util/Util";
import AgregarRemolques from "./AgregarRemolques";
import ProgressBarCubicaje from "../Viajes/ProgressBarCubicaje";

const PREFIX = 'UnidadesList';

const classes = {
    visuallyHidden: `${PREFIX}-visuallyHidden`
};

const Root = styled('div')((
    {
        theme
    }
) => ({
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

class UnidadesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unidades: [], order: "asc", orderBy: "m_sDescripcion",

        }
        this.getAllUnidades = this.getAllUnidades.bind(this)
        this.handleRequestSort = this.handleRequestSort.bind(this)
        this.handleSelectAllClickevent = this.handleSelectAllClickevent.bind(this)
        this.solicitarRemolques = this.solicitarRemolques.bind(this)

    }

    componentDidMount() {
        this.getAllUnidades()
    }

    getAllUnidades() {
        console.log(this.props.paquetes)
        const params = {
            guias: this.props.paquetes.filter(p => !p.m_bEsRecoleccion).map(p => ({m_nIdGuia: p.m_nId}))
        }
        obtenerUnidadesUltimaMilla(this.props.sucursalId, params).then(({data}) => {
            const unidadesDisponibles = data.filter(item => item.ocupado === false);
            this.setState({unidades: unidadesDisponibles})
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
        return order === 'desc' ? (a, b) => this.descendingComparator(a, b, orderBy) : (a, b) => -this.descendingComparator(a, b, orderBy);
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
        if (event.target.checked && this.state.unidades.filter(f => f.m_nIdOperador).length !== this.props.unidadesSeleccionadas.filter(f => f.m_nIdOperador).length) {
            const newSelecteds = this.state.unidades.filter(f => f.m_nIdOperador);
            this.props.selectUnidades(newSelecteds)
            return;
        }
        this.props.selectUnidades([])
    };


    solicitarRemolques(row) {
        const selectedIndex = this.props.unidadesSeleccionadas.map(u => u.m_nIdUnidad).indexOf(row.m_nIdUnidad);
        if (selectedIndex === -1) {
            this.props.cerrarDialogos()
            if (row.m_bAplicaRemolques) {
                if (row.m_sTipoUnidad == "TRACTOCAMION") {//Si la unidad es tractocamion el remolque es obligatorio
                    this.props.asignarRemolques(row)
                } else {
                    confirmAlert({
                        title: 'Confirmar', message: '¿Desea agregar remolques?', buttons: [{
                            label: 'Sí', onClick: () => this.props.asignarRemolques(row)
                        }, {
                            label: 'No', onClick: () => this.handleClick(row)
                        }]
                    })
                }
            } else {
                this.handleClick(row)
            }
        } else {
            this.handleClick(row)
        }
    }

    handleClick(row) {
        const selectedIndex = this.props.unidadesSeleccionadas.map(u => u.m_nIdUnidad).indexOf(row.m_nIdUnidad);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(this.props.unidadesSeleccionadas, row);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(this.props.unidadesSeleccionadas.slice(1));
        } else if (selectedIndex === this.props.unidadesSeleccionadas.length - 1) {
            newSelected = newSelected.concat(this.props.unidadesSeleccionadas.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(this.props.unidadesSeleccionadas.slice(0, selectedIndex), this.props.unidadesSeleccionadas.slice(selectedIndex + 1),);
        }
        this.props.selectUnidades(newSelected)
    };

    render() {
        //const {classes} = this.props;
        const isSelected = (row) => this.props.unidadesSeleccionadas.find(u => u.m_nIdUnidad === row) != null;


        return (
            <Root style={{height: "400px", overflow: "auto"}}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {/*<TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={this.props.unidadesSeleccionadas.length > 0 && this.props.unidadesSeleccionadas.length < this.state.unidades.length}
                                            checked={this.state.unidades.length > 0 && this.props.unidadesSeleccionadas.length === this.state.unidades.length}
                                            onChange={this.handleSelectAllClickevent}
                                            inputProps={{'aria-label': 'select all desserts'}}
                                        />
                                    </TableCell>*/}
                                    <TableCell padding="checkbox"></TableCell>
                                    <TableCell
                                        sortDirection={this.state.orderBy === "m_sDescripcion" ? this.state.order : false}
                                        align="left">
                                        <TableSortLabel
                                            active={this.state.orderBy === "m_sDescripcion"}
                                            direction={this.state.orderBy === "m_sDescripcion" ? this.state.order : 'asc'}
                                            onClick={(event) => this.createSortHandler("m_sDescripcion", event)}
                                        >
                                            Unidad
                                            {this.state.orderBy === "m_sDescripcion" ? (
                                                <span className={classes.visuallyHidden}>
                                                {this.state.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </span>) : null}
                                        </TableSortLabel>

                                    </TableCell>
                                    <TableCell
                                        sortDirection={this.state.orderBy === "m_sTipoUnidad" ? this.state.order : false}
                                        align="left">Tipo Unidad</TableCell>
                                    <TableCell
                                        align="left">Ocupación</TableCell>
                                    <TableCell
                                        sortDirection={this.state.orderBy === "m_sNombreOperador" ? this.state.order : false}
                                        align="left">Repartidor</TableCell>
                                    <TableCell sortDirection={this.state.orderBy === "m_sPlacas" ? this.state.order : false}
                                               align="left">Placa</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.stableSort(this.state.unidades, this.getComparator(this.state.order, this.state.orderBy)).map((u, index) => {
                                    const isItemSelected = isSelected(u.m_nIdUnidad);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (<TableRow>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    onClick={(event) => this.solicitarRemolques(u)}
                                                    checked={isItemSelected}
                                                    disabled={!u.m_nIdOperador}
                                                    inputProps={{'aria-labelledby': labelId}}
                                                />
                                            </TableCell>
                                            <TableCell align="left"> {u.m_sCodigo} - {u.m_sDescripcion}</TableCell>

                                            <TableCell align="left">{u.m_sTipoUnidad}</TableCell>
                                        <TableCell align="left"><ProgressBarCubicaje
                                            value={u.utilizacion || 0}>{u.utilizacion?.toFixed(0) || 0}%</ProgressBarCubicaje></TableCell>
                                            <Tooltip title={u.ocupado?"En Ruta":""}>
                                            <TableCell align="left">{<Link style={{cursor: "pointer",color:u.ocupado?"gray":''}}
                                                                           onClick={() => this.props.reasignarOperador(u)}>{!u.m_nIdOperador ? "Asignar" : u.m_sNombreOperador}</Link>}</TableCell></Tooltip>
                                            <TableCell align="left">{u.m_sPlacas}</TableCell>
                                        </TableRow>)
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Root>
        );
    }
}

UnidadesList.propTypes = {};

export default (UnidadesList);
