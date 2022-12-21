import {dataGridLocaleText} from "../../Constants";
import {DataGrid} from "@material-ui/data-grid";
import React, {useState} from "react";
import {Button, Dialog, DialogContent, Grid, TextField, Tooltip} from "@material-ui/core";
import {showSuccess, validarDerecho} from "../../Util/Util";
import DialogTableClientes from "../Clientes/DialogTableClientes";
import {FilePond} from "react-filepond";
import {agregarPlantillaImportacion} from "../../Util/Contexts/PlantillasContext";

export default function PlantillasImportacionAgregar(props){
    const [files, setFiles] = useState([])
    const [state,setState] = useState({
        "idPlantilla": 0,
        cliente: null,
        "archivoBase64": "",
        "archivoNombre": "",

        openDialog:false
    })

    const handlePatrocinadorSelected = (row) => {
        setState(state => {
            return {
                ...state,
                cliente: row.data,
                openDialog: false
            }
        })
    }

    const handleOnSubmit = () => {
        try {

            let params = {
                "idPlantilla": 0,
                "idCliente": state.cliente.m_nIdCliente,
                "archivoBase64": "",
                "archivoNombre": files[0].filenameWithoutExtension,
            }
            console.log(params)
            agregarPlantillaImportacion(params).then(respuesta => {
                showSuccess(respuesta.data.message)
            })
        }catch (e){
            console.log(e)
        }

    }

    const handleOnupdatefiles = (newFiles) => {
        setFiles(newFiles)
    }

    return(
        <div>
            <Dialog open={state.openDialog} onClose={() => setState({...state, openDialog: false})} fullWidth maxWidth="md">
                <DialogContent>
                    <DialogTableClientes dialogVisible={(isVisible) => { setState({ ...state,openDialog: isVisible })}}
                                         handlePatrocinadorSelected={handlePatrocinadorSelected}/>
                </DialogContent>
            </Dialog>
            <div className="widget-wrap">
                <div className="widget-content">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm>
                            <TextField
                                variant="outlined"
                                label="Responsable de pago"
                                margin="dense"
                                required
                                value={state.cliente ? state.cliente.m_nNumeroCliente + ". " + state.cliente.m_sNombreFiscal : ""}
                                error={state.cliente?.m_bCreditoVencido && !state.cliente?.m_bSinCredito}
                                helperText={ (state.cliente?.m_bCreditoVencido && !state.cliente?.m_bSinCredito) ? "El cliente presenta saldo vencido. Días de crédito: " + state.cliente?.m_nDiasCredito : ""}
                                placeholder={"No. Cliente: Nombre fiscal"}
                                InputLabelProps={{shrink: true}}
                                onClick={()=>{ setState({ ...state, openDialog: true})}}
                            />
                        </Grid>
                        <Grid item xs={12} sm>
                            <FilePond
                                files={files}
                                onupdatefiles={(files) => handleOnupdatefiles(files)}
                                labelIdle={'Haz click aquí para seleccionar un documento'}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs>
                            <Button fullWidth color={"secondary"} variant={"contained"} onClick={(event) => {

                            }} style={{color: "white"}}>
                                Cancelar
                            </Button>
                        </Grid>
                        <Grid item xs>
                            <Button fullWidth
                                    color={"primary"}
                                    variant={"contained"}
                                    onClick={handleOnSubmit}
                            >
                                Guardar
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    )
}