import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select
} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {imprimirFormatosIdInforme, obtenerFormatosImpresionProceso} from "../Util/Contexts/FormatosImpresionContext";
import {showSuccess} from "../Util/Util";

const INFORMES = 214
const INFORMES_ECC = 222
export default function DialogFormatosImpresion({idProceso = 0, idRegistro = 0, openDialog = false, setOpenDialog, handleOnClose}) {

    const [selection, setSelection] = useState(null)
    const [listadoFormatos, setListadoFormatos] = useState([])
    
    useEffect(() => {
        if (idProceso === INFORMES && localStorage.getItem("RFC") === "ECC9510049KA"){
            obtenerFormatosImpresionProceso(INFORMES_ECC).then(({data}) => {
                setListadoFormatos(data)
            })
        } else
            obtenerFormatosImpresionProceso(idProceso).then(({data}) => {
            setListadoFormatos(data)
        })
        if (listadoFormatos.length === 0) {
            showSuccess("No hay formato de informe en el sistema. Comuniquese con la oficinas de GM.")
            return
        }
    }, [])
    const handleOnSubmit = () => {
        if (idProceso === INFORMES) {
            let reporte = listadoFormatos.find( i => i.m_nIdFormato === selection)
            if (reporte === undefined) {
                // showError("Es necesario seleccionar un reporte")
                return
            }
            if (reporte.m_sNombreArchivo.toUpperCase().includes('EXCEL')) {
                imprimirFormatosIdInforme(reporte.m_nIdFormato, idRegistro, false).then(({data}) => {
                    handleOnClose(data)
                    setOpenDialog(false)
                })
            } else {
                imprimirFormatosIdInforme(reporte.m_nIdFormato, idRegistro, true).then(({data}) => {
                    handleOnClose(data)
                    setOpenDialog(false)
                })
            }
        }

    }

    const handleOnCancelClick = () => {
        handleOnClose(null)
        setOpenDialog(false)
    }

  return (
      <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          fullWidth maxWidth="xs"
      >
          <DialogTitle>
              Reporte de Informe
          </DialogTitle>
          <DialogContent>
              <div className="row" style={{backgroundColor: '#FFFFFF'}}>
                      <Grid container spacing={1}>
                          <Grid item sm={6}>
                              <FormControl
                                  className="input select"
                                  fullWidth variant="outlined"
                                  required
                                  margin="dense">
                                  <InputLabel
                                      id="idReporteLabel">Formato de Reporte</InputLabel>
                                  <Select
                                      fullWidth
                                      labelId="idReporteLabel"
                                      label="Reporte"
                                      className="form-control"
                                      value={selection ?? ''}
                                      onChange={(e) => { setSelection(e.target.value) }}
                                      name="reporteSeleccionado"
                                  >
                                      {listadoFormatos.map((reporte) => (
                                          <MenuItem
                                              key={reporte.m_nIdFormato}
                                              value={reporte.m_nIdFormato}
                                          >
                                              {reporte.m_sFormato}
                                          </MenuItem>
                                      ))}
                                  </Select>
                              </FormControl>
                          </Grid>
                      </Grid>
                      <DialogActions>

                          <Button className="btn btn-secondary secondary-btn" onClick={() => { handleOnCancelClick() }}>
                              Cancelar
                          </Button>
                          <Button className="btn btn-primary primary-btn" color={"primary"} onClick={() => { handleOnSubmit() }}>
                              Aceptar
                          </Button>
                      </DialogActions>
              </div>
          </DialogContent>
      </Dialog>
  )
}