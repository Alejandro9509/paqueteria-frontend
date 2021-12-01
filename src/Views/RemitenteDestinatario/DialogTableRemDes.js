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
    let {dialogVisible,openDialog,handleChangeAutoCompleteRemitenteDestinatario} = props

//----------------------------->Atributos<----------------------------------------------------------------------------
const columns = [
    {
      headerName: "No.Cliente",
      field: "m_nNumero",
      width: 125,
    },
    {
      headerName: "Nombre",
      field: "m_sNombre",
      flex: 1,
    },
    {
        headerName: "Domicilio",
        field: "m_sDomicilio",
        flex: 1,
      },
  ]
let rowSelect
let registros=20
//----------------------------->Hooks useState <----------------------------------------------------------------------
const [rows, setRow] = useState([])
const [pagina, setPagina] = React.useState(0);
    const [busqueda, setBusqueda] = React.useState("");
//----------------------------->Hooks useEffect <----------------------------------------------------------------------
useEffect(() => {
  cargarDesdeServidor(pagina.page,registros)
}, [pagina])

//--------------------------->Funciones<----------------------------------------------------------------------
function cargarDesdeServidor(pagina,registros){
  return new obtenerRemitentesDestinatariosPaginado(pagina,registros, busqueda).then((respuesta)=>{
    setRow(respuesta.data)
    console.log(respuesta.data)
  })
}

//----------------------------------------------Renderizado-------------------------------------------------
  return (
    <div>
        <TextField
            variant="standard"
            value={busqueda}
            onChange={(e) => setBusqueda( e.target.value)}
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
                    cursor:"pointer"
                }} onClick={() => cargarDesdeServidor(pagina, registros)}/>,
            }}
            style={{width:'60ch'}}
        />
        <div style={{height:"300px", padding:"5px"}}>
           <DataGrid
           localeText={dataGridLocaleText}
           columns={columns}
           rows={rows}
           getRowId={ ((row)=> row.m_nNumero)}
           onRowSelected={(row) => {
           rowSelect = row;
          }}
          pagination
          pageSize={registros}
          rowCount={13600}
          paginationMode="server"
          onPageChange={(newPage)=>{setPagina(newPage)
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
