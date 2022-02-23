import React, {useEffect, useState} from "react";
import DialogoNuevoRango from "./DialogoNuevoRango";
import {Button, Grid} from "@material-ui/core";
import RangosTarifa from "./RangosTarifa";


export default function Maniobras(props){
    const [state, setState] = useState({
        rangos:props.rangos || []
    })
    const [dialogRangos, setDialogRangos] = useState({
        showDialog: false,
        selection: null,
        isEdit: false
    })

    useEffect(value => {
        props.handleChangeManiobras(state.rangos)
    }, [state])

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
            newRangos = state.rangos.filter(i => i.id !== rango.id)
            newRangos.push(rango)
        }else{
            state.rangos.forEach(i => newRangos.push(i))
            newRangos.push(rango)
        }
        setState({
            ...state,
            rangos: newRangos
        })

        setDialogRangos({
            ...dialogRangos,
            showDialog: false,
            idViaje: null,
            selection: null,
            isEdit: false
        })
    }

    const handleOnDeleteRow = (row) => {
        setState({
            ...state,
            rangos: state.rangos.filter(i => i.id !== row.id)
        })
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
        setState({
            ...state,
            rangos: newRangos
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

                />
            }
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <RangosTarifa
                        rows={props.rangos}
                        onEditRow={handleOnEditRow}
                        onDeleteRow={handleOnDeleteRow}
                        onChangeList={handleChangeRangosViaje}
                        disabled={false}
                        seccionPadre={'MANIOBRAS'}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button fullWidth variant={"contained"} color={"primary"} onClick={() => handleShowDialogRangos(true)}>
                        Rangos
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}