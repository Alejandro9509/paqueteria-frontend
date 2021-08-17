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
        getAllUnidadesTipo(4);
        setData({
            ...data,
            origen: props.rutaSeleccionada.m_sOrigen,
            destino: props.rutaSeleccionada.m_sDestino,

        })
    }, []);

    function getAllUnidadesTipo(id) {
        obtenerUnidadesTipo(id).then((respuesta) => {
            setDataUnidadesRem(respuesta.data);
        });
    }

    function getAllOperadores() {
        obtenerOperadores().then((respuesta) => {
            setDataOperadores(respuesta.data);
        });
    }



    const handleFechaInforme = (e) => {
        console.log(props)
        setData({
            ...data,
            fechaInforme: e.target.value
        });
    }
    const handleHoraInforme = (e) => {
        setData({
            ...data,
            horaInforme: e.target.value
        });
    }
    const handleFolioInforme = (e) => {
        setData({
            ...data,
            folioInforme: e.target.value
        });
    }
    const handleRemolqueInforme = (e) => {
        setData({
            ...data,
            remolqueInforme: e.target.value
        });
    }
    const handleTotoalInforme = (e) => {
        setData({
            ...data,
            totalInforme: e.target.value
        });
    }
    const handleFechaEntregaInforme = (e) => {
        setData({
            ...data,
            fechaEntregaInforme: e.target.value
        });
    }
    const handleHoraEntregaInforme = (e) => {
        setData({
            ...data,
            horaEntregaInforme: e.target.value
        });
    }
    const handleEntregado = (e) => {
        setData({
            ...data,
            entregado: e.target.value
        });
    }
    const handleEstatusInforme = (e) => {
        setData({
            ...data,
            estatusInforme: e.target.value
        });
    }
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
    const handleOperador = (e) => {
        setData({
            ...data,
            operador: e.target.value
        });
    }
    const handleUnidad = (e, value) => {
        obtenerEstatusUnidadeId(value.m_nIdUnidad).then((resultado) => {
            setData({
                ...data,
                unidad: e.target.value,
                placaIntUnidad: e.target.value.m_sPlacas,
                estatusUnidad: resultado.data instanceof String  ? "" : resultado.data.m_sEstatus

            });
        })

    }


    const handleFechaCarga = (e) => {
        setData({
            ...data,
            fechaCarga: e.target.value
        });
    }
    const handleHoraCarga = (e) => {
        setData({
            ...data,
            horaCarga: e.target.value
        });
    }
    const handleFechaEntrega = (e) => {
        setData({
            ...data,
            fechaEntregaGeneral: e.target.value
        });
    }
    const handleHoraEntrega = (e) => {
        setData({
            ...data,
            horaEntregaGeneral: e.target.value
        });
    }
    const handleHorasEnRuta = (e) => {
        setData({
            ...data,
            horasEnRuta: e.target.value
        });
    }

    function submit(event) {
        event.preventDefault();
        props.onSubmit(data);
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
            <Dialog
                open={data.openDialog}
                onClose={() => setData({...data, openDialog: false})}
                fullWidth maxWidth="md"
            >
                <DialogContent>

                    {data.tipoModal == 2 && (
                        <div className="row" style={{backgroundColor: "#FFFFFF"}}>
                            <div align="right">
                                <button
                                    onClick={() => {
                                        props.history.push("/Operadores");
                                    }}
                                    className="btn btn-primary primary-btn"
                                >
                                    Agregar
                                </button>
                            </div>

                            {dataOperadores.length != 0 ? (
                                <TableOperadores
                                    select={
                                        data[data.identificadorModal] &&
                                        data[data.identificadorModal].m_nIdOperador
                                    }
                                    columns={columnsOperadores}
                                    data={dataOperadores}
                                    identificadorModal={data.identificadorModal}
                                />
                            ) : (
                                <div>No se encontró ningún registro</div>
                            )}
                            <DialogActions style={{justifyContent: "left"}}>
                                <button
                                    onClick={() => setData({...data, openDialog: false})}
                                    className="btn btn-secondary secondary-btn"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => setData({...data, openDialog: false})}
                                    className="btn btn-primary primary-btn"
                                >
                                    Aceptar
                                </button>
                            </DialogActions>
                        </div>
                    )}
                    {data.tipoModal == 4 && (
                        <div className="row" style={{backgroundColor: "#FFFFFF"}}>
                            <div align="right">
                                <button
                                    onClick={() => {
                                        props.history.push("/Unidades");
                                    }}
                                    className="btn btn-primary primary-btn"
                                >
                                    Agregar
                                </button>
                            </div>

                            {dataUnidadesRem.length != 0 ? (
                                <TableUnidad
                                    select={
                                        data[data.identificadorModal] &&
                                        data[data.identificadorModal].m_nIdUnidad
                                    }
                                    columns={columnsUnidades}
                                    data={dataUnidadesRem}
                                    identificadorModal={data.identificadorModal}
                                />
                            ) : (
                                <div>No se encontró ningún registro</div>
                            )}
                            <DialogActions style={{justifyContent: "left"}}>
                                <button
                                    onClick={() => setData({...data, openDialog: false})}
                                    className="btn btn-secondary secondary-btn"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => setData({...data, openDialog: false})}
                                    className="btn btn-primary primary-btn"
                                >
                                    Aceptar
                                </button>
                            </DialogActions>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Tabs
                value={tabActive}
                onChange={handleChangeTab}>
                <Tab label="General" {...a11yProps(0)} />
            </Tabs>
            <form onSubmit={submit}>
                <TabPanel value={tabActive} index={0}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
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
                        </Grid>

                        <Grid item xs={3}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={data.cargadoVacioRemolqueUno}
                                        onChange={handleRemolqueUno}
                                        name="cargadoVacíoRemolqueUno"/>
                                }
                                label={"Cargado/Vacío Remolque 1"}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={data.cargadoVacioRemolqueDos}
                                        onChange={handleRemolqueDos}
                                        name="cargadoVacíoRemolqueDos"/>
                                }
                                label={"Cargado/Vacío Remolque 2"}
                            />
                        </Grid>
                        <Grid item xs={6}/>

                        <Grid item xs={6}>
                            <Autocomplete
                                freeSolo
                                onChange={handleOperador}

                                value={data.operador}
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
                                            {...params}
                                            InputProps={{
                                                ...params.InputProps,
                                                style: {height: "33px", fontSize: "14px"},
                                                type: "search",
                                                value: data.operador,
                                                //disabled: state.agregar == "Consultar",
                                                disableUnderline: true,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            padding="0px"
                                                            style={{
                                                                paddingRight: "0px",
                                                            }}
                                                            onClick={() => {
                                                                setData({
                                                                    ...data,
                                                                    identificadorModal:
                                                                        "dataOperador",
                                                                    tipoModal: 0,
                                                                    openDialog: true
                                                                })
                                                            }}
                                                            //disabled={state.agregar == "Consultar"}
                                                        >
                                                            <PageviewIcon
                                                                style={{
                                                                    color: "#F9A03E",
                                                                    fontSize: 32,
                                                                    paddingInlineEnd: 0,
                                                                    paddingRight: 0,
                                                                    paddingBlockEnd: 0,
                                                                    paddingLeft: 0,
                                                                    paddingBlock: 0,
                                                                }}
                                                            />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </div>
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}/>

                        <Grid item xs={6}>
                            <Autocomplete
                                freeSolo
                                onChange={handleUnidad}

                                value={data.unidad}
                                //disabled={state.agregar == "Consultar"}
                                id="unidad"
                                disableClearable
                                forcePopupIcon={false}
                                options={dataUnidadesRem}
                                getOptionLabel={(option) =>
                                    option.m_sDescripcion
                                }
                                style={{
                                    transform: "translate(14px, 10px) scale(1) !important"
                                }}
                                renderInput={(params) => (
                                    <div>
                                        <TextField
                                            label="Unidad"
                                            margin="dense"
                                            variant="outlined"
                                            {...params}
                                            InputProps={{
                                                ...params.InputProps,
                                                style: {height: "33px", fontSize: "14px"},
                                                type: "search",
                                                value: data.unidad,
                                                //disabled: state.agregar == "Consultar",
                                                disableUnderline: true,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            padding="0px"
                                                            style={{
                                                                paddingRight: "0px",
                                                            }}
                                                            //disabled={state.agregar == "Consultar"}
                                                            onClick={() => {
                                                                setData({
                                                                    ...data,
                                                                    identificadorModal:
                                                                        "unidad",
                                                                    tipoModal: 1,
                                                                    openDialog: true
                                                                })
                                                            }}
                                                        >
                                                            <PageviewIcon
                                                                style={{
                                                                    color: "#F9A03E",
                                                                    fontSize: 32,
                                                                    paddingInlineEnd: 0,
                                                                    paddingRight: 0,
                                                                    paddingBlockEnd: 0,
                                                                    paddingLeft: 0,
                                                                    paddingBlock: 0,
                                                                }}
                                                            />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
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
                                value={data.placaIntUnidad}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Estatus"}
                                disabled
                                value={data.estatusUnidad}/>
                        </Grid>
                        <Grid item xs={1}/>

                        <Grid item xs={3}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Referencia"}
                                onChange={(e) => setData({...data, referencia: e.target.value})}
                                value={data.referencia}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Kilómetros"}
                                required
                                onChange={(e) => setData({...data, kms: e.target.value})}
                                value={data.kms}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Horas"}
                                onChange={(e) => setData({...data, horas: e.target.value})}
                                required
                                value={data.horas}/>
                        </Grid>
                        <Grid item xs={4}/>

                        <Grid item xs={4}>
                            <h4>Detalles de la Carga</h4>
                        </Grid>
                        <Grid item xs={4}>
                            <h4>Detalles de la Entrega</h4>
                        </Grid>
                        <Grid item xs={4}/>

                        <Grid item xs={3}>
                            <TextField
                                margin={"dense"}
                                type={"date"}
                                variant={"outlined"}
                                required
                                InputLabelProps={{shrink: true}}
                                label={"Fecha"}
                                onChange={handleFechaCarga}
                                value={data.fechaCarga}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                type={"time"}
                                InputLabelProps={{shrink: true}}
                                label={"Hora"}
                                required
                                onChange={handleHoraCarga}
                                value={data.horaCarga}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Fecha"}
                                type={"date"}
                                required
                                InputLabelProps={{shrink: true}}
                                onChange={handleFechaEntrega}
                                value={data.fechaEntregaGeneral}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Hora"}
                                InputLabelProps={{shrink: true}}
                                type={"time"}
                                required
                                onChange={handleHoraEntrega}
                                value={data.horaEntregaGeneral}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Horas en ruta"}
                                required
                                onChange={handleHorasEnRuta}
                                value={data.horasEnRuta}/>
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={tabActive} index={1}>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <TextField
                                margin={"dense"}
                                type={"date"}
                                required
                                variant={"outlined"}
                                InputLabelProps={{shrink: true}}
                                label={"Fecha"}
                                onChange={handleFechaInforme}
                                value={data.fechaInforme}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                type={"time"}
                                required
                                InputLabelProps={{shrink: true}}
                                label={"Hora"}
                                onChange={handleHoraInforme}
                                value={data.horaInforme}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Folio informe"}
                                required
                                onChange={handleFolioInforme}
                                value={data.folioInforme}/>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Remolque"}
                                required
                                onChange={handleRemolqueInforme}
                                value={data.remolqueInforme}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Total"}
                                required
                                onChange={handleTotoalInforme}
                                value={data.totalInforme}/>
                        </Grid>

                        <Grid item xs={12}>
                            <h4>Detalle de entrega</h4>
                        </Grid>

                        <Grid item xs={3}>
                            <TextField
                                margin={"dense"}
                                type={"date"}
                                variant={"outlined"}
                                InputLabelProps={{shrink: true}}
                                label={"Fecha"}
                                required
                                onChange={handleFechaEntregaInforme}
                                value={data.fechaEntregaInforme}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                type={"time"}
                                InputLabelProps={{shrink: true}}
                                label={"Hora"}
                                required
                                onChange={handleHoraEntregaInforme}
                                value={data.horaEntregaInforme}/>
                        </Grid>
                        <Grid item xs={2}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={data.entregado}
                                        onChange={handleEntregado}
                                        name="entregado"/>
                                }
                                label={"Entregado"}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                margin={"dense"}
                                variant={"outlined"}
                                label={"Estatus"}
                                required
                                onChange={handleEstatusInforme}
                                value={data.estatusInforme}/>
                        </Grid>
                        <Grid item xs={2}/>
                    </Grid>
                </TabPanel>
                {props.children}
            </form>
        </div>
    );
}


