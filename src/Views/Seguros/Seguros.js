import { Dialog, DialogContent, IconButton, TextField, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from "react";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import Cabecera from "../../Components/Template/Cabecera";
import RestartAltIcon from "@mui/icons-material/Refresh";
import Noty from 'noty';
import { dataGridLocaleText } from "../../Constants";
import SearchIcon from "@mui/icons-material/Search";
import { obtenerClientesPaginado } from '../../Util/Contexts/RemitenteDestinatarioContext';
import DialogAsignarSeguros from './DialogAsignarSeguros';
import axios from "axios";
import {API_HEADERS} from "../../Constants";

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

let rowSelect
const headers = API_HEADERS

function Seguros() {
    const [data, setData] = React.useState([])
    const [dataTiposSeguro, setDataTiposSeguro] = useState([])
    const [state, setState] = React.useState({
        idCliente: 0,  
        height: window.innerHeight,
        openDialog: false,
        busqueda:""
    })
    const [total, setTotal] = React.useState(0);
    const [pagina, setPagina] = React.useState(0);
    let registros=10

    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            sortable: false, filterable: false,
            field: "",
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Asignar seguro">
                            <IconButton component="span" onClick={(e)=>{openDialog(row)}} size="large">
                                <i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                );
            }
        },
        {
          headerName: "No. Cliente",
          field: "m_nNumeroCliente",
          width: 100,
        },
        {
          headerName: "Nombre",
          field: "m_sNombreFiscal",
            width: 350,
        },
        {
            headerName: "Tipo de seguro",
            field: "m_sTipoSeguro",
            renderCell: (row) => {
                return (
                    <>
                        { row.row.m_sTipoSeguro}
                    </>
                )
            },
            width: 250,
        },
        {
            headerName: "Aseguradora",
            field: "m_sAseguradora",
            width: 250,
        },
        {
            headerName: "Póliza",
            field: "m_sPoliza",
            width: 250,
        }
    ]);

    function openDialog(row){
        handleClickModal(row.row)
    }

    async function getAllTiposSeguro() {
        axios.get(`${process.env.REACT_APP_REPORT_URL}/api/TipoSeguros/GetListado`, {headers}).then(({data}) => {
            setDataTiposSeguro(data)
        })
    }

    useEffect(value => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        cargarDesdeServidor(pagina,registros);
    }, [pagina,registros]);

    useEffect(() => {
        getAllTiposSeguro()
    }, [1])

    function cargarDesdeServidor(pagina,registros){
        obtenerClientesPaginado(pagina,registros, state.busqueda).then((respuesta)=>{
            setTotal(respuesta.data.total);
            setData(respuesta.data.data)
        })
      }

    function limpiarBuscador(pagina,registros){
        obtenerClientesPaginado(pagina,registros, "").then((respuesta)=>{
            setData(respuesta.data.data)
            setTotal(respuesta.data.total);
        })
    }

    const dialogVisible = (isVisible) => {
        setState(() => ({
          ...state,
          openDialog: isVisible,
        }));
      };

    function handleBusquedaChange(e){
        e.preventDefault();
        setState({...state, busqueda: e.target.value})
    }

    const handleClickModal = (row) => {
        setState({ ...state, openDialog: true, select: row });
    };

    return (
        <div>
            {
                state.openDialog &&
                <Dialog
                  open={state.openDialog}
                  onClose={(e) => {e.preventDefault();setState({ ...state, openDialog: false })}}
                  fullWidth
                  maxWidth="md"
                >
                    <DialogContent>
                        <DialogAsignarSeguros
                            dialogVisible={dialogVisible}
                            openDialog={state.openDialog}
                            idCliente={rowSelect}
                            select={state.select}
                            dataTiposSeguro={dataTiposSeguro}
                            recargarClientes={()=>cargarDesdeServidor(pagina, registros)}
                        />
                    </DialogContent>
                </Dialog>
            }

            <header className="topbar clearfix">
                <Cabecera titulo="Seguros" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Seguros</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>

            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>
            {/*Leftbar End Here*/}
            <section className="main-container">
                <div className="container-fluid">
                    <ul className="nav navStatica nav-tabs">
                        <li className="active">
                            <a>
                                <i className="fa fa-list" /> Listado
                            </a>
                        </li>
                    </ul>

                    <div className="row" className="tab-content">
                        <div className="widget-wrap" id="Listado" className="tab-pane fade in show">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div style={{marginLeft:"1%"}}>
                                        <TextField
                                            id={"search_client"}
                                            name={"search_client"}
                                            key={"search_client"}
                                            variant="standard"
                                            value={state.busqueda}
                                            onChange={handleBusquedaChange}
                                            style={{width:'60ch'}}
                                        />
                                        <IconButton
                                            aria-label="delete"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                cargarDesdeServidor(0, registros)
                                                setPagina(0)
                                            }}
                                            size="large">
                                        <SearchIcon style={{
                                            color: "#F9A03E",
                                            fontSize: 32,
                                            paddingInlineEnd: 0,
                                            paddingRight: 0,
                                            paddingBlockEnd: 0,
                                            paddingLeft: 0,
                                            paddingBlock: 0,
                                            marginRight: '10px'
                                            }}  />
                                            Buscar
                                        </IconButton>
                                        <IconButton
                                            aria-label="delete"
                                            onClick={(e) => {
                                            e.preventDefault();
                                            setState({...state,busqueda:""})
                                            limpiarBuscador(0,registros);
                                            setPagina(0)
                                            }}
                                            size="large"
                                        >
                                            <RestartAltIcon fontSize={"large"} style={{marginRight: '10px'}}/>
                                            Limpiar filtros
                                        </IconButton>
                                    </div>
                                    <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                                        {data.length !== 0 ?
                                            (
                                                <div style={{height: "500px", padding: "5px"}}>
                                                    <DataGrid
                                                        localeText={dataGridLocaleText}
                                                        columns={columns}
                                                        rows={data}
                                                        getRowId={((row) => row.m_nNumeroCliente)}
                                                        onRowSelectionModelChange={(newModel)=>{
                                                            if(newModel.length<1)
                                                                return rowSelect=data.find(i=>i.m_nNumeroCliente==newModel[0])
                                                        }}
                                                        /*onRowSelected={(row) => {
                                                        rowSelect = row;
                                                        }}*/
                                                        pagination
                                                        page={pagina}
                                                        rowsPerPageOptions={[]}
                                                        initialState={{
                                                            pagination: {
                                                                paginationModel: {
                                                                    pageSize: registros,
                                                                },
                                                            },
                                                        }}
                                                        rowCount={total}
                                                        paginationMode="server"
                                                        onPaginationModelChange={(newPage)=>{
                                                            setPagina(newPage.page)
                                                        }}
                                                    />
                                                </div>
                                            ) :
                                            (
                                                <div>No se encontró ningún registro</div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="widget-wrap" id="Agregar" className="tab-pane fade">
                            <div className="widget-wrap">
                                <div className="widget-content">
                                    <div className="row">
                                      <div className="col-md-12">
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}

export default Seguros