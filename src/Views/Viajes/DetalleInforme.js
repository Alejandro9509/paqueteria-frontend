import React, {Component} from 'react';
import { Grid, Divider} from "@mui/material";
import TextField from "@mui/material/TextField";


class DetalleInforme extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{marginTop:"1%"}}>
                {
                    this.props.guias.map((value, index) => {
                        return (
                            <div style={{width: "100%", borderRadius: "10px"}}>
                                <Grid container spacing={2}>
                                    <Grid
                                        item
                                        sm={12}
                                        style={{width: "100%",}}>
                                        <Grid container spacing={2}>
                                            <Grid item sm={12} md={4}>
                                                <div className="input">
                                                    <TextField variant="outlined"
                                                               margin="dense"
                                                               label="Folio Guía"
                                                               value={value.m_nFolioGuia}
                                                               className="form-control"
                                                               type="text"
                                                               fullWidth
                                                               disabled="true"
                                                               id={"folio-" + index}
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item sm={12} md={4}>
                                                <div className="input">

                                                    <TextField variant="outlined"
                                                               margin="dense"
                                                               label="Estatus Guía"
                                                               className="form-control"
                                                               type="text"
                                                               fullWidth
                                                               disabled="true"
                                                               value={value.m_sEstatusGuia}
                                                               id={"estatus-" + index}
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item sm={12} md={4}>
                                                <div className="input">
                                                    <TextField variant="outlined" margin="dense" label="Total"
                                                               value={value.m_xTotal}
                                                               disabled="true"
                                                               fullWidth
                                                               className="form-control"
                                                               type="text"
                                                               id={"total-" + index}
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item sm={12} md={6}>
                                                <div className="input">
                                                    <TextField variant="outlined" margin="dense" label="Destino"
                                                               value={value.m_sCiudadDestino}
                                                               className="form-control"
                                                               type="text"
                                                               disabled="true"
                                                               fullWidth
                                                               id={"destino-" + index}
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item sm={12} md={6}>
                                                <div className="input">
                                                    <TextField variant="outlined" margin="dense"
                                                               label="Tipo de Servicio"
                                                               disabled="true"
                                                               value={value.m_sTipoServicio}
                                                               className="form-control"
                                                               type="text"
                                                               fullWidth
                                                               id={"servicio-" + index}
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item sm={12} md={12}>
                                                <div className="input">
                                                    <TextField variant="outlined" margin="dense" label="Observaciones"
                                                               disabled="true"
                                                               value={value.m_sObservaciones}
                                                               className="form-control"
                                                               type="text"
                                                               fullWidth
                                                               id={"observacion-" + index}
                                                    />
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Divider style={{margin: "10px"}}/>
                            </div>
                        )
                    })
                }

                {this.props.children}
            </div>
        );
    }
}

DetalleInforme.propTypes = {};

export default DetalleInforme;
