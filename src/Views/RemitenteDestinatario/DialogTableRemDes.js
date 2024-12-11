import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { dataGridLocaleText } from "../../Constants";
import {Button, Dialog, DialogActions, DialogContent, TextField} from "@mui/material";
import {obtenerRemitentesDestinatariosPaginado} from "../../Util/Contexts/RemitenteDestinatarioContext";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from '@mui/material/styles';

import {validarDerecho} from "../../Util/Util";

const PREFIX = 'DialogTableRemDes';

const classes = {
    root: `${PREFIX}-root`
};

const Root = styled('div')({
    [`& .${classes.root}`]: {
        '& .MuiDataGrid-dataContainer': {
            minHeight: 'auto !important',
        },
        '& .MuiDataGrid-row': {
            minHeight: 'auto !important',
        },
        '& .MuiDataGrid-cell': {
            minHeight: 'auto !important',
        }
    },
});

//---------------------------->funcion para mostrar un mensaje<-----------------------------------------------------
let rowSelect;

function DialogTableRemDes(props) {

    let {dialogVisible,handleChangeAutoCompleteRemitenteDestinatario,handleCrearRemitente} = props

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
            width: 500,
        },
        {
            headerName: "Domicilio",
            field: "m_sDomicilio",
            width: 500,
        }
    ]
    let registros=10
    //----------------------------->Hooks useState <----------------------------------------------------------------------
    const [rows, setRow] = useState([])
    const [pagina, setPagina] = useState(0);
    const [busqueda, setBusqueda] = useState("");
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
        <Root>
            <DialogActions style={{justifyContent: "left"}}>
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
                    }} onClick={() => {
                    cargarDesdeServidor(0, registros)
                    setPagina(0)
                    }}/>,
                    }}
                    onKeyDown={e => {if (e.code === "Enter" ) {
                        cargarDesdeServidor(0, registros)
                        setPagina(0)
                    }}}
                    style={{width:'60ch'}}
                    />
                <Button fullWidth
                    color={"primary"}
                    variant={"contained"}
                    style={{width:'70ch'}}
                    type="submit"
                    disabled={!validarDerecho(9101470)}
                    onClick={() => {
                    handleCrearRemitente();
                    }}>
                    Nuevo Remitente / Destinatario
                </Button>
            </DialogActions>
            <div className={classes.root} style={{height: "400px", padding: "5px"}}>
                <DataGrid
                    localeText={dataGridLocaleText}
                    columns={columns}
                    rows={rows}
                    getRowId={((row) => row.m_nNumero)}
                    onRowSelectionModelChange={(newRowSelectionModel,e) => {
                        if(newRowSelectionModel.length<1)
                            return;
                        rowSelect=rows.find(i=>i.m_nNumeroCliente==newRowSelectionModel[0]);
                    }}
                    autoPageSize
                    pagination
                    page={pagina}
                    rowsPerPageOptions={[]}
                    pageSize={registros}
                    rowCount={13600}
                    paginationMode="server"
                    onPaginationModelChange={(newPaginationModel)=>{
                        setPagina(newPaginationModel.page)
                    }}
                />
            </div>
            <DialogActions style={{justifyContent: "right"}}>
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
                            handleChangeAutoCompleteRemitenteDestinatario(rowSelect);
                        }
                    }}
                    className="btn btn-primary primary-btn"
                >
                    Seleccionar
                </button>
            </DialogActions>
        </Root>
    );
}

export default DialogTableRemDes;