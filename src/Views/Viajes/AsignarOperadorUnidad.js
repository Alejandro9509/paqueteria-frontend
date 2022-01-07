import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Autocomplete from "@material-ui/lab/Autocomplete";
//import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import PageviewIcon from "@material-ui/icons/Pageview";
//import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl,
    FormControlLabel,
    Grid, InputLabel, Select,
    TextField
} from "@material-ui/core";
import {obtenerDetalleParadasIdInformes} from "../../Util/Contexts/DetalleParadasContext";
import {obtenerCiudades} from "../../Util/Contexts/CiudadesContext";
import {obtenerOperadores} from "../../Util/Contexts/OperadoresContext";
import {obtenerEstatusUnidadeId, obtenerUnidades, obtenerUnidadesTipo} from "../../Util/Contexts/UnidadesContext";
import {useFilters, useSortBy, useTable} from "react-table";
import {obtenerEstatusUnidadesId} from "../../Util/Contexts/EstatusContext";

//import { data } from '@here/maps-api-for-javascript';


function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}>
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

let timer;

export default function AsignarOperadorUnidad(props) {


    const [tabActive, setTabActive] = React.useState(0);
    /*const [generalData, setGeneralData] = React.useState({
        origen: "",
        destino: "",
        cargadoVacioRemolqueUno: false,
        cargadoVacioRemolqueDos: false,
        operador: "",
        unidad: "",
        placaIntUnidad: "",
        estatusUnidad: "",
        referencia: "",
        kms: "",
        horas: "",
        fechaCarga: "",
        horaCarga: "",
        fechaEntrega: "",
        horaEntrega: "",
        horasEnRuta: "",
    });*/
    const [data, setData] = React.useState({
        origen: "",
        destino: "",
        operador: {},
        cargadoVacioRemolqueUno: false,
        cargadoVacioRemolqueDos: false,
        unidad: {},
        placaIntUnidad: "",
        estatusUnidad: "",
        referencia: "",
        kms: "",
        horas: "",
        fechaCarga: "",
        horaCarga: "",
        fechaEntregaGeneral: "",
        horaEntregaGeneral: "",
        horasEnRuta: "",

        fechaInforme: "",
        horaInforme: "",
        folioInforme: "",
        remolqueInforme: "",
        totalInforme: "",
        fechaEntregaInforme: "",
        horaEntregaInforme: "",
        entregado: false,
        estatusInforme: "",
        dataCiudad: [],
        dataOperador: [],
        dataUnidad: [],
        openDialog: false

    });
    const [dataUnidadesRem, setDataUnidadesRem] = React.useState([]);
    const [dataOperadores, setDataOperadores] = React.useState([]);
    /*const [informeData, setInformeData] = React.useState({
        fechaInforme: "",
        horaInforme: "",
        folioInforme: "",
        remolque: "",
        total: "",
        fechaEntrega: "",
        horaEntrega: "",
        entregado: false,
        estatus: "",
    });*/
    useEffect((value) => {
        getAllOperadores()
        getAllUnidades();

        /*if (props.unidadAsignada) {
            setData({
                ...data,
                operador: props.unidadAsignada.operador,
                unidad: props.unidadAsignada.unidad,
                cargadoVacioRemolqueUno: props.unidadAsignada.cargadoVacioRemolqueUno,
                cargadoVacioRemolqueDos: props.unidadAsignada.cargadoVacioRemolqueDos,
                placaIntUnidad: props.unidadAsignada.placaIntUnidad,
                estatusUnidad: props.unidadAsignada.estatusUnidad,
                referencia: props.unidadAsignada.referencia,
                // origen: props.rutaSeleccionada.idCiudadOrigen ? props.rutaSeleccionada.idCiudadOrigen.m_sCiudad : "",
                // destino: props.rutaSeleccionada.idCiudadDestino ? props.rutaSeleccionada.idCiudadDestino.m_sCiudad : "",
                kms: props.unidadAsignada.kms,
                horas: props.unidadAsignada.horas,
                horasEnRuta: props.unidadAsignada.horasEnRuta,
            ...props.unidadAsignada

            })
        }else {
            setData({
                ...data,
                origen: props.rutaSeleccionada.idCiudadOrigen.m_sCiudad,
                destino: props.rutaSeleccionada.idCiudadDestino.m_sCiudad,
                kms: "",
                horas: "",
                horasEnRuta: "",
                referencia:""
            })
        }*/
    }, []);

    /*useEffect(() => {
        debugger
        if (props.unidadAsignada){
            setData({
                ...data,
                operador: props.unidadAsignada.operador,
                unidad: props.unidadAsignada.unidad,
                cargadoVacioRemolqueUno: props.unidadAsignada.cargadoVacioRemolqueUno,
                cargadoVacioRemolqueDos: props.unidadAsignada.cargadoVacioRemolqueDos,
                placaIntUnidad: props.unidadAsignada.placaIntUnidad,
                estatusUnidad: props.unidadAsignada.estatusUnidad,
                referencia: props.unidadAsignada.referencia,
                // origen: props.rutaSeleccionada.idCiudadOrigen ? props.rutaSeleccionada.idCiudadOrigen.m_sCiudad : "",
                // destino: props.rutaSeleccionada.idCiudadDestino ? props.rutaSeleccionada.idCiudadDestino.m_sCiudad : "",
                kms: props.unidadAsignada.kms,
                horas: props.unidadAsignada.horas,
                horasEnRuta: props.unidadAsignada.horasEnRuta,

            })
        }
    },[props.unidadAsignada])*/

    function getAllUnidadesTipo(id) {
        obtenerUnidadesTipo(id).then((respuesta) => {
            setDataUnidadesRem(respuesta.data);
        });
    }

    function getAllUnidades() {
        obtenerUnidades().then((respuesta) => {
            setDataUnidadesRem(respuesta.data);
        });
    }

    function getAllOperadores() {
        obtenerOperadores().then((respuesta) => {
            setDataOperadores(respuesta.data);
        });
    }

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }
    const handleChangeCheckbox = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.checked
        });
    }

    const handleChangeAutocomplete = (input, value) => {
        if (input === "operador"){
            setData({
                ...data,
                operador: value
            });
        }
        setData({
            ...data,
            [input]: value
        });
    }

    useEffect(() => {
        props.onChange(data)
    },[data])

    const handleRemolqueUno = (e) => {
        setData({
            ...data,
            cargadoVacioRemolqueUno: e.target.checked
        });
    }
    const handleRemolqueDos = (e) => {
        setData({
            ...data,
            cargadoVacioRemolqueDos: e.target.checked
        });
    }
    const handleOperador = (e, value) => {
        console.log(value)
        setData({
            ...data,
            operador: value
        });
    }
    const handleUnidad = (e, value) => {
        obtenerEstatusUnidadeId(value.m_nIdUnidad).then((resultado) => {
            setData({
                ...data,
                unidad: value,
                placaIntUnidad: value.m_sPlacas,
                estatusUnidad: resultado.data instanceof String  ? "" : resultado.data.m_sEstatus,
                kms: value.m_nOdometro,
                horas: value.m_nHorasTrabajadasMotorNoGPS
            });
        })

    }


    function submit(event) {
        event.preventDefault();
        props.onChange(data);
    }

    const handleChangeTab = (event, newValue) => {
        setTabActive(newValue);
    };

    function handleSelectCP(id, dobleClick, e) {
        clearTimeout(timer);
        if (e.detail === 1) {
            timer = setTimeout(() => {
                setData({
                    ...data,
                    [data.identificadorModal]: id,
                    openDialog: true,
                });
            }, 200);
        } else if (e.detail === 2) {
            setData({
                ...data,
                [data.identificadorModal]: id,
                openDialog: false,
            });
        }
    }

    const columnsUnidades = React.useMemo(() => [
        {
            Name: "Descripcion",
            accessor: "m_sDescripcion",
        },
        {
            Name: "Codigo",
            accessor: "m_sCodigo",
        },
        {
            Name: "Tipo de unidad",
            accessor: "m_nIdTipoUnidad",
        },
        {
            Name: "Estatus",
            accessor: "m_bActivo",
        },
    ]);

    const columnsOperadores = React.useMemo(() => [
        {
            Name: "Numero Operador",
            accessor: "m_nNumeroOperador",
        },
        {
            Name: "Nombre",
            accessor: "m_sNombreCompleto",
        },
        {
            Name: "Sucursal",
            accessor: "m_nIdSucursal",
        },
        {
            Name: "Activo",
            accessor: "m_nIdEstado",
        },
    ]);
    function TableOperadores({ columns, data, select }) {
        const defaultColumn = React.useMemo(
            () => ({
                // Default Filter UI
                Filter: DefaultColumnFilter,
            }),
            []
        );

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
            state,
        } = useTable(
            {
                columns,
                data,
                defaultColumn,
            },
            useFilters,
            useSortBy
        );

        return (
            <div
                className="col-md-12"
                style={{ maxHeight: "300px", overflow: "auto" }}
            >
                <table className="table" {...getTableProps()}>
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            <th>Acciones</th>
                            {headerGroup.headers.map((column) => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Name")}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <i className="fa fa-caret-up" />
                                                ) : (
                                                    <i className="fa fa-caret-down" />
                                                )
                                            ) : (
                                                ""
                                            )}
                                        </span>
                                    <div>
                                        {column.canFilter ? column.render("Filter") : null}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr
                                style={{
                                    backgroundColor:
                                        row.original.m_nIdOperador === select
                                            ? "#FCC88F"
                                            : "white",
                                }}
                                {...row.getRowProps()}
                                onClick={handleSelectCP.bind(this, row.original, false)}
                                onDoubleClick={handleSelectCP.bind(this, row.original, true)}
                            >
                                {row.cells.map((cell) => {
                                    return (
                                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }

    function DefaultColumnFilter({
                                     column: {filterValue, preFilteredRows, setFilter},
                                 }) {
        const count = preFilteredRows.length;

        return (
            <input
                className="form-control"
                value={filterValue || ""}
                onChange={(e) => {
                    setFilter(e.target.value || undefined);
                }}
                placeholder={`Buscar ${count} registros...`}
            />
        );
    }

    function TableUnidad({columns, data, select}) {
        const defaultColumn = React.useMemo(
            () => ({
                // Default Filter UI
                Filter: DefaultColumnFilter,
            }),
            []
        );

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
            state,
        } = useTable(
            {
                columns,
                data,
                defaultColumn,
            },
            useFilters,
            useSortBy
        );

        return (
            <div
                className="col-md-12"
                style={{maxHeight: "300px", overflow: "auto"}}
            >
                <table className="table" {...getTableProps()}>
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Name")}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <i className="fa fa-caret-up"/>
                                                ) : (
                                                    <i className="fa fa-caret-down"/>
                                                )
                                            ) : (
                                                ""
                                            )}
                                        </span>
                                    <div>
                                        {column.canFilter ? column.render("Filter") : null}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr
                                style={{
                                    backgroundColor:
                                        row.original.m_nIdUnidad === select ? "orange" : "white",
                                }}
                                {...row.getRowProps()}
                                onClick={handleSelectCP( row.original, false)}
                                onDoubleClick={handleSelectCP( row.original, true)}
                            >
                                {row.cells.map((cell) => {
                                    return (
                                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div>
            {/*<form onSubmit={submit} onKeyDown={e => {if (e.code === 13){*/}
            {/*    e.preventDefault()*/}
            {/*}}}>*/}
                <Grid container spacing={2}>
                    {/*<Grid item xs={6}>
                        <TextField
                            margin={"dense"}
                            variant={"outlined"}
                            label={"Origen"}
                            disabled
                            value={data.origen}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            margin={"dense"}
                            variant={"outlined"}
                            label={"Destino"}
                            disabled
                            value={data.destino}/>
                    </Grid>*/}

                    <Grid item xs={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={props.unidadAsignada.cargadoVacioRemolqueUno}
                                    onChange={handleChangeCheckbox}
                                    name="cargadoVacioRemolqueUno"
                                    disabled={props.disabled}
                                />
                            }
                            label={"Cargado/Vacío Remolque 1"}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={props.unidadAsignada.cargadoVacioRemolqueDos}
                                    onChange={handleChangeCheckbox}
                                    name="cargadoVacioRemolqueDos"
                                    disabled={props.disabled}/>
                            }
                            label={"Cargado/Vacío Remolque 2"}
                        />
                    </Grid>
                    <Grid item xs={6}/>

                    <Grid item xs={6}>
                        <Autocomplete
                            freeSolo
                            onChange={(e, value) => handleChangeAutocomplete("operador", value)}
                            value={props.unidadAsignada.operador}
                            //disabled={state.agregar == "Consultar"}
                            id="dataOperador"
                            disableClearable
                            forcePopupIcon={false}
                            options={dataOperadores}
                            getOptionLabel={(option) =>
                                option.m_sNombreCompleto
                            }
                            style={{
                                transform: "translate(14px, 10px) scale(1) !important"
                            }}
                            renderInput={(params) => (
                                <div>
                                    <TextField
                                        label="Operador"
                                        margin="dense"
                                        variant="outlined"
                                        required
                                        {...params}
                                        disabled={props.disabled}
                                    />
                                </div>
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}/>

                    <Grid item xs={6}>
                        <Autocomplete
                            freeSolo
                            onChange={(e, value) => handleChangeAutocomplete("unidad", value)}
                            value={props.unidadAsignada.unidad}
                            //disabled={state.agregar == "Consultar"}
                            id="unidad"
                            disableClearable
                            forcePopupIcon={false}
                            options={dataUnidadesRem}
                            getOptionLabel={(option) =>
                                option.m_sCodigo ? `${option.m_sCodigo} - ${option.m_sDescripcion}` : ""
                            }
                            style={{transform: "translate(14px, 10px) scale(1) !important"}}
                            renderInput={(params) => (
                                <div>
                                    <TextField
                                        label="Unidad"
                                        margin="dense"
                                        variant="outlined"
                                        required
                                        {...params}
                                        disabled={props.disabled}
                                    />
                                </div>
                            )}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            margin={"dense"}
                            variant={"outlined"}
                            label={"Placa int"}
                            disabled
                            value={props.unidadAsignada.placaIntUnidad}/>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            margin={"dense"}
                            variant={"outlined"}
                            label={"Estatus"}
                            disabled
                            value={props.unidadAsignada.estatusUnidad}/>
                    </Grid>
                    <Grid item xs={1}/>

                    <Grid item xs={3}>
                        <TextField
                            margin={"dense"}
                            variant={"outlined"}
                            label={"Referencia"}
                            onChange={handleChange}
                            value={props.unidadAsignada.referencia}
                            name={"referencia"}
                            disabled={props.disabled}/>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            margin={"dense"}
                            variant={"outlined"}
                            label={"Kilómetros"}
                            disabled
                            onChange={(e) => setData({...data, kms: e.target.value})}
                            value={props.unidadAsignada.kms}/>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            margin={"dense"}
                            variant={"outlined"}
                            label={"Horas"}
                            disabled
                            onChange={(e) => setData({...data, horas: e.target.value})}
                            value={props.unidadAsignada.horas}/>
                    </Grid>
                    <Grid item xs={4}/>
                </Grid>
            {/*</form>*/}
        </div>
    );
}


