import {dataGridLocaleText} from "../../Constants";
import {DataGrid} from '@mui/x-data-grid';
import React from "react";
import {Tooltip} from "@mui/material";

export default function PlantillasImportacionTarifasListado(props){
    const columns = React.useMemo(() => [
        {
            headerName: "Acciones",
            sortable: false, filterable: false,
            field: "",
            renderCell: (row) => {
                return (
                    <div>
                        <Tooltip title="Modificar">
                            <a className="btn btn-default btn-xs" onClick={() => props.onConsultarRowClick(row.row)}>
                                <i className="fa fa-pencil-square-o" style={{ color: "#F9A03E" }} />
                            </a>
                        </Tooltip>
                        <Tooltip title="Consultar">
                            <a className="btn btn-default btn-xs" onClick={() => props.onConsultarRowClick(row.row)}>
                                <i className="fa fa-eye" style={{color: "#F9A03E"}}/>
                            </a>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <a className="btn btn-default btn-xs" onClick={() => props.onEliminarRowClick(row.row)}>
                                <i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} />
                            </a>
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            headerName: "Cliente",
            field: "nombreCliente",
            width: 300,
        }, {
            headerName: "Nombre archivo",
            field: "archivoNombre",
            width: 300,
        }

    ]);

    return(
        <div>
            <div className="widget-wrap">
                <div className="widget-content">
                    <div className="row" style={{ height: window.innerHeight - 250, width: '100%' }}>
                        <DataGrid
                            localeText={dataGridLocaleText}
                            rows={props.listado}
                            columns={columns}
                            density="compact"
                            pageSize={Math.floor((window.innerHeight - 310) / 30)}
                            getRowId={(row) => row.idPlantilla}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}