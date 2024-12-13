import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import {DataGrid} from "@mui/x-data-grid";
import {dataGridLocaleText} from "../../Constants";

export default function RangosTarifa(props) {

    /**Props
     * rows = Listado de rangos
     * onDeleteRow = funcion que se ejecuta cuando se quiere borrar un registro
     * onEditRow = funcion que se ejecuta cuando se quiere editar un registro
     * disabled = para indicar si es se deshabilitarán los campos
     * */
    function RowMenuCell(propss) {
        const { api, id } = propss;

        const handleEditClick = (event) => {
            event.stopPropagation();
            let row = props.rows.filter((p) => p.id === id)[0];
            handleEditConcepto(row);
        };

        const handleDeleteClick = (event) => {
            event.stopPropagation();
            let row = props.rows.filter((p) => p.id === id)[0];
            handleDeleteConcepto(row);
        };

        return (
            <div>
                <IconButton color="inherit" size="small" aria-label="delete" onClick={handleEditClick}>
                    <EditIcon fontSize="large" />
                </IconButton>
                <IconButton color="inherit" size="small" aria-label="delete" onClick={handleDeleteClick}>
                    <DeleteIcon fontSize="large" />
                </IconButton>
            </div>
        );
    }

    const columns = React.useMemo(() => {
        if (props.mode === 'PORCENTAJE') {
            return (
                [{
                    headerName: "Porcentaje",
                    field: "porcentaje",
                    width: 150,
                },
                    !props.disabled &&
                    {
                        field: 'complementos',
                        headerName: 'Acciones',
                        renderCell: RowMenuCell,
                        sortable: false,
                        width: 90,
                        headerAlign: 'center',
                        filterable: false,
                        align: 'center',
                        disableColumnMenu: true,
                        disableReorder: true,
                    }])
        } else {
            return ([
                props.seccionPadre === 'MANIOBRAS' &&
                {
                    headerName: "Maniobra",
                    field: "concepto",
                    width: 150,
                }, props.rows[0]?.unidadMedida === 'PORCIENTO' &&
                {
                    headerName: "Porcentaje",
                    field: "porcentaje",
                    width: 150,
                }, {
                    headerName: "Medida",
                    field: "unidadMedida",
                    width: 150,
                }, {
                    headerName: "Mínimo",
                    field: "minimo",
                    type: 'number',
                    width: 150,
                }, {
                    headerName: "Máximo",
                    field: "maximo",
                    type: 'number',
                    width: 150,
                }, {
                    headerName: "Importe",
                    field: "importe",
                    type: 'number',
                    width: 150,
                    valueFormatter: ({value}) => currencyFormatter.format(Number(value)),
                }, {
                    headerName: "Cálculo",
                    field: "tipoCalculo",
                    width: 150,
                },
                !props.disabled &&
                {
                    field: 'complementos',
                    headerName: 'Acciones',
                    renderCell: RowMenuCell,
                    sortable: false,
                    width: 90,
                    headerAlign: 'center',
                    filterable: false,
                    align: 'center',
                    disableColumnMenu: true,
                    disableReorder: true,
                }
            ])
        }
    });

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    /**Reacciona al hacer clic en editar concepto*/
    const handleEditConcepto = (data) =>{
        if(!props.disabled){
            props.onEditRow(data)
        }

    }

    /**Reacciona al hacer clic en eliminar concepto*/
    const handleDeleteConcepto = (data) =>{
        if(!props.disabled){
            props.onDeleteRow(data)
        }
    }

    return(
        <div>
            <div className="row" style={{height: `${(props.rows.length * 40)+80}px` , width: "100%"}}>
                <DataGrid
                    localeText={dataGridLocaleText}
                    density="compact"
                    columns={columns}
                    rows={props.rows}
                    hideFooter
                    getRowId={(row) => row.id}
                    // onRowSelected={(row) => handleRowClick(row.data)}
                />
            </div>
        </div>
    )
}