import React, { useState, useEffect } from "react";
import Noty from "noty";
import { DataGrid } from "@material-ui/data-grid";
import { dataGridLocaleText } from "../../Constants";
import {Dialog, DialogActions, DialogContent, TextField} from "@material-ui/core";
import {obtenerRemitentesDestinatarios,obtenerRemitentesDestinatariosPaginado} from "../../Util/Contexts/RemitenteDestinatarioContext";
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

function DialogTableRemDes(props) {
    let {dialogVisible,handleChangeAutoCompleteRemitenteDestinatario} = props

//----------------------------->Atributos<----------------------------------------------------------------------------
const columns = [
    {
      headerName: "No. Remitente / Destinatario",
      field: "m_nNumero",
      width: 150,
    },
    {
      headerName: "Nombre",
      field: "m_sNombre",
        width: 300,
    },
    {
        headerName: "Domicilio",
        field: "m_sDomicilio",
        width: 500,
      },
  ]
let rowSelect
let registros=10
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
  return new obtenerRemitentesDestinatariosPaginado(pagina,registros, busqueda).then((respuesta)=>{
    setRow(respuesta.data)
  })
}

//----------------------------------------------Renderizado-------------------------------------------------
  return (
    <div>
        <TextField
            variant="standard"
            value={busqueda}
            onChange={(e) => {e.stopPropagation();setBusqueda( e.target.value)}}
            placeholder
            InputProps={{
                endAdornment: <SearchIcon style={{
                    color: "#F9A03E",
                    fontSize: 32,
                    paddingInlineEnd: 0,
                    paddingRight: 0,
                    paddingBlockEnd: 0,
                    paddingLeft: 0,
                    paddingBlock: 0,
                }} onClick={() => cargarDesdeServidor(0,registros)}/>,
            }}
            style={{width:'60ch'}}
        />
        <div style={{height:"500px", padding:"5px"}}>
           <DataGrid
           localeText={dataGridLocaleText}
           columns={columns}
           rows={rows}
           getRowId={ ((row)=> row.m_nNumero)}
           onRowSelected={(row) => {
           rowSelect = row;
          }}
          pagination
           rowsPerPageOptions={[registros]}
          pageSize={registros}
          rowCount={13600}
          paginationMode="server"
          onPageChange={(newPage)=>{setPagina(newPage.page)
          console.log(newPage)}}
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
                          handleChangeAutoCompleteRemitenteDestinatario(rowSelect);}
                        }}
                    className="btn btn-primary primary-btn"
                >
                    Seleccionar
                </button>
            </DialogActions>
    </div>
  );
}

export default DialogTableRemDes;
