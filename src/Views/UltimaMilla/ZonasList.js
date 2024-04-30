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
    InputBase,
    InputAdornment,
    TextField,
} from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import { alpha, styled } from "@mui/material/styles";
import {obtenerZonasSucursal} from "../../Util/Contexts/ZonasContext";
import SearchIcon from "@mui/icons-material/Search";
import {
    obtenerListadoZonaOperativa,
    obtenerListadoZonaOperativaBySucursal
} from "../../Util/Contexts/ZonaOperativaContext";

const PREFIX = 'ZonasList';

const classes = {
    visuallyHidden: `${PREFIX}-visuallyHidden`,
    search: `${PREFIX}-search`,
    searchIcon: `${PREFIX}-searchIcon`,
    inputRoot: `${PREFIX}-inputRoot`,
    inputInput: `${PREFIX}-inputInput`
};

const StyledTableContainer = styled(TableContainer)((
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
    },

    [`& .${classes.search}`]: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },

    [`& .${classes.searchIcon}`]: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    [`& .${classes.inputRoot}`]: {
        color: 'inherit',
    },

    [`& .${classes.inputInput}`]: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    }
}));

class ZonasList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zonas: [],
            zonasFiltradas: [],
            order: "asc",
            orderBy: "m_sDescripcion",
            searchText: ""
        }
        this.getAllzonas = this.getAllzonas.bind(this)
        this.handleRequestSort = this.handleRequestSort.bind(this)
        this.handleSelectAllClickevent = this.handleSelectAllClickevent.bind(this)
        this.searchZona = this.searchZona.bind(this)
    }

    componentDidMount() {
        this.getAllzonas()
    }

    getAllzonas() {
        obtenerListadoZonaOperativaBySucursal(this.props.sucursalSeleccionada).then(({data}) => {
            this.setState({zonas: data, zonasFiltradas: data})
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

    createSortHandler(property, event){
        this.handleRequestSort(event, property);
    };

    handleSelectAllClickevent(event) {
        if (event.target.checked) {
            const newSelecteds = this.state.zonas;
            this.props.selectZona(newSelecteds)
            return;
        }
        this.props.selectZona([])
    };
    handleClick(event, row) {
        const selectedIndex = this.props.zonasSeleccionadas.map(u => u.m_nIdZona).indexOf(row.m_nIdZona);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(this.props.zonasSeleccionadas, row);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(this.props.zonasSeleccionadas.slice(1));
        } else if (selectedIndex === this.props.zonasSeleccionadas.length - 1) {
            newSelected = newSelected.concat(this.props.zonasSeleccionadas.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                this.props.zonasSeleccionadas.slice(0, selectedIndex),
                this.props.zonasSeleccionadas.slice(selectedIndex + 1),
            );
        }
        this.props.selectZona(newSelected)
    };

    searchZona(event){
        event.preventDefault()
        if (this.state.searchText  === "") {
            this.setState({zonasFiltradas: this.state.zonas})
        }else {
            this.setState({zonasFiltradas: this.state.zonas.filter( u => u.m_sDescripcion.toLowerCase().includes(this.state.searchText.toLowerCase()))})
        }

    }

    render() {
       // const {classes} = this.props;
        const isSelected = (row) => this.props.zonasSeleccionadas.find(u => u.m_nIdZona === row) != null;


        return (
            <StyledTableContainer className={"j-forms"} style={{height:"300px"}}>
                <TextField variant="outlined" size={"small"} placeholder={"Buscar"} style={{padding: "0px"}}
                           value={this.state.searchText}
                           onChange={(e) => this.setState({searchText: e.target.value})}
                           InputProps={{
                               endAdornment: (
                                   <InputAdornment position="end">
                                       <SearchIcon fontSize={"large"} style={{fill:"#868686", cursor: "pointer"}} onClick={this.searchZona}/>
                                   </InputAdornment>
                               ),
                           }}
                />
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={this.props.zonasSeleccionadas.length > 0 && this.props.zonasSeleccionadas.length < this.state.zonas.length}
                                    checked={this.state.zonas.length > 0 && this.props.zonasSeleccionadas.length === this.state.zonas.length}
                                    onChange={this.handleSelectAllClickevent}
                                    inputProps={{'aria-label': 'select all desserts'}}
                                />
                            </TableCell>
                            <TableCell
                                sortDirection={this.state.orderBy === "m_sCodigoZona" ? this.state.order : false}
                                align="left">
                                <TableSortLabel
                                    active={this.state.orderBy === "m_sCodigoZona"}
                                    direction={this.state.orderBy === "m_sCodigoZona" ? this.state.order : 'asc'}
                                    onClick={(event) => this.createSortHandler("m_sCodigoZona", event)}
                                >
                                    Todas
                                    {this.state.orderBy === "m_sCodigoZona" ? (
                                        <span className={classes.visuallyHidden}>
                                            {this.state.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </span>
                                    ) : null}
                                </TableSortLabel>

                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.stableSort(this.state.zonasFiltradas, this.getComparator(this.state.order, this.state.orderBy)).map((u, index) => {
                                const isItemSelected = isSelected(u.m_nIdZona);
                                const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                onClick={(event) => {this.handleClick(event, u)
                                                    this.props.closeResumen(false)
                                                }}
                                                checked={isItemSelected}
                                                inputProps={{'aria-labelledby': labelId}}
                                            />
                                        </TableCell>
                                        <TableCell align="left">{u.m_sCodigoZona}</TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </StyledTableContainer>
        );
    }
}

ZonasList.propTypes = {};

export default (ZonasList);
