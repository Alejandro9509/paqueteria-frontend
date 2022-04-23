import React, { useState, useEffect } from "react";
import Noty from "noty";
import { DataGrid } from "@material-ui/data-grid";
import { dataGridLocaleText } from "../../Constants";
import { DialogActions, TextField } from "@material-ui/core";
import {obtenerClientePaginado} from "../../Util/Contexts/ClientesContext";
import SearchIcon from "@material-ui/icons/Search";
//---------------------------->funcion para mostrar un mensaje<-----------------------------------------------------
function showSuccess(mensaje) {
  new Noty({
    type: "information",
    layout: "topCenter",
    text: mensaje,
    timeout: "3000",
  }).show();
}
let rowSelect
function DialogTableClientes(props) {
    let {dialogVisible,handlePatrocinadorSelected} = props

//----------------------------->Atributos<----------------------------------------------------------------------------
const columns = [
    {
      headerName: "Num. Cliente",
      field: "m_nNumeroCliente",
      width: 125,
    },
    {
      headerName: "Nombre",
      field: "m_sNombreFiscal",
      flex: 1,
    },
    {
        headerName: "RFC",
        field: "m_sRFC",
        flex: 1,
      },
  ]

let registros=7
//----------------------------->Hooks useState <----------------------------------------------------------------------
const [rows, setRow] = React.useState([])
const [pagina, setPagina] = React.useState(0);
const [busqueda, setBusqueda] = React.useState("");
//----------------------------->Hooks useEffect <----------------------------------------------------------------------
useEffect(() => {
  cargarDesdeServidor(pagina,registros)
}, [pagina])

//--------------------------->Funciones<----------------------------------------------------------------------
function cargarDesdeServidor(pagina,registros){
  return new obtenerClientePaginado(pagina,registros,busqueda).then((respuesta) => {
    setRow(respuesta.data)

  })
}

//----------------------------------------------Renderizado-------------------------------------------------
  return (
    <>
        <TextField
            variant="standard"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}

            InputProps={{
                endAdornment: <SearchIcon style={{
                    color: "#F9A03E",
                    fontSize: 32,
                    paddingInlineEnd: 0,
                    paddingRight: 0,
                    paddingBlockEnd: 0,
                    paddingLeft: 0,
                    paddingBlock: 0,
                    cursor: "pointer"
                }} onClick={() => {
                    cargarDesdeServidor(0, registros)
                    setPagina(0)
                }}/>,
            }}
            onKeyDown={e => {if (e.code === "Enter" ) {
                cargarDesdeServidor(0, registros)
                setPagina(0)
            }}}
            style={{width: '60ch'}}
        />
        <div style={{height:"300px", padding:"5px"}}>
            <DataGrid
                localeText={dataGridLocaleText}
                columns={columns}
                rows={rows}
                getRowId={((row) => row.m_nIdCliente)}
                onRowSelected={(row) => {
                    rowSelect = row;
                }}
                page={pagina}
                pagination
                pageSize={registros}
                rowCount={3600}
                paginationMode="server"
                onPageChange={(newPage) => {
                    setPagina(newPage.page)
                    console.log(newPage)
                }}
            />
        </div>
        <DialogActions style={{justifyContent: "rigth"}}>
                   <button
                    onClick={() => {
                        dialogVisible(false)}}
                    className="btn btn-secondary secondary-btn"
                >
                    Cerrar
                </button>
                <button
                    onClick={() => {
                        if(rowSelect !=null){
                            handlePatrocinadorSelected(rowSelect)}
                        }}
                    className="btn btn-primary primary-btn"
                >
                    Seleccionar
                </button>
            </DialogActions>
    </>
  );
}

export default DialogTableClientes;