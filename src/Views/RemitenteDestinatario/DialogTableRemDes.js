import React, { useState, useEffect } from "react";
import Noty from "noty";
import { DataGrid } from "@material-ui/data-grid";
import { dataGridLocaleText } from "../../Constants";
import { Dialog, DialogActions, DialogContent } from "@material-ui/core";
import {obtenerRemitentesDestinatarios} from "../../Util/Contexts/RemitenteDestinatarioContext";
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

//----------------------------->Hooks useState <----------------------------------------------------------------------
const [rows, setRow] = useState([])
//----------------------------->Hooks useEffect <----------------------------------------------------------------------
useEffect(() => {
  
  getAllRemitentesDestinatarios()
}, [])
function getAllRemitentesDestinatarios() {
  obtenerRemitentesDestinatarios().then((respuesta) => {
     setRow(respuesta.data);
  });
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
                style={{color:'Primary'}}
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
