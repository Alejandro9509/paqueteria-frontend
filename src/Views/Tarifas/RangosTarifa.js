import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import {DataGrid} from "@material-ui/data-grid";
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

    const columns = React.useMemo(() => [
        {
            headerName: "Medida",
            field: "unidadMedida",
            width: 150,
        },{
            headerName: "Minimo",
            field: "minimo",
            type:'number',
            width: 150,
        },{
            headerName: "Maximo",
            field: "maximo",
            type:'number',
            width: 150,
        },{
            headerName: "Importe",
            field: "importe",
            type:'number',
            width: 150,
            valueFormatter: ({value}) => currencyFormatter.format(Number(value)),
        },{
            headerName: "Calculo",
            field: "tipoCalculo",
            width: 150,
        },
        // !props.props.disabled &&
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
    ]);

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    /*const [concepto, setConcepto] = useState({
        id:Math.floor(Math.random() * 10000),
        importe: 0,
        rangoMinimo: 0,
        rangoMaximo: 0,
        idCalculo: null,
        idMedida: null,
    })
    const [state, setState] = useState({
        impuestos: [],
        ivaTraslada: [],
        ivaRetiene: [],
        tiposCalculo: [],
        columns: [],
        aplicaDescuento: false,
        aplicarDescuentoA: 'Concepto',
    })
    const [dialogRangos, setDialogRangos] = useState({
        showDialog: false,
        rango: {
            id:Math.floor(Math.random() * 10000),
            importe: 0,
            minimo: 0,
            maximo: 0,
            tipoCalculo: 0,
            tipoMedida: 0,
        },
        idViaje: null,
    })

    const resetPaquete = () =>{
        setConcepto(concepto => {
            return {
                ...concepto,
                id:Math.floor(Math.random() * 10000),
                importe: 0,
                rangoMinimo: 0,
                rangoMaximo: 0,
                idCalculo: null,
                idMedida: null,
            }
        })
    }

    const addPaquetev2 = (data) => {
        console.log(data)
        let paq = data

        const arraynew = []
        if (props.rows.find(item => item.id === data.id)){
            props.rows.forEach(item => {
                if (item.id === data.id){
                    item = data
                }
                arraynew.push(item)
            })
        }else{
            props.rows.push(paq);
            props.rows.forEach(item => {
                arraynew.push(item)
            })
        }
        props.onChangeList(arraynew)

    }*/

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
            <div className="row" style={{height: `${(props.rows.length * 20)+80}px` , width: "100%"}}>
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