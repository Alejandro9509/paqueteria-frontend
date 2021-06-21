import React, {Component} from 'react';
import {
    Chip,
    List,
    ListItem,
    ListSubheader,
    IconButton,
    withStyles,
    InputBase,
    ListItemText
} from "@material-ui/core";
import {fade, makeStyles} from '@material-ui/core/styles';

import Tooltip from "@material-ui/core/Tooltip";
import DateRangeIcon from '@material-ui/icons/DateRange';
import SendIcon from '@material-ui/icons/Send';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import SettingsIcon from '@material-ui/icons/Settings';
import SearchIcon from '@material-ui/icons/Search';
import {obtenerZonasSucursal} from "../../Util/Contexts/ZonasContext";
import {obtenerSucursales} from "../../Util/Contexts/SucursalContext";
import localization from 'moment/locale/es-mx'
import moment from "moment";
import {obtenerUnidades} from "../../Util/Contexts/UnidadesContext";
import UnidadesList from "./UnidadesList";
import PaquetesList from "./PaquetesList";
import {obtenerGuia} from "../../Util/Contexts/GuiaContext";
import ZonasList from "./ZonasList";

moment.locale('es-mx', localization);
const useStyles = theme => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
});

class FiltersMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSucursales: false,
            openZona: false,
            openUnidades: false,
            openPaquetes: false,
            openConfiguration: false,
            sucursales: [],
            zonas: [],
            sucursalSeleccionada: null,
            zonasSeleccionada: [],
            fecha: new Date(),
            unidadesSeleccionadas: [],
            paquetesSeleccionadas: [],
            sucursalSeleccionadas: []

        }

        this.getAllSucursales = this.getAllSucursales.bind(this)
        this.getAllUnidades = this.getAllUnidades.bind(this)
        this.getAllGuias = this.getAllGuias.bind(this)
        this.selectCiudad = this.selectCiudad.bind(this)
        this.getAllZonas = this.getAllZonas.bind(this)
        this.selectZona = this.selectZona.bind(this)
        this.selectUnidades = this.selectUnidades.bind(this)
        this.selectPaquetes = this.selectPaquetes.bind(this)
        this.selectSucursal = this.selectSucursal.bind(this)
    }

    componentDidMount() {
        this.getAllSucursales()
        //this.getAllUnidades()
        //this.getAllGuias()

    }

    getAllUnidades() {
        obtenerUnidades().then(({data}) => {
            this.setState({unidadesSeleccionadas: data})
        })
    }

    getAllGuias() {
        obtenerGuia().then(({data}) => {
            this.setState({paquetesSeleccionadas: data})
        })
    }

    getAllZonas(id) {
        obtenerZonasSucursal(id).then(({data}) => {
            this.setState({zonas: data})
        })
    }

    getAllSucursales() {
        obtenerSucursales().then(({data}) => {
            this.setState({sucursales: data})
        })
    }

    selectCiudad(sucursal) {
        this.setState({sucursalSeleccionada: sucursal, openSucursales: false})
    }


    selectZona(zona) {
        this.setState({zonasSeleccionada: zona})
        if (zona.length !== 0) {
            this.getAllUnidades()
            this.getAllGuias()
        }
        //this.getAllZonas(zona.m_nIdZona)
    }

    selectSucursal(array) {
        this.setState({sucursalSeleccionadas: array})
    }


    selectUnidades(array) {
        this.setState({unidadesSeleccionadas: array})
    }

    selectPaquetes(array) {
        this.setState({paquetesSeleccionadas: array})
    }


    render() {
        const {classes} = this.props;
        return (
            <div className="leaflet-top leaflet-left" style={{paddingLeft: "40px"}}>
                <div className="leaflet-control leaflet-bar" style={{border: "none"}}>
                    <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', alignItems: "center"}}>
                        <BootstrapTooltip
                            PopperProps={{
                                disablePortal: false,
                            }}
                            onClose={() => this.setState({openSucursales: false})}
                            open={this.state.openSucursales}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title={
                                <List
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                    subheader={
                                        <ListSubheader component="div" style={{position: "inherit"}}
                                                       id="nested-list-subheader">
                                            <div className={classes.search}>
                                                <div className={classes.searchIcon}>
                                                    <SearchIcon/>
                                                </div>
                                                <InputBase
                                                    placeholder="Buscar"
                                                    classes={{
                                                        root: classes.inputRoot,
                                                        input: classes.inputInput,
                                                    }}
                                                    inputProps={{'aria-label': 'search'}}
                                                />
                                            </div>
                                        </ListSubheader>
                                    }
                                    style={{width: '100%', maxHeight: "300px", overflow: "auto"}}
                                >
                                    {
                                        this.state.sucursales.map((c, index) =>
                                            <ListItem button onClick={() => this.selectCiudad(c)} key={c.m_nIdSucursal}>
                                                <ListItemText id={c.m_nIdSucursal} primary={c.m_sSucursal}/>
                                            </ListItem>)
                                    }
                                </List>
                            }>
                            <Chip
                                style={{
                                    backgroundColor: "white",
                                    margin: "1px",
                                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                                }}
                                label={this.state.sucursalSeleccionada ? this.state.sucursalSeleccionada.m_sSucursal : "Sucursal"}
                                onDelete={() => this.setState({
                                    openSucursales: !this.state.openSucursales,
                                    openZona: false,
                                    openUnidades: false,
                                    openPaquetes: false, openConfiguration: false
                                })}
                                deleteIcon={<KeyboardArrowDownIcon color={"primary"}/>}
                                variant="outlined"
                            />
                        </BootstrapTooltip>
                        <BootstrapTooltip
                            PopperProps={{
                                disablePortal: false,
                            }}
                            onClose={() => this.setState({openZona: false})}
                            open={this.state.openZona}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title={
                                <ZonasList zonasSeleccionadas={this.state.zonasSeleccionada}
                                           selectZona={this.selectZona}
                                           sucursalSeleccionada={this.state.sucursalSeleccionada ? this.state.sucursalSeleccionada.m_nIdSucursal : 0}/>
                            }>
                            <Chip
                                style={{
                                    backgroundColor: "white",
                                    margin: "1px",
                                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                                }}
                                label={this.state.zonasSeleccionada.length !== 0 ? this.state.zonasSeleccionada.map(z => z.m_sDescripcion).join(", ") : "Zona"}
                                disabled={this.state.sucursalSeleccionada == null}
                                onDelete={() => this.setState({
                                    openZona: !this.state.openZona, openSucursales: false,
                                    openUnidades: false,
                                    openPaquetes: false, openConfiguration: false
                                })}
                                deleteIcon={<KeyboardArrowDownIcon color={"primary"}/>}
                                variant="outlined"
                            />
                        </BootstrapTooltip>
                        <Chip
                            icon={<DateRangeIcon/>}
                            style={{
                                backgroundColor: "white",
                                margin: "1px",
                                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                            }}
                            label={moment(this.state.fecha).format('MMMM DD')}

                            onClick={() => console.log("Press")}
                            variant="outlined"
                        />

                        <BootstrapTooltip
                            PopperProps={{
                                disablePortal: false,
                            }}
                            onClose={() => this.setState({openPaquetes: false})}
                            open={this.state.openPaquetes}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title={
                                <PaquetesList paquetesSeleccionadas={this.state.paquetesSeleccionadas}
                                              selectPaquetes={this.selectPaquetes}>

                                </PaquetesList>
                            }>
                            <Chip
                                style={{
                                    backgroundColor: "white",
                                    margin: "1px",
                                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                                }}
                                label={`Paquetes (${this.state.paquetesSeleccionadas.length})`}
                                onClick={() => this.setState({
                                    openPaquetes: !this.state.openPaquetes, openSucursales: false,
                                    openZona: false,
                                    openUnidades: false, openConfiguration: false
                                })}
                                variant="outlined"
                            />
                        </BootstrapTooltip>

                        <BootstrapTooltip
                            PopperProps={{
                                disablePortal: false,
                            }}
                            onClose={() => this.setState({openUnidades: false})}
                            open={this.state.openUnidades}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title={
                                <UnidadesList unidadesSeleccionadas={this.state.unidadesSeleccionadas}
                                              selectUnidades={this.selectUnidades}>

                                </UnidadesList>
                            }>
                            <Chip
                                label={`Unidades (${this.state.paquetesSeleccionadas.length})`}
                                style={{
                                    backgroundColor: "white",
                                    margin: "1px",
                                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                                }}
                                onClick={() => this.setState({
                                    openUnidades: !this.state.openUnidades, openSucursales: false,
                                    openZona: false,
                                    openPaquetes: false, openConfiguration: false
                                })}
                                variant="outlined"
                            />
                        </BootstrapTooltip>


                        <BootstrapTooltip
                            PopperProps={{
                                disablePortal: false,
                            }}
                            onClose={() => this.setState({openConfiguration: false})}
                            open={this.state.openConfiguration}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title={
                                <div>
                                    Hola
                                </div>
                            }>
                            <Chip
                                label="Configuración"
                                icon={<SettingsIcon color={"primary"}/>}
                                style={{
                                    backgroundColor: "white",
                                    margin: "1px",
                                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                                }}
                                onClick={() => this.setState({
                                    openConfiguration: !this.state.openConfiguration, openSucursales: false,
                                    openZona: false,
                                    openUnidades: false,
                                    openPaquetes: false,
                                })}
                                variant="outlined"
                            />
                        </BootstrapTooltip>

                        <Chip
                            label="Generar Rutas"
                            style={{
                                backgroundColor: "#F9A03E",
                                margin: "1px",
                                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                            }}
                            onClick={() => console.log("hola")}
                        />
                        <IconButton style={{
                            backgroundColor: "white",
                            margin: "1px",
                            width: "70px",
                            height: "32px",
                            borderRadius: "16px",
                            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                        }} aria-label="send">
                            <SendIcon color={"primary"} fontSize="large"/>
                        </IconButton>
                    </div>

                </div>

            </div>
        );
    }
}

FiltersMap.propTypes = {};

export default withStyles(useStyles)(FiltersMap);


const useStylesBootstrap = makeStyles((theme) => ({
    arrow: {
        color: "#F9A03E",
    },
    tooltip: {
        backgroundColor: "white",
    },
}));

function BootstrapTooltip(props) {
    const classes = useStylesBootstrap();

    return <Tooltip classes={classes} {...props} />;
}


