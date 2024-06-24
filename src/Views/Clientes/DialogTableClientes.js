import React, {useState, useEffect} from "react";
import Noty from "noty";
import {DataGrid} from "@mui/x-data-grid";
import {dataGridLocaleText} from "../../Constants";
import {DialogActions, TextField} from "@mui/material";
import {obtenerClientePaginado} from "../../Util/Contexts/ClientesContext";
import SearchIcon from "@mui/icons-material/Search";
import {styled} from '@mui/material/styles';


import makeStyles from '@mui/styles/makeStyles';


const PREFIX = 'DialogTableClientes';

const classes = {
    root: `${PREFIX}-root`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')({
    [`& .${classes.root}`]: {
        '& .MuiDataGrid-dataContainer': {
            minHeight: 'auto !important',
        },
    },
});

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

    let {dialogVisible, handlePatrocinadorSelected} = props

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

    let registros = 7
//----------------------------->Hooks useState <----------------------------------------------------------------------
    const [rows, setRow] = React.useState([])
    const [rowsCount, setRowCount] = React.useState(0)
    const [pagina, setPagina] = React.useState(0);
    const [busqueda, setBusqueda] = React.useState("");
//----------------------------->Hooks useEffect <----------------------------------------------------------------------
    useEffect(() => {
        cargarDesdeServidor(pagina, registros)
    }, [pagina])

//--------------------------->Funciones<----------------------------------------------------------------------
    function cargarDesdeServidor(pagina, registros) {
        obtenerClientePaginado(pagina, registros, busqueda).then((respuesta) => {
            setRow(respuesta.data.data)
            setRowCount(respuesta.data.total)
        })
    }

//----------------------------------------------Renderizado-------------------------------------------------
    return (
        (<Root>
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
                    onKeyDown={e => {
                        if (e.code === "Enter") {
                            cargarDesdeServidor(0, registros)
                            setPagina(0)
                        }
                    }}
                    style={{width: '60ch'}}
                />
                <div className={classes.root} style={{height: "300px", padding: "5px", marginBottom: 0}}>
                    <DataGrid
                        localeText={dataGridLocaleText}
                        columns={columns}
                        rows={rows}
                        getRowId={((row) => row.m_nIdCliente)}
                        onRowSelectionModelChange={(newRowSelectionModel, e) => {
                            console.log(newRowSelectionModel)
                            rowSelect = rows.find(i => i.m_nIdCliente === newRowSelectionModel[0])
                            console.log(rowSelect)
                        }}
                        page={pagina}
                        pagination
                        autoPageSize
                        pageSize={registros}
                        rowCount={rowsCount}
                        paginationMode="server"
                        onPaginationModelChange={(newPaginationModel) => {
                            setPagina(newPaginationModel.page)
                        }}
                    />
                </div>
                <DialogActions style={{justifyContent: "right"}}>
                    <button
                        onClick={() => {
                            dialogVisible(false)
                        }}
                        className="btn btn-secondary secondary-btn"
                    >
                        Cerrar
                    </button>
                    <button
                        onClick={() => {
                            if (rowSelect != null) {
                                handlePatrocinadorSelected(rowSelect)
                            }
                        }}
                        className="btn btn-primary primary-btn"
                    >
                        Seleccionar
                    </button>
                </DialogActions>
            </Root>
        ));
}

export default DialogTableClientes;