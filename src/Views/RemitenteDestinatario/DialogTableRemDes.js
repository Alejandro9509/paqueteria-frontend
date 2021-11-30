import React, { useState, useEffect } from "react";
import Noty from "noty";
import { DataGrid } from "@material-ui/data-grid";
import { dataGridLocaleText } from "../../Constants";
import { Dialog, DialogActions, DialogContent } from "@material-ui/core";
import {obtenerRemitentesDestinatarios,obtenerRemitentesDestinatariosPaginado} from "../../Util/Contexts/RemitenteDestinatarioContext";
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
let registros=7
//----------------------------->Hooks useState <----------------------------------------------------------------------
const [rows, setRow] = useState([])
const [pagina, setPagina] = React.useState(0);
//----------------------------->Hooks useEffect <----------------------------------------------------------------------
useEffect(() => {
  cargarDesdeServidor(pagina.page,registros)
}, [pagina])

//--------------------------->Funciones<----------------------------------------------------------------------
function cargarDesdeServidor(pagina,registros){
  return new obtenerRemitentesDestinatariosPaginado(pagina,registros).then((respuesta)=>{
    setRow(respuesta.data)
    console.log(respuesta.data)
  })
}

//----------------------------------------------Renderizado-------------------------------------------------
  return (
    <>
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
          rowCount={3600}
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
                        dialogVisible(false)}}
                    className="btn btn-secondary secondary-btn"
                >
                    Seleccionar
                </button>
            </DialogActions>
    </>
  );
}

export default DialogTableRemDes;
