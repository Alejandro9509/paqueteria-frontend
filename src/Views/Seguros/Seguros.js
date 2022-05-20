import { Dialog, DialogContent, IconButton, TextField, Tooltip } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import React, { useEffect, useState, useMemo } from "react";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import Cabecera from "../../Components/Template/Cabecera";
import RestartAltIcon from "@material-ui/icons/Refresh";
import Noty from 'noty';
import { dataGridLocaleText } from "../../Constants";
import SearchIcon from "@material-ui/icons/Search";
import { obtenerClientesPaginado, obtenerRemitentesDestinatariosPaginado } from '../../Util/Contexts/RemitenteDestinatarioContext';
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
    })
    const [pagina, setPagina] = React.useState(0);
    const [busqueda, setBusqueda] = React.useState("");
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
                            <a  onClick={()=>{handleClickModal()}} className="btn btn-default btn-xs"
                          ><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>

                    </div>
                )
            }
            },
            {
              headerName: "No. Cliente",
              field: "m_nNumeroCliente",
              width: 150,
            },
            {
              headerName: "Nombre",
              field: "m_sNombreFiscal",
                width: 500,
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
                width: 500,
              }

    ]);

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
        return new obtenerClientesPaginado(pagina,registros, busqueda).then((respuesta)=>{
            setData(respuesta.data)
        })
      }
      function limpiarBuscador(pagina,registros){
        return new obtenerClientesPaginado(pagina,registros, "").then((respuesta)=>{
            setData(respuesta.data)
        })
      }

      const dialogVisible = (isVisible) => {
        setState(() => ({
          ...state,
          openDialog: isVisible,
        }));
      };

      const handleClickModal = (event) => {
        setState({ ...state, openDialog: true });
      };
  return (
    <div>
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

        <Dialog
          open={state.openDialog}
          onClose={() => setState({ ...state, openDialog: false })}
          fullWidth
          maxWidth="md"
        >
          <DialogContent>
            <DialogAsignarSeguros
              dialogVisible={dialogVisible}
              openDialog={state.openDialog}
              idCliente={rowSelect}
              dataTiposSeguro={dataTiposSeguro}
              recargarClientes={()=>cargarDesdeServidor(pagina, registros)}
            />
          </DialogContent>
        </Dialog>
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
                <div style={{marginLeft:"55%"}}>
               
            <TextField
            variant="standard"
            value={busqueda}
            onChange={(e) => {e.stopPropagation();setBusqueda( e.target.value)}}
            placeholder
            onKeyDown={e => {if (e.code === "Enter" ) {
                cargarDesdeServidor(0, registros)
                setPagina(0)
            }}}
            style={{width:'60ch'}}
        />
         <IconButton aria-label="delete">  
                <SearchIcon style={{
                    color: "#F9A03E",
                    fontSize: 32,
                    paddingInlineEnd: 0,
                    paddingRight: 0,
                    paddingBlockEnd: 0,
                    paddingLeft: 0,
                    paddingBlock: 0,
                    marginRight: '10px'
                }} onClick={() => {
                    cargarDesdeServidor(0, registros)
                    setPagina(0)
                }} />
                  Buscar
                 </IconButton>
                 <IconButton aria-label="delete" onClick={() => {
                            setBusqueda("")
                            limpiarBuscador(0,registros);
                            setPagina(0)
                        }}>
                            <RestartAltIcon fontSize={"large"} style={{marginRight: '10px'}}/>
                            Limpiar filtros
                        </IconButton>
                </div>
            
                <div className="widget-content">
                    <div className="row" style={{ height: state.height - 250, width: '100%' }}>
                        {data.length != 0 ? (
                             <div style={{height: "500px", padding: "5px"}}>
                             <DataGrid
                                 localeText={dataGridLocaleText}
                                 columns={columns}
                                 rows={data}
                                 getRowId={((row) => row.m_nNumeroCliente)}
                                 onRowSelected={(row) => {
                                     rowSelect = row;
                                 }}
                                 pagination
                                 page={pagina}
                                 rowsPerPageOptions={[registros]}
                                 pageSize={registros}
                                 rowCount={13600}
                                 paginationMode="server"
                                 onPageChange={(newPage) => {
                                     setPagina(newPage.page)
                                     console.log(newPage)
                                 }}
                                 
                             />
                         </div>
                        ) : (
                            <div>No se encontró ningún registro</div>
                        )}
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
  )
}

export default Seguros