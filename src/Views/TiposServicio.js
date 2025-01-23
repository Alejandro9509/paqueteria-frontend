import React, { useEffect } from "react";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import * as XLSX from 'xlsx';
import { useTable, useFilters, useSortBy } from 'react-table'
import { styled } from "@mui/material/styles";
import { DataGrid } from '@mui/x-data-grid';

import Noty from 'noty';
import { dataGridLocaleText } from "../Constants";
import { Button, Grid, TextField, Tooltip } from "@mui/material";
import { agregarTipoServicio, eliminarTipoServicio, modificarTipoServicio, obtenerTipoServicio, obtenerTipoServicioId } from "../Util/Contexts/TipoServiciosContext";
import { validarPermisos } from "../Util/Contexts/UsuarioContext";
import $ from "jquery";
import {validarDerecho} from "../Util/Util"
import { confirmAlert } from "react-confirm-alert";
const PREFIX = 'TiposServicio';

const classes = {
    seleccionado: `${PREFIX}-seleccionado`,
    noSeleccionado: `${PREFIX}-noSeleccionado`,
    disabled: `${PREFIX}-disabled`
};

const Root = styled('div')({
    [`& .${classes.seleccionado}`]: {
        backgroundColor: "#FCC88F",
    },
    [`& .${classes.noSeleccionado}`]: {
        backgroundColor: "#FFFFFF",
    },
    [`& .${classes.disabled}`]: {
        pointerEvents: "none",
        cursor: "default",
    },
});

window.jQuery = window.$ = $;
function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

function TiposServicio() {
    const [data, setData] = React.useState([])
    const [state, setState] = React.useState({
        showPopUp: false,
        IdTipoServicio: 0,
        Descripcion: "",
        DiasHabiles: 0,
        DerechoBorrar: 84,
        Costo: 0,
        Activo: false,
        agregar: "Agregar",
        height: window.innerHeight,
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId")
    })
    const [fileUploaded, setFileUploaded] = React.useState([])

    const handleAceptar = (e) => {
        e.preventDefault()
        var params = {
            "m_sDescripcion": state.Descripcion,
            "m_nDiashabiles": state.DiasHabiles,
            "m_cCosto": state.Costo,
            "m_bActivo": state.Activo,
            "m_nCreadoPor": state.CreadoPor,
            "m_nModificadoPor": state.ModificadoPor
        }
        if (state.IdTipoServicio != 0) {
            modificarTipoServicio(state.IdTipoServicio, params).then(respuesta => {
                showSuccess(respuesta.data)
                handleShowListado()
            }).catch(err => {
                console.log(err)
                showSuccess(err.response?.data)
            });
        } else {
            agregarTipoServicio(params).then(respuesta => {
                showSuccess(respuesta.data)
                handleShowListado()
            }).catch(err => {
                console.log(err)
                showSuccess(err.response?.data)
            });
        }

    }

    function handleEliminar(id) {
        var derecho;
        validarPermisos(state).then(respuesta => {
            //showSuccess(respuesta.data)
            derecho = respuesta.data;
            if (derecho == false) {
                showSuccess("El usuario no tiene derechos para realizar el proceso");
                return;
            }
            eliminarTipoServicio(id, state.ModificadoPor).then(respuesta => {
                showSuccess(respuesta.data)
                getAllData();
            }).catch(err => {
                showSuccess(err)
            });
        }).catch(err => {
            showSuccess(err)
        });
    }

    function handleShowModificar(id) {
        obtenerTipoServicioId(id).then(respuesta => {
            setState({
                ...state,
                agregar: "Modificar",
                showPopUp: true,
                IdTipoServicio: id,
                Descripcion: respuesta.data.m_sDescripcion,
                DiasHabiles: respuesta.data.m_nDiashabiles,
                Activo: respuesta.data.m_bActivo,
                Costo: respuesta.data.m_cCosto
            })
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }

    function handleShowConsultar(id) {
        obtenerTipoServicioId(id).then(respuesta => {
            setState({
                ...state,
                agregar: "Consultar",
                showPopUp: true,
                IdTipoServicio: id,
                Descripcion: respuesta.data.m_sDescripcion,
                DiasHabiles: respuesta.data.m_nDiashabiles,
                Activo: respuesta.data.m_bActivo,
                Costo: respuesta.data.m_cCosto
            })
        });
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }

    const handleChange = event => {
        setState({
            ...state,
            [event.target.id]: event.target.value
        });
    };

    function handleSelectRow(id, event) {
        setState({
            ...state,
            IdTipoServicio: id
        });
    }

    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            sortable: false, filterable: false,
            field: "",
            renderCell: (row) => {
                return (
                    <Root>
                        <Tooltip title="Modificar">
                            <a onClick={() => (handleShowModificar(row.row.m_nIdTipoServicio))}
                               className="btn btn-default btn-xs"
                               disabled={!validarDerecho(9101316)}><i className="fa fa-pencil-square-o"
                                                                     style={{color: "#F9A03E"}}/></a>

                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a className="btn btn-default btn-xs" onClick={() => (handleShowConsultar(row.row.m_nIdTipoServicio))}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a href="#" className="btn btn-default btn-xs" onClick={() =>   confirmAlert({
                                                        title: 'Confirmar Eliminar',
                                                        message: '¿Está seguro de eliminar este servicio?',
                                                        buttons: [
                                                            {
                                                                label: 'Si',
                                                                onClick: () =>  {
                                                                    handleEliminar(row.row.m_nIdTipoServicio)
                                                                
                                                                }
                                                            },
                                                            {
                                                                label: 'No',
                                                            }
                                                        ]
                                                    })}
                            disabled={!validarDerecho(9101317)}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>

                        </Tooltip>
                    </Root>
                );
            }
        },
        {
            headerName: "Descripción",
            field: "m_sDescripcion",
            width: 200,
        }, {
            headerName: "Costo",
            field: "m_cCosto",
            width: 100,
        }, {
            headerName: "Dias Habiles",
            field: "m_nDiashabiles",
            width: 150,
        }, {
            headerName: "Creado El",
            field: "m_sCreadoEl",
            width: 200,
        }, {
            headerName: "Creado Por",
            field: "m_sCreadoPor",
            width: 150,
        }, {
            headerName: "Modificado El",
            field: "m_sModificadoEl",
            width: 200,
        }, {
            headerName: "Modificado Por",
            field: "m_sModificadoPor",
            width: 150,
        }

    ]);

    useEffect(value => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        getAllData();
    }, []);

    function getAllData() {
        obtenerTipoServicio().then(respuesta => {
            setData(respuesta.data)
        });
    };

    const handleUpload = (e) => {
        e.preventDefault();

        var files = e.target.files, f = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            let readedData = XLSX.read(data, { type: 'binary' });
            const wsname = readedData.SheetNames[0];
            const ws = readedData.Sheets[wsname];

            /* Convert array to json*/
            const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
            setFileUploaded(dataParse);
        };
        reader.readAsBinaryString(f)
    }

    function DefaultColumnFilter({
        column: { filterValue, preFilteredRows, setFilter },
    }) {
        const count = preFilteredRows.length

        return (
            <input
                className="form-control"
                value={filterValue || ''}
                onChange={e => {
                    setFilter(e.target.value || undefined)
                }}
                placeholder={`Buscar ${count} registros...`}
            />
        )
    }

    function Table({ columns, data }) {

        const defaultColumn = React.useMemo(
            () => ({
                // Default Filter UI
                Filter: DefaultColumnFilter,
            }),
            []
        )

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
        } = useTable(
            {
                columns,
                data,
                defaultColumn
            },
            useFilters,
            useSortBy
        )

        return (
            <div className="col-md-12">





                {/*AQUI MODIFICAS LO QUE NECESITES*/}

                <table className="table" {...getTableProps()}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                <th>Acciones</th>
                                {headerGroup.headers.map(column => (
                                    // Add the sorting props to control sorting. For this example
                                    // we can add them into the header props
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Name')}
                                        {/* Add a sort direction indicator */}
                                        <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? <i className="fa fa-caret-up" />
                                                    : <i className="fa fa-caret-down" />
                                                : ''}
                                        </span>
                                        <div>{column.canFilter ? column.render('Filter') : null}</div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map(
                            (row, i) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}
                                        onClick={handleSelectRow.bind(this, row.original.m_nIdTipoServicio)}
                                        className={state.IdTipoServicio === row.original.m_nIdTipoServicio ? classes.seleccionado : classes.noSeleccionado}>
                                        <td>
                                            <div>
                                                <a onClick={() => (handleShowModificar(row.original.m_nIdTipoServicio))} className="btn btn-default btn-sm"><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>
                                                <a onClick={() => (handleShowConsultar(row.original.m_nIdTipoServicio))} className="btn btn-default btn-sm"><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>
                                                <a className="btn btn-default btn-sm" onClick={() => {
                                                    confirmAlert({
                                                        title: 'Confirmar Eliminar',
                                                        message: '¿Está seguro de eliminar Embarque?',
                                                        buttons: [
                                                            {
                                                                label: 'Si',
                                                                onClick: () =>  handleEliminar(row.original.m_nIdTipoServicio)
                                                            },
                                                            {
                                                                label: 'No',
                                                            }
                                                        ]
                                                    })
                                                
                                                
                                                }}><i className="zmdi zmdi-delete" style={{ color: "#F9A03E" }} /></a>
                                            </div>
                                        </td>
                                        {row.cells.map(cell => {
                                            return (
                                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                            )
                                        })}
                                    </tr>
                                )
                            }
                        )}
                    </tbody>
                </table>
            </div>
        )
    }

    const handleShowListado = (event) => {
        if (event){
            event.stopPropagation();
        }
        getAllData()
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(0).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Listado').addClass('in show');
        setState({ ...state, agregar: "Agregar" });
    }

    const handleShowAgregar = () => {
        setState({
            ...state,
            agregar: "Agregar",
            showPopUp: true,
            IdTipoServicio: 0,
            Costo: 0,
            Descripcion: "",
            DiasHabiles: 0,
            Activo: 0
        })
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }

    return (
        <div >
            <header className="topbar clearfix">
                <Cabecera titulo="Tipo de Servicio" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Tipo de Servicio</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>

            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>
            {/*Leftbar End Here*/}

            {/*Page Container Start Here*/}
            <section className="main-container">

                <div className="container-fluid">
                    <ul className="nav navStatica nav-tabs">
                        <li className="active">
                            <a onClick={(event) => handleShowListado(event)}>
                                <i className="fa fa-list" /> Listado
                            </a>
                        </li>
                        <li>
                            <a className= {validarDerecho(9101315)? "":"hide"} onClick={() => handleShowAgregar()}>
                                <i className="fa fa-plus-circle" /> {state.agregar}
                            </a>
                        </li>
                    </ul>

                    <div className="row" className="tab-content">
                        <div id="Listado" className="tab-pane fade in show">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                                        <DataGrid
                                            localeText={dataGridLocaleText}
                                            rows={data}
                                            columns={columns}
                                            density="compact"
                                            pageSize={Math.floor((state.height - 310) / 30)}
                                            getRowId={(row) => row.m_nIdTipoServicio}
                                            onRowSelectionModelChange={(newModel)=>{
                                                if(newModel.length<1)
                                                    return
                                                setState({
                                                    ...state,
                                                    IdTipoServicio: data.find(i=>i.m_nIdTipoServicio==newModel[0]).m_nIdTipoServicio
                                                })
                                            }}
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div id="Agregar" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <form className="j-forms" onSubmit={handleAceptar} id="formulario">
                                                <div className="form-content">
                                                    {/*****************************************Descripcion************************************************************/}
                                                    <div className="col-sm-12 col-md-6 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small" fullWidth
                                                                       label="Descripción"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="text"
                                                                       maxLength="50"
                                                                       required
                                                                       value={state.Descripcion}
                                                                       id="Descripcion"
                                                                       disabled={state.agregar == "Consultar"}
                                                            />
                                                        </div>
                                                    </div>
                                                    {/*****************************************Dias Habiles************************************************************/}
                                                    <div className="col-sm-12 col-md-6 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small" fullWidth
                                                                       label="Dias Habiles"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="number"
                                                                       min="0"
                                                                       step="1"
                                                                       value={state.DiasHabiles}
                                                                       id="DiasHabiles"
                                                                       disabled={state.agregar == "Consultar"}
                                                            />
                                                        </div>
                                                    </div>
                                                    {/****************************************Activo*************************************************************/}
                                                    <div className="col-sm-12 col-md-3 inline-group unit">
                                                        <div className="inline-group">
                                                            <label className="checkbox">
                                                                <input
                                                                    checked={state.Activo}
                                                                    onChange={(e) =>
                                                                        setState({
                                                                            ...state,
                                                                            Activo: e.target.checked,
                                                                        })
                                                                    }
                                                                    native
                                                                    name="activo"
                                                                    type="checkbox"
                                                                    id="activo"
                                                                    disabled={state.agregar == "Consultar"}
                                                                />
                                                                <i/>
                                                                Activo
                                                            </label>

                                                        </div>
                                                    </div>

                                                    {/*****************************************Costo*******************************************************/}
                                                    <div className="col-sm-12 col-md-12 unit">
                                                        <div className="input">
                                                            <TextField variant="outlined" size="small" fullWidth label="Costo"
                                                                       onChange={handleChange}
                                                                       className="form-control"
                                                                       type="number"
                                                                       min="0"
                                                                       step="0.01"
                                                                       required
                                                                       value={state.Costo}
                                                                       id="Costo"
                                                                       disabled={state.agregar == "Consultar"}
                                                            />
                                                        </div>
                                                    </div>


                                                </div>
                                                <br></br>
                                                
                                            </form> 
                     
                                            <div className="form-footer ol-md-12">
                                                <Grid container spacing={1}>
                                                    <Grid item xs>
                                                        <Button fullWidth className="btn btn-secondary secondary-btn"
                                                                style={{marginRight:'5px'}} disabled={state.agregar == "Consultar"}
                                                                onClick={handleShowListado}>
                                                            Cancelar
                                                        </Button>
                                                    </Grid>
                                                    <Grid item xs>
                                                        <Button fullWidth className="btn btn-primary primary-btn" type="submit"
                                                                form="formulario" disabled={state.agregar == "Consultar"}>
                                                            Guardar
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="widget-wrap" id="Importar" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <form className="j-forms">
                                                <div className="form-content">
                                                    <div className="col-sm-12 col-md-12 unit">



                                                    </div>
                                                </div>
                                                <br></br>
                                                <div className="form-footer" className="col-md-12">
                                                    <button className="btn btn-default btn-block ex-noty" data-layout="topCenter" data-type="information">Notificación</button>
                                                    <button className="btn btn-secondary secondary-btn"  disabled={state.agregar == "Consultar"}>Cancelar</button>
                                                    <button onClick={handleAceptar} className="btn btn-primary primary-btn"  disabled={state.agregar == "Consultar"}>Aceptar</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </section>
            {/*Page Container End Here*/}

            {/*Rightbar Start Here*/}
            <aside className="rightbar">
                <BarraLateralDerecha />
            </aside>

        </div>

    );
}

export default TiposServicio;
