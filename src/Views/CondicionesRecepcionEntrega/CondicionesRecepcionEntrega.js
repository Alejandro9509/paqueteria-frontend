import React from 'react';
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {DataGrid} from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import {FormControl, InputLabel, MenuItem, Select, TextField, Tooltip} from "@material-ui/core";
import {confirmAlert} from "react-confirm-alert";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

function CondicionesRecepcionEntrega(){
    const classes = useStyles();

    const [state, setState] = React.useState({
        agregar: "Agregar",
        height: window.innerHeight,
        descripcion: "",
        active: 0,
    })
    const [data, setData] = React.useState([])
    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            soportable: false, filterable: false,
            field: "",
            renderCell: (row) => {
                return(
                    <div>
                        <Tooltip title={"Agregar"}>
                            <a href={"#Agregar"}
                               role={"tab"}
                               data-toggle={"tab"}
                               onClick={() => (handleShowModificar(row.row.id))}
                               className={"btn btn-default btn-xs"}>
                                <i className={"fa fa-pencial-square-o"}
                                   style={{ color: "#F9A03E" }}/>
                            </a>
                        </Tooltip>
                        <Tooltip title={"Consultar"}>
                            <a href={"#Agregar"}
                               role={"tab"}
                               data-toggle={"tab"}
                               className={"btn btn-default btn-xs"}
                               onClick={() => (handleShowModificar(row.row.id))}>
                                <i className={"fa fa-eye"} style={{ color: "#F9A03E" }} />
                            </a>
                        </Tooltip>
                        <Tooltip title={"Eliminar"}>
                            <a href="#"
                               className="btn btn-default btn-xs"
                               onClick={() => confirmAlert({
                                title: 'Confirmar Eliminar',
                                message: 'Está seguro de eliminar Condición?',
                                buttons: [
                                    {
                                        label: 'Si',
                                        onClick: () => handleEliminar(row.row.id)
                                    },
                                    {
                                        label: 'No',
                                    }
                                ]
                            })}>
                                <i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} />
                            </a>
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            headerName: "ID",
            field: "id",
            width: 100,
        },
        {
            headerName: "Decripción",
            field: "desctipcion",
            width: 400,
        },
        {
            headerName: "Activo",
            field: "activo",
            width: 100,
        }
    ]);

    function handleShowAgregar(){
        setState({
            ...state,
            agregar: "Agregar",
        })
    }

    function handleShowModificar(id){
        console.log(id)
    }

    function handleEliminar(id){
        console.log(id)
    }

    const handleChange = (event) =>{
        console.log("change")
    };

    const handleAceptar = (event) => {
        console.log("submit")
    };

    const handleChangeActive = (event) =>{
        setState({
            ...state,
            active: event.target.value
        });
    };
    return(
        <div>
            <header className="topbar clearfix">
                <Cabecera titulo="Puesto" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Condiciones de eeception y entrega</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>
            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>
            {/*Leftbar End Here*/}
            <section className={"main-container"}>
                <div className={"container-fluid"}>
                    {/** TABS SUPERIORES*/}
                    <ul className={"nav navStatica nav-tabs"}>
                        <li className={'active'}>
                            <a data-toggle={"tab"} href={"#Listado"}>
                                <i className={"fa fa-list"}/> Listado
                            </a>
                        </li>
                        <li>
                            <a data-toggle={"tab"} href={"#Agregar"} onClick={handleShowAgregar}>
                                <i className={"fa fa-plus-circle"}/> {state.agregar}
                            </a>
                        </li>
                    </ul>
                    {/** TABLAS*/}
                    <div className={"row"} className={"tab-content"}>
                        <div className="widget-wrap" id="Listado" className="tab-pane fade in active">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                                        <DataGrid
                                            columns={columns}
                                            rows={data}
                                            localeText={dataGridLocaleText}
                                            density={"compact"}
                                            pageSize={Math.floor((state.height -310) / 30)}
                                            />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="widget-wrap" id="Agregar" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <form className="j-forms" onSubmit={handleAceptar}>
                                                <div className="form-content">
                                                    <div className="row">
                                                        <div className="col-xs-6 col-sm-3 col-md-2-5 col-lg-2-5 unit">
                                                            <div className="input">
                                                                <TextField variant="outlined" margin="dense" label="Descripción"
                                                                           onChange={handleChange}
                                                                           className="form-control"
                                                                           type="text"
                                                                           maxLength="50"
                                                                           required
                                                                           placeholder={state.descripcion}
                                                                           id="descripcion"
                                                                           maxLength="50"/>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6 col-md-2-5 unit">
                                                            <label className="input select">
                                                                <FormControl fullWidth variant="outlined" margin="dense">
                                                                    <InputLabel id="idActivoLabel">Activo</InputLabel>
                                                                    <Select
                                                                        label="Activo"
                                                                        labelId="idActivo"
                                                                        onChange={handleChangeActive}
                                                                        className="form-control"
                                                                        value={state.active}
                                                                        required
                                                                        name="idActivo"
                                                                        id="idActivo">
                                                                        <option value={0}>No</option>
                                                                        <option value={1}>Sí</option>
                                                                    </Select>
                                                                </FormControl>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-footer" className="col-sm-6 col-md-5 unit">
                                                            <button href="#Listado"
                                                                    role="tab"
                                                                    data-toggle="tab"
                                                                    data-layout="topCenter"
                                                                    data-type="information"
                                                                    className="btn btn-secondary secondary-btn"> Cancelar</button>
                                                            <button type="submit"
                                                                    className="btn btn-primary primary-btn">Aceptar</button>
                                                        </div>

                                                    </div>
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
        </div>
    )
}

export default CondicionesRecepcionEntrega;