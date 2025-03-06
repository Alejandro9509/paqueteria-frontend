import React, {Component} from 'react';
import {
    Chip,
    List,
    ListItem,
    ListSubheader,
    IconButton,
    ListItemText, InputAdornment, TextField, DialogTitle, DialogContent, DialogActions, Button, Dialog, Typography
} from "@mui/material";
import {makeStyles,withStyles} from '@mui/styles'
import Tooltip from "@mui/material/Tooltip";
import SendIcon from '@mui/icons-material/Send';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import {obtenerZonasSucursal} from "../../Util/Contexts/ZonasContext";
import {obtenerSucursales} from "../../Util/Contexts/SucursalContext";
import moment from "moment";
import {cambiarOperadorUnidad} from "../../Util/Contexts/UnidadesContext";
import UnidadesList from "./UnidadesList";
import PaquetesList from "./PaquetesList";
import { obtenerGuiaUltimaMilla} from "../../Util/Contexts/GuiaContext";
import ZonasList from "./ZonasList";
import Configuracion from "./Configuracion";
import {arrayGuias} from "../../Util/Data";
import {ReactComponent as EmbarqueIcon} from "../../iconos/Menu/IconoEmbarque/iconoEmbarque.svg";
import {ReactComponent as UnidadesIcon} from "../../iconos/Catalogos/Icono Unidades/icono_unidades.svg";
import {ReactComponent as UltimaMillaIcono} from "../../iconos/Menu/IconoUltimaMilla/IconoUltimaMilla.svg";
import {ReactComponent as CalendarioIcono} from "../../iconos/Mapa/iconoCalendario.svg";
import { LocalizationProvider} from '@mui/x-date-pickers';
import { StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import FormControl from "@mui/material/FormControl";
import {obtenerOperadoresPorSucursal} from "../../Util/Contexts/OperadoresContext";
import PaquetesPlaneacion from "./PaquetesPlaneacion";
import Autocomplete from '@mui/material/Autocomplete';
import AgregarRemolques from "./AgregarRemolques";
import {showSuccess, validarDerecho} from "../../Util/Util";
import {alpha} from "@mui/material/styles";

const useStyles = theme => ({
    search: {
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
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
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

/*
const PREFIX = 'FiltersMap';

const classes = {
    search: `${PREFIX}-search`,
    searchIcon: `${PREFIX}-searchIcon`,
    inputRoot: `${PREFIX}-inputRoot`,
    inputInput: `${PREFIX}-inputInput`,
    arrow: `${PREFIX}-arrow`,
    tooltip: `${PREFIX}-tooltip`
};
const Root = styled('div')((
    {
        theme
    }
) => ({
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
*/


class FiltersMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSucursales: false,
            openZona: false,
            openUnidades: false,
            openPaquetes: false,
            openConfiguration: false,
            openDate: false,
            sucursales: [],
            sucursalesFiltradas: [],
            zonas: [],
            sucursalSeleccionada: null,
            zonasSeleccionada: [],
            fecha: new Date(),
            unidadesSeleccionadas: [],
            paquetesSeleccionadas: [],
            startDate: moment(new Date()).format('YYYY-MM-DDTHH:mm'),
            finishDate: moment(new Date()).add(24, 'hours').format('YYYY-MM-DDTHH:mm'),
            startTime: "08:00",
            finishTime: "18:00",
            searchText: "",
            locationSearch: "",
            tipoBusqueda: "3",
            sistemaUnidad: "1",
            optimizar: "2",
            unidades:false,
            operadores: [],
            openOperadorDialog: false,
            operadorSeleccionado: 0
        }
        this.getAllSucursales = this.getAllSucursales.bind(this)
        this.getAllGuias = this.getAllGuias.bind(this)
        this.selectCiudad = this.selectCiudad.bind(this)
        this.getAllZonas = this.getAllZonas.bind(this)
        this.selectZona = this.selectZona.bind(this)
        this.reasignarOperador = this.reasignarOperador.bind(this)
        this.asignarOperadorUnidad = this.asignarOperadorUnidad.bind(this)
        this.selectUnidades = this.selectUnidades.bind(this)
        this.selectPaquetes = this.selectPaquetes.bind(this)
        this.searchSucursal = this.searchSucursal.bind(this)
        this.changeDate = this.changeDate.bind(this)
        this.changeConfiguration = this.changeConfiguration.bind(this)
        this.changeDateConsult = this.changeDateConsult.bind(this)
        this.cerrarDialogos = this.cerrarDialogos.bind(this)
        this.asignarRemolques = this.asignarRemolques.bind(this)
        this.asignarRemolquesUnidad = this.asignarRemolquesUnidad.bind(this)
    }

    componentDidMount() {
        if (this.props.data) {
            this.setState({
                ...this.props.data
            })
        }
        this.getAllSucursales()
    }

    changeDate(name, value) {
        this.setState({
            [name]: value
        })
    }

    changeConfiguration(name, value) {
        this.setState({
            [name]: value,
            paquetesSeleccionadas: [],
            unidadesSeleccionadas: []
        })
    }

    changeDateConsult(value) {
        this.setState({fecha: value,
            openSucursales: false,
            openZona: false,
            openDate: false,
            openUnidades: false,
            openPaquetes: false, openConfiguration: false})
        this.props.refreshFilterUltimaMilla(value,
            this.state.sucursalSeleccionada.m_nIdSucursal,
            this.state.zonasSeleccionada.map(z => z.m_nIdZona),
            parseInt(this.state.tipoBusqueda))
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.fecha !== this.state.fecha || prevState.zonasSeleccionada.length !== this.state.zonasSeleccionada.length || prevState.unidadesSeleccionadas.length !== this.state.unidadesSeleccionadas.length || prevState.zonasSeleccionada.length !== this.state.zonasSeleccionada.length || prevState.sucursalSeleccionada !== this.state.sucursalSeleccionada) {
            this.props.guardarFiltros(this.state)
        }

        if(this.props.closeFiltersMapDialogs!=prevProps.closeFiltersMapDialogs){//Cierra todas las ventanas
            this.setState({
                openSucursales: false,
                openZona: false,
                openDate: false,
                openUnidades: false,
                openPaquetes: false, openConfiguration: false
            })
        }
    }

    getAllGuias() {
        // obtenerGuiasFiltro("0" , "0", this.state.sucursalSeleccionada.m_nIdSucursal, 4).then(({data}) => {
        //     this.setState({paquetesSeleccionadas: arrayGuias})
        // })
        //"0", "0", this.props.data.sucursalSeleccionada.m_nIdSucursal, 4
        obtenerGuiaUltimaMilla(this.state.zonasSeleccionada.map(z => z.m_nIdZona), parseInt(this.state.tipoBusqueda)).then(({data}) => {
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
            this.setState({sucursales: data, sucursalesFiltradas: data})
        })
    }

    selectCiudad(sucursal) {
        this.setState(() => ({
            sucursalSeleccionada: sucursal,
            zonasSeleccionada: [],
            paquetesSeleccionadas: [],
            unidadesSeleccionadas: [],
            openSucursales: false,
            openZona: false,
            openDate: false,
            openUnidades: false,
            openPaquetes: false, openConfiguration: false
        }));
        this.props.changeMapLocation(sucursal)
    }

    selectZona(zona) {
        this.setState({zonasSeleccionada: zona,
            openSucursales: false,
            openZona: false,
            openDate: false,
            openUnidades: false,
            openPaquetes: false, openConfiguration: false})
        if (zona.length !== 0) {
            //this.getAllGuias()
            this.props.refreshFilterUltimaMilla(this.state.fecha, this.state.sucursalSeleccionada.m_nIdSucursal, zona.map(z => z.m_nIdZona), parseInt(this.state.tipoBusqueda))

        }
    }

    asignarRemolques(row){
        this.setState({
            unidad: row,
            openUnidades: false,
            openRemolques: true
        })
    }

    reasignarOperador(unidad) {
        obtenerOperadoresPorSucursal(this.state.sucursalSeleccionada?.m_nIdSucursal).then(({data}) => {
            const operadoresDisponibles = data
            if(data.filter((op)=>!op.ocupado).length==0)
                showSuccess("No se encontraron operadores disponibles")
            this.setState({
                operadores: operadoresDisponibles,
                unidadSeleccionada: unidad.m_nIdUnidad,
                openOperadorDialog: true,
                openUnidades: false
            })
        })
    }

    selectUnidades(array) {
        this.setState({unidadesSeleccionadas: array,
            openSucursales: false,
            openZona: false,
            openDate: false,
            openUnidades: false,
            openRemolques:false,
            openPaquetes: false, openConfiguration: false
        })
    }

    cerrarDialogos(){
        this.setState({
            openSucursales: false,
            openZona: false,
            openDate: false,
            openUnidades: false,
            openPaquetes: false, openConfiguration: false
        })
    }

    selectPaquetes(array) {
        this.setState({paquetesSeleccionadas: array})
    }

    asignarOperadorUnidad(event) {
        event.preventDefault()
        if (this.state.operadorSeleccionada) {
            cambiarOperadorUnidad(this.state.unidadSeleccionada, this.state.operadorSeleccionada.m_nIdOperador).then(({data}) => {
                showSuccess(data)
                this.setState({openUnidades: true, openOperadorDialog: false, unidadesSeleccionadas: []})
            })
        } else {
            showSuccess("No se seleccionó ningún operador.")
        }
    }

    asignarRemolquesUnidad(remolques) {
        const {unidad} = this.state
        unidad.idRemolque1 = remolques.IdRemolque1.m_nIdUnidad
        unidad.idRemolque2 =  remolques.IdRemolque2 ? remolques.IdRemolque2.m_nIdUnidad : 0
        unidad.idDolly =  remolques.IdDolly ? remolques.IdDolly.m_nIdUnidad : 0
        const selectedIndex = this.state.unidadesSeleccionadas.map(u => u.m_nIdUnidad).indexOf(unidad.m_nIdUnidad);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(this.state.unidadesSeleccionadas, unidad);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(this.state.unidadesSeleccionadas.slice(1));
        } else if (selectedIndex === this.state.unidadesSeleccionadas.length - 1) {
            newSelected = newSelected.concat(this.state.unidadesSeleccionadas.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                this.state.unidadesSeleccionadas.slice(0, selectedIndex),
                this.state.unidadesSeleccionadas.slice(selectedIndex + 1),
            );
        }
        this.selectUnidades(newSelected)
    }

    searchSucursal(event) {
        event.preventDefault()
        if (this.state.searchText === "") {
            this.setState({sucursalesFiltradas: this.state.sucursales})
        } else {
            this.setState({sucursalesFiltradas: this.state.sucursales.filter(u => u.m_sSucursal.toLowerCase().includes(this.state.searchText.toLowerCase()))})
        }
    }

    render() {
        //const {classes} = this.props;
        return (
            <div className="leaflet-top leaflet-left" style={{paddingLeft: "40px"}}>
                <AgregarRemolques paquetes={this.state.paquetesSeleccionadas}
                                  asignarRemolquesUnidad={this.asignarRemolquesUnidad}
                                  open={this.state.openRemolques} close={() => this.setState({openRemolques: false})} />

                <PaquetesPlaneacion open={this.props.data.modoPlaneacion && this.state.openPaquetes}
                                    close={() => this.setState({openPaquetes: false})}
                                    zonasIds={this.state.zonasSeleccionada.map(z => z.m_nIdZona)}
                                    tipoServicio={parseInt(this.state.tipoBusqueda)}
                                    changeDate={this.changeDate} data={this.state}
                                    paquetesSeleccionadas={this.state.paquetesSeleccionadas}
                                    selectPaquetes={this.selectPaquetes}/>
                <Dialog open={this.state.openOperadorDialog} fullWidth maxWidth={"md"}
                        onClose={() => this.setState({openOperadorDialog: false})}>
                    <DialogTitle>Asignar Operador</DialogTitle>

                    <DialogContent>
                        <form onSubmit={this.asignarOperadorUnidad}>
                            <label className="input select" style={{width: "100%"}}>
                                <FormControl fullWidth variant="outlined" size="small">
                                    <Autocomplete
                                        labelId="operadorListadoLabel"
                                        label="Operador"
                                        className="form-control"
                                        required
                                        disableClearable
                                        forcePopupIcon={false}
                                        options={this.state.operadores}
                                        value={this.state.operadorSeleccionada}
                                        onChange={(event, newValue) =>
                                            this.setState({operadorSeleccionada: newValue})
                                        }
                                        freeSolo
                                        style={{transform: "translate(14px, 10px) scale(1) !important",marginTop:"1%"}}
                                        getOptionLabel={(option) => `${option.m_sNombreCompleto} - ${option.ocupado?"(En Ruta) ("+option.fechaUltimaRuta+")":"(DISPONIBLE)"}`}
                                        getOptionDisabled={(option)=>option.ocupado}
                                        renderInput={(params) => <TextField {...params} margin="dense" label="Operador" variant="outlined" />}
                                    />
                                </FormControl>
                                <i></i>
                            </label>
                            <DialogActions>
                                <Button color={"primary"} type={"submit"}>
                                    Aceptar
                                </Button>
                                <Button onClick={() => this.setState({openOperadorDialog: false, openUnidad: true})}>
                                    Cancelar
                                </Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>
                <div className="leaflet-control leaflet-bar" style={{border: "none"}}>
                    <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', alignItems: "center"}}>
                        <BootstrapTooltip
                            // onBlur={(e) => {this.setState({openSucursales: false})}}
                            PopperProps={{ disablePortal: false }}
                            // onClose={(e) =>{
                            // this.setState({openSucursales: false})
                            //  this.props.closeResumenParada(e)}}
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
                                            <TextField variant="outlined" size={"small"} placeholder={"Buscar"}
                                                       style={{padding: "0px"}}
                                                       value={this.state.searchText}
                                                       onChange={(e) => this.setState({searchText: e.target.value})}
                                                       InputProps={{
                                                           endAdornment: (
                                                               <InputAdornment position="end">
                                                                   <SearchIcon fontSize={"large"} style={{
                                                                       fill: "#868686",
                                                                       cursor: "pointer"
                                                                   }} onClick={this.searchSucursal}/>
                                                               </InputAdornment>
                                                           ),
                                                       }}
                                            />
                                        </ListSubheader>
                                    }
                                    style={{width: '100%', maxHeight: "300px", overflow: "auto"}}
                                >
                                    {
                                        this.state.sucursalesFiltradas.map((c, index) =>
                                            <ListItem button onClick={(e) =>{
                                            this.selectCiudad(c) 
                                            this.props.closeResumenParada(false)}} key={c.m_nIdSucursal}>
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
                                onDelete={(e) =>{ this.setState({
                                    openSucursales: !this.state.openSucursales,
                                    openZona: false,
                                    openUnidades: false,
                                    openDate: false,
                                    openPaquetes: false, openConfiguration: false
                                
                                })
                                this.props.closeResumenParada(false)
                            }}
                                deleteIcon={<KeyboardArrowDownIcon color={"primary"}/>}
                                variant="outlined"
                            />
                        </BootstrapTooltip>
                        <BootstrapTooltip
                            // onBlur={(e) => {this.setState({openZona: false})}}
                            PopperProps={{
                                disablePortal: false,
                            }}
                            // onClose={() => {this.setState({openZona: false})}}
                            open={this.state.openZona}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title={
                                <ZonasList zonasSeleccionadas={this.state.zonasSeleccionada}
                                           closeResumen={this.props.closeResumenParada}
                                           selectZona={this.selectZona}
                                           sucursalSeleccionada={this.state.sucursalSeleccionada ? this.state.sucursalSeleccionada.m_nIdSucursal : 0}/>
                            }>
                            <Chip
                                style={{
                                    backgroundColor: "white",
                                    margin: "1px",
                                    maxWidth: "150px",
                                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                                }}
                                label={this.state.zonasSeleccionada.length !== 0 ? this.state.zonasSeleccionada.map(z => z.m_sCodigoZona).join(", ") : "Zona"}
                                disabled={this.state.sucursalSeleccionada == null}
                                onDelete={(e) =>{
                                    this.setState({
                                        openZona: !this.state.openZona, openSucursales: false,
                                        openUnidades: false,
                                        openDate: false,
                                        openPaquetes: false, openConfiguration: false
                                    })
                                    this.props.closeResumenParada(false)
                                }}
                                deleteIcon={<KeyboardArrowDownIcon color={"primary"}/>}
                                variant="outlined"
                            />
                        </BootstrapTooltip>
                        <BootstrapTooltip
                            PopperProps={{
                                disablePortal: false,
                            }}
                            // onClose={() => this.setState({openDate: false})}
                            open={this.state.openDate}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title={
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <StaticDatePicker
                                        autoOk
                                        displayStaticWrapperAs="desktop"
                                        orientation="landscape"
                                        variant="static"
                                        openTo={"day"}
                                        format="dd/MMM/yyyy hh:mm a"
                                        value={this.state.fecha}
                                        disableFuture={!this.props.data.modoPlaneacion}
                                        disablePast={this.props.data.modoPlaneacion}
                                        onChange={this.changeDateConsult}
                                    />
                                </LocalizationProvider>
                            }>
                            <Chip
                                icon={<CalendarioIcono
                                    style={{fill: "#F9A03E", paddingTop: "5px", paddingBottom: "5px"}}/>}
                                style={{
                                    backgroundColor: "white",
                                    margin: "1px",
                                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                                }}
                                disabled={this.state.sucursalSeleccionada == null}
                                label={moment(this.state.fecha).format('MMMM DD')}
                                onClick={(e) =>{
                                    this.setState({
                                        openPaquetes: false, openSucursales: false,
                                        openZona: false,
                                        openUnidades: false, openConfiguration: false, openDate: !this.state.openDate
                                    })
                                    this.props.closeResumenParada(false)}
                                }
                                variant="outlined"
                            />
                        </BootstrapTooltip>
                        <BootstrapTooltip
                            PopperProps={{
                                disablePortal: false,
                            }}
                            // onClose={() => this.setState({openConfiguration: false})}
                            open={this.state.openConfiguration}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title={
                                <Configuracion values={this.state}
                                               changeValue={this.changeConfiguration}
                                               changeConfigurationFullScreen={this.props.changeConfiguration}
                                               fullScreenData={this.props.data}/>
                            }>
                            <Chip
                                label="Configuración"
                                icon={<SettingsIcon color={"primary"}/>}
                                style={{
                                    backgroundColor: "white",
                                    margin: "1px",
                                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                                }}
                                onClick={(e) => {
                                    this.setState({
                                        openConfiguration: !this.state.openConfiguration, openSucursales: false,
                                        openZona: false, openDate: false,
                                        openUnidades: false,
                                        openPaquetes: false,
                                    })
                                    this.props.closeResumenParada(false)
                                }}
                                variant="outlined"
                            />
                        </BootstrapTooltip>
                        {
                            !this.props.data.modoPlaneacion &&
                            <BootstrapTooltip
                                PopperProps={{
                                    disablePortal: false,
                                }}
                                // onClose={() => this.setState({openPaquetes: false})}
                                open={this.state.openPaquetes}
                                disableFocusListener
                                disableHoverListener
                                disableTouchListener
                                title={
                                    <PaquetesList zonasIds={this.state.zonasSeleccionada.map(z => z.m_nIdZona)}
                                                  tipoServicio={parseInt(this.state.tipoBusqueda)}
                                                  changeDate={this.changeDate} data={this.state}
                                                  paquetesSeleccionadas={this.state.paquetesSeleccionadas}
                                                  selectPaquetes={this.selectPaquetes}>
                                    </PaquetesList>
                                }>
                                <Chip
                                    style={{
                                        backgroundColor: "white",
                                        margin: "1px",
                                        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                                    }}
                                    disabled={this.state.zonasSeleccionada.length === 0  || (moment(this.state.fecha).format('yyyy-MM-DD')<moment(new Date()).format('yyyy-MM-DD'))}
                                    icon={<EmbarqueIcon
                                        style={{fill: "#F9A03E", paddingTop: "5px", paddingBottom: "5px"}}/>}
                                    label={`Paquetes (${this.state.paquetesSeleccionadas.length})`}
                                    onClick={(e) => {
                                        this.setState({
                                            openPaquetes: !this.state.openPaquetes, openSucursales: false,
                                            openZona: false,
                                            openDate: false,
                                            openUnidades: false, openConfiguration: false
                                        })
                                        this.props.closeResumenParada(false)
                                    }}
                                    variant="outlined"
                                />
                            </BootstrapTooltip>
                        }
                        {
                            this.props.data.modoPlaneacion &&
                            <Chip
                                style={{
                                    backgroundColor: "white",
                                    margin: "1px",
                                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                                }}
                                disabled={this.state.zonasSeleccionada.length === 0 }
                                icon={<EmbarqueIcon
                                    style={{fill: "#F9A03E", paddingTop: "5px", paddingBottom: "5px"}}/>}
                                label={`Paquetes (${this.state.paquetesSeleccionadas.length})`}
                                onClick={(e) =>{
                                    this.setState({
                                        openPaquetes: !this.state.openPaquetes, openSucursales: false,
                                        openZona: false,
                                        openDate: false,
                                        openUnidades: false, openConfiguration: false
                                    })
                                    this.props.closeResumenParada(false)
                                }}
                                variant="outlined"
                            />
                        }
                        <BootstrapTooltip
                            PopperProps={{
                                disablePortal: false,
                            }}
                            // onClose={() => this.setState({openUnidades: false})}
                            open={this.state.openUnidades}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title={
                                <UnidadesList reasignarOperador={this.reasignarOperador}
                                              paquetes={this.state.paquetesSeleccionadas}
                                              sucursalId={this.state.sucursalSeleccionada ? this.state.sucursalSeleccionada.m_nIdSucursal : 0 }
                                              unidadesSeleccionadas={this.state.unidadesSeleccionadas}
                                              selectUnidades={this.selectUnidades} cerrarDialogos={this.cerrarDialogos} asignarRemolques={this.asignarRemolques}>
                                </UnidadesList>
                            }>
                            <Chip
                                label={`Unidades (${this.state.unidadesSeleccionadas.length})`}
                                style={{
                                    backgroundColor: "white",
                                    margin: "1px",
                                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                                }}
                                disabled={this.state.sucursalSeleccionada == null || (moment(this.state.fecha).format('yyyy-MM-DD')<moment(new Date()).format('yyyy-MM-DD'))}
                                icon={<UnidadesIcon
                                    style={{fill: "#F9A03E", paddingTop: "10px", paddingBottom: "10px"}}/>}
                                onClick={(e) => {this.setState({
                                    openUnidades: !this.state.openUnidades, openSucursales: false,
                                    openZona: false, openDate: false,
                                    openPaquetes: false, openConfiguration: false
                                })
                                this.props.closeResumenParada(false)
                            }}
                                variant="outlined"
                            />
                        </BootstrapTooltip>

                        <Tooltip title={"Generar Rutas"} onClose={() => {}}>
                            <Chip
                                icon={<UltimaMillaIcono
                                    style={{fill: "white", paddingTop: "10px", paddingBottom: "10px"}}/>}
                                label="Generar Rutas"
                                style={{
                                    color: "white",
                                    backgroundColor: "#F9A03E",
                                    margin: "1px",
                                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                                }}
                                disabled={(this.state.sucursalSeleccionada == null || (moment(this.state.fecha).format('yyyy-MM-DD')<moment(new Date()).format('yyyy-MM-DD'))) && !validarDerecho(9101447)}
                                onClick={() => {
                                    if(this.state.unidadesSeleccionadas.length>0 && this.state.unidadesSeleccionadas.at(0).ocupado) {
                                        showSuccess(" La unidad seleccionada cuenta con un chofer en ruta, favor de cambiar operador")
                                        return;
                                    }
                                    this.props.generarRuta(this.state)
                                    this.setState({ openUnidades: false, openPaquetes: false, openConfiguration: false, openDate: false })
                                }}
                            />
                        </Tooltip>

                        <Tooltip title={this.props.data.modoPlaneacion ? "Guardar ruta" : "Enviar ruta a operadores"}>
                            <IconButton
                                onClick={() => {
                                    this.setState({
                                        unidadesSeleccionadas:[],
                                        paquetesSeleccionadas: [],
                                        openUnidades: false,
                                        openPaquetes: false,
                                        openConfiguration: false,
                                        openDate: false
                                    });
                                    this.props.guardarRuta()}}
                                disabled={((moment(this.state.fecha).format('yyyy-MM-DD')<moment(new Date()).format('yyyy-MM-DD')) && !validarDerecho(9101448)) || this.props.data.tour?.tour?.unassigned?.length > 0}
                                style={{
                                    backgroundColor: "white",
                                    margin: "1px",
                                    width: "70px",
                                    height: "32px",
                                    borderRadius: "16px",
                                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                                }} aria-label="send">
                                <SendIcon color={"primary"} fontSize="large"/>
                            </IconButton>
                        </Tooltip>
                        <TextField variant="standard" size={"small"} placeholder={"Buscar dirección"}
                                   style={{
                                       width: "300px",
                                       paddingLeft: "10px",
                                       backgroundColor: "white",
                                       borderRadius: "20px"
                                   }}
                                   value={this.state.locationSearch}
                                   onChange={(e) => this.setState({locationSearch: e.target.value})}
                                   InputProps={{
                                       endAdornment: (
                                           <InputAdornment position="end">
                                               <SearchIcon fontSize={"large"}
                                                           style={{fill: "#868686", cursor: "pointer"}}
                                                           onClick={() => this.props.searchLocation(this.state.locationSearch)}/>
                                           </InputAdornment>
                                       ),
                                   }}
                        />
                    </div>
                    <div>
                        {/*<Typography style={{paddingLeft: "10px", color: "black"}} variant={"h1"}>Modo: <strong style={{color: this.props.data.modoPlaneacion ? "red": "blue"}}>{this.props.data.modoPlaneacion ? `Planeación` : `Fecha Actual`} </strong></Typography>*/}
                    </div>
                </div>
                {/*<IconButton
                    onClick={(e) => {e.stopPropagation(); this.props.cambiarModo(!this.props.data.modoPlaneacion);}}
                    style={{
                        color: "white",
                        borderRadius: "10px",
                        width: "40px",
                        height: "40px",
                        backgroundColor: this.props.data.modoPlaneacion ? "red" : "#4F6AF3",
                        top: "150px",
                        pointerEvents: "auto",
                        left: "10px",
                        position: "fixed",
                        zIndex: 30000,
                        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                    }}>
                    <UpdateIcon fontSize={"large"}/>
                </IconButton>*/}
            </div>
        );
    }
}

FiltersMap.propTypes = {};

export default withStyles(useStyles)(FiltersMap);





function BootstrapTooltip(props) {
    const useStylesBootstrap = makeStyles((theme) => ({

        arrow: {

            color: "#F9A03E",

        },

        tooltip: {

            heigth: "400px",

            width: "1000px",

            backgroundColor: "white",

        },

    }));

    return <Tooltip classes={useStylesBootstrap()} {...props} />;
}


