import React, {useEffect, useState} from "react";
import DialogoNuevoRango from "./DialogoNuevoRango";
import {Button, Grid} from "@mui/material";
import RangosTarifa from "./RangosTarifa";
import AddIcon from "@mui/icons-material/AddBox";
import DialogTransferList from "./DialogTransferList";

/**PROPS
 * rangos array = listado de rangos a mostrar en datagrid
 * handleChangeManiobras = funcion que recibe los registros de rangos actualizados
 * conceptosListado array = listado de conceptos de facturacion
 * tiposCalculoListado = array de tipos de calculo
 * unidadesMedidaListado = array de unidades de medida
 * */
export default function Maniobras(props){

    const [dialogRangos, setDialogRangos] = useState({
        showDialog: false,
        selection: null,
        isEdit: false
    })

    const [dialogProdutos, setDialogProdutos] = useState({
        showDialog: false,
        selection: [],
    })

    const [state, setState] = useState({
        productos: [],
        rangoSeleccionado: null
    })

    const handleShowDialogRangos = (show) => {
        if (show){
            setDialogRangos({
                ...dialogRangos,
                showDialog: show,
            })
        }else {
            setDialogRangos({
                ...dialogRangos,
                showDialog: false,
                selection: null,
                isEdit: false
            })
        }
    }

    const handleConfirmRangos = (rango) => {
        let newRangos = []
        if (dialogRangos.isEdit){
            newRangos = props.rangos.filter(i => i.id !== rango.id)
            newRangos.push(rango)
        }else{
            props.rangos.forEach(i => newRangos.push(i))
            newRangos.push(rango)
        }
        props.handleChangeManiobras(newRangos)

        setDialogRangos({
            ...dialogRangos,
            showDialog: false,
            idViaje: null,
            selection: null,
            isEdit: false
        })
    }

    const handleOnDeleteRow = (row) => {
        props.handleChangeManiobras(props.rangos.filter(i => i.id !== row.id))
    }

    const handleOnEditRow = (row) => {
        setDialogRangos({
            ...dialogRangos,
            showDialog: true,
            selection: row,
            isEdit: true
        })
    }

    const handleChangeRangosViaje = (newRangos) => {
        props.handleChangeManiobras(newRangos)
    }

    const handleShowDialogProductos = (row) => {
        setDialogProdutos({
            ...dialogProdutos,
            showDialog: true,
            selection: row.productos
        })
        setState({
            ...state,
            rangoSeleccionado: row
        })
    }

    const showDialogProductos = (show) => {
        if (show){
            setDialogProdutos({
                ...dialogProdutos,
                showDialog: show,
                selection: state.productos
            })
        }else {
            setDialogProdutos({
                ...dialogProdutos,
                showDialog: show,
                selection: []
            })
        }
    }

    const handleConfirmProductos = (productosSeleccion) => {
        state.rangoSeleccionado.productos = productosSeleccion.map(item => ({
            idTarifa: 0,
            idConceptoFacturacion: state.rangoSeleccionado.idConcepto,
            idProducto: item.m_nIdProducto,
            m_nIdProducto: item.IdProducto || item.m_nIdProducto,
            numeroDescripcion: item.numeroDescripcion,
            m_sDescripcion: item.m_sDescripcion
        }));
        let newRangos = [];
        newRangos = props.rangos.filter(i => i.id !== state.rangoSeleccionado.id)
        newRangos.push(state.rangoSeleccionado)

        setState({
            ...state,
            productos: productosSeleccion,
            rangoSeleccionado: null
        })
        setDialogProdutos({
            ...dialogProdutos,
            showDialog: false,
            selection: []
        })
    }

    return(
        <div>
            {
                dialogRangos.showDialog &&
                <DialogoNuevoRango
                    handleOnConfirmData={handleConfirmRangos}
                    rango={dialogRangos.selection}
                    conceptosListado={props.conceptosListado}
                    tiposCalculoListado={props.tiposCalculoListado}
                    unidadesMedidaListado={props.unidadesMedidaListado}
                    handleShowDialog={handleShowDialogRangos}
                    openDialog={dialogRangos.showDialog}
                    seccionPadre={'MANIOBRAS'}
                    rows={props.rangos}

                />
            }
            {
                dialogProdutos.showDialog &&
                <DialogTransferList
                    handleShowDialog={showDialogProductos}
                    handleOnConfirmSelection={handleConfirmProductos}
                    openDialog={dialogProdutos.showDialog}
                    selection={dialogProdutos.selection}
                    rows={props.productosListado}
                    columns={dialogProdutos.columns}
                    disabled={props.disabled}
                />
            }
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <RangosTarifa
                        rows={props.rangos}
                        onEditRow={handleOnEditRow}
                        onDeleteRow={handleOnDeleteRow}
                        onChangeList={handleChangeRangosViaje}
                        disabled={props.disabled}
                        seccionPadre={'MANIOBRAS'}
                        handleShowDialogProductos={handleShowDialogProductos}
                        conceptoConfiguradoManiobras={props.conceptoConfiguradoManiobras}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button fullWidth variant={"contained"} style={{fontSize:"1em"}} color={"primary"}
                            onClick={() => handleShowDialogRangos(true)} disabled={props.disabled}>
                        <AddIcon fontSize={'large'} />
                        &nbsp;&nbsp;Agregar Rangos
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}