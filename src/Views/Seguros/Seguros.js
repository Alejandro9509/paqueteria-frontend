import { IconButton, TextField, Tooltip } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import React, { useEffect, useState, useMemo } from "react";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import Cabecera from "../../Components/Template/Cabecera";
import RestartAltIcon from "@material-ui/icons/Refresh";
import Noty from 'noty';
import { dataGridLocaleText } from "../../Constants";
import SearchIcon from "@material-ui/icons/Search";
import { obtenerRemitentesDestinatariosPaginado } from '../../Util/Contexts/RemitenteDestinatarioContext';
function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}
    

let rowSelect
function Seguros() {
    const [data, setData] = React.useState([])
    const [state, setState] = React.useState({
        showPopUp: false,
        IdEmbalaje: 0,
        CodigoEmbalaje: undefined,
        NombreEmbalaje: "",
        DerechoBorrar: 87,
        DescripcionEmbalaje: "",
        agregar: "Agregar",
        height: window.innerHeight,
        CreadoPor: localStorage.getItem("UsuarioId"),
        ModificadoPor: localStorage.getItem("UsuarioId")
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
                            <a  onClick={()=>{}} className="btn btn-default btn-xs"
                          ><i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Editar seguro">
                            <a  className="btn btn-default btn-xs" onClick={()=>{}}><i className="fa fa-eye" style={{ color: "#F9A03E" }} /></a>

                        </Tooltip>
                        <Tooltip title="Cancelar">
                            <a href="#" className="btn btn-default btn-xs" onClick={()=>{}}
                           ><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>

                        </Tooltip>
                    </div>
                )
            }
        },
            {
              headerName: "No. Remitente / Destinatario",
              field: "m_nNumero",
              width: 150,
            },
            {
              headerName: "Nombre",
              field: "m_sNombre",
                width: 500,
            },
            {
                headerName: "Domicilio",
                field: "m_sDomicilio",
                width: 500,
              }

    ]);

    
    useEffect(value => {
        if (localStorage.getItem("UsuarioId") === null || localStorage.getItem("UsuarioId") <= 0) {
            showSuccess("Es necesario iniciar sesion para acceder a este proceso");
            window.location.replace("login");
            return;
        }
        cargarDesdeServidor(pagina,registros);
    }, [pagina,registros]);

    function cargarDesdeServidor(pagina,registros){
        return new obtenerRemitentesDestinatariosPaginado(pagina,registros, busqueda).then((respuesta)=>{
            setData(respuesta.data)
        })
      }
      function limpiarBuscador(pagina,registros){
        return new obtenerRemitentesDestinatariosPaginado(pagina,registros, "").then((respuesta)=>{
            setData(respuesta.data)
        })
      }
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
                <div style={{marginLeft:"65%"}}>
               
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
                                 getRowId={((row) => row.m_nNumero)}
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