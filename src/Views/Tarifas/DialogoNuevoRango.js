import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, MenuItem, TextField} from "@material-ui/core";
import {DataGrid} from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import Grid from "@material-ui/core/Grid";


export default function DialogoNuevoRango(props) {
    /** Props
     * handleShowDialog() - Controla si se abre o cierra el dialogo.
     * handleOnConfirmData() - Retorna al padre los items seleccionados.
     * openDialog Boolean - Controla si se abre o cierra el dialogo
     * rango object - rango a modificar
     * tiposCalculoListado - Listado de tipos de calculo xd
     * unidadesMedidaListado - Listado de unidades de medida xd
     * */
    const [state, setState] = useState({
        height: window.innerHeight,
    })

    const [rango, setRango] = useState({
        id: props.rango?.id || Math.floor(Math.random() * 10000),
        idConcepto: props.rango?.idConcepto || null,
        concepto: props.rango?.concepto || '',
        importe: props.rango?.importe || 0,
        minimo: props.rango?.minimo || 0,
        maximo: props.rango?.maximo || 0,
        idTipoCalculo: props.rango?.idTipoCalculo || null,
        idUnidadMedida: props.rango?.idUnidadMedida || null,
        tipoCalculo: props.rango?.tipoCalculo || '',
        unidadMedida: props.rango?.unidadMedida || '',
    })

    const handleShowDialog = () => {
        props.handleShowDialog(null, false)
    }
    const handleConfirmSelection = () => {
        props.handleOnConfirmData(rango)
    }
    const handleOnDataChange = (event) => {
        if (event.target.name === 'idUnidadMedida'){
            setRango({
                ...rango,
                [event.target.name]: event.target.value,
                unidadMedida: props.unidadesMedidaListado.find(i => i.IdUnidadMedida == event.target.value).UnidadMedida
            })
        }else if (event.target.name === 'idTipoCalculo'){
            setRango({
                ...rango,
                [event.target.name]: event.target.value,
                tipoCalculo: props.tiposCalculoListado.find(i => i.m_nIdTarifaTipoCalculo == event.target.value).m_sTarifaTipoCalculo
            })
        }else if (event.target.name === 'idConcepto'){
            setRango({
                ...rango,
                [event.target.name]: event.target.value,
                concepto: props.conceptosListado.find(i => i.m_nIdConceptosFacturacion == event.target.value).m_sConcepto
            })
        }else{
            setRango({
                ...rango,
                [event.target.name]: event.target.value
            })
        }
    }

    return(
        <Dialog
            fullWidth={true}
            maxWidth={'sm'}
            open={props.openDialog}
            onClose={handleShowDialog}
            aria-labelledby="max-width-dialog-title"
        >
            <DialogContent>
                <Grid container spacing={1}>
                    {
                        props.seccionPadre === 'MANIOBRAS' &&
                        <Grid item xs={12}>
                            <TextField
                                id="idConcepto"
                                select
                                label="Maniobra"
                                value={rango.idConcepto}
                                onChange={handleOnDataChange}
                                name="idConcepto"
                                variant="outlined"
                                margin={"dense"}
                            >
                                {props.conceptosListado.map((option) => (
                                    <MenuItem key={option.m_nIdConceptosFacturacion} value={option.m_nIdConceptosFacturacion}>
                                        {option.m_sConcepto}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    }
                    <Grid item xs={12}>
                        <TextField
                            id="idUnidadMedida"
                            select
                            label="Unidad de medida"
                            value={rango.idUnidadMedida}
                            onChange={handleOnDataChange}
                            name="idUnidadMedida"
                            variant="outlined"
                            margin={"dense"}
                        >
                            {props.unidadesMedidaListado.map((option) => (
                                <MenuItem key={option.IdUnidadMedida} value={option.IdUnidadMedida}>
                                    {option.UnidadMedida}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField variant="outlined" margin="dense"
                                   onChange={handleOnDataChange}
                                   type="number"
                                   label="Mínimo"
                                   style={{textAlign: "right"}}
                                   step="1"
                                   min="0"
                                   value={rango.minimo}
                                   name="minimo"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField variant="outlined" margin="dense"
                                   onChange={handleOnDataChange}
                                   type="number"
                                   label="Máximo"
                                   style={{textAlign: "right"}}
                                   step="1"
                                   min="0"
                                   value={rango.maximo}
                                   name="maximo"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField variant="outlined" margin="dense"
                                   onChange={handleOnDataChange}
                                   type="number"
                                   label="Importe"
                                   style={{textAlign: "right"}}
                                   step="1"
                                   min="0"
                                   value={rango.importe}
                                   name="importe"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="idTipoCalculo"
                            select
                            label="Calculo"
                            value={rango.idTipoCalculo}
                            onChange={handleOnDataChange}
                            name="idTipoCalculo"
                            variant="outlined"
                            margin={"dense"}
                        >
                            {props.tiposCalculoListado.map((option) => (
                                <MenuItem key={option.m_nIdTarifaTipoCalculo} value={option.m_nIdTarifaTipoCalculo}>
                                    {option.m_sTarifaTipoCalculo}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleShowDialog} color="primary">
                    Close
                </Button>
                <Button onClick={handleConfirmSelection} color="primary" autoFocus>
                    Aceptar
                </Button>

            </DialogActions>
        </Dialog>
    )

}