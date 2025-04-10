import React, {Component} from 'react';
import {Dialog, DialogContent, DialogTitle, TextField} from "@mui/material";
import Grid from "@mui/material/Grid";


const getCurrentDateTime = () => {
    let fechaHoraActual=new Date();
    return fechaHoraActual.toISOString().split('T')[0] + "T" + fechaHoraActual.getHours().toString().padStart(2,'0')+':'+fechaHoraActual.getMinutes().toString().padStart(2,'0');
}

class CancelarTrayecto extends Component {
    constructor(props) {
        super(props);
        this.state={
            id: props.data.m_nIdViajeTrayecto,
            fecha: props.data.m_dFechaSalida || "",
            hora:  getCurrentDateTime().substr(getCurrentDateTime().length - 5) || "",
            trayecto:props.data.m_sRuta || "",
            folioVijae:"",
            motivo:""
        }
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentDidMount() {

    }

    onSubmit(e){
        e.preventDefault()
        this.props.onSubmit(this.state)
    }

    render() {
        return (
            <Dialog open={this.props.open} close={() => this.props.close()}>
                <DialogTitle>Cancelar trayecto</DialogTitle>
                <DialogContent>
                    <form onSubmit={this.onSubmit}>
                        {/*<div className={classes.root}></div>*/}
                        <Grid container spacing={2}>

                            <Grid item xs={6}>
                                <TextField
                                    id={"trayecto"}
                                    margin={"dense"}
                                    disabled
                                    label={"Trayecto"}
                                    variant={"outlined"}
                                    value={this.state.trayecto}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id={"fecha"}
                                    margin={"dense"}
                                    disabled
                                    label={"Fecha de salida"}
                                    variant={"outlined"}
                                    value={this.state.fecha}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id={"hora"}
                                    margin={"dense"}
                                    disabled
                                    label={"Hora de salida"}
                                    variant={"outlined"}
                                    value={this.state.hora}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id={"motivo"}
                                    margin={"dense"}
                                    label={"Motivo"}
                                    onChange={(e) => this.setState({motivo: e.target.value})}
                                    variant={"outlined"}
                                    value={this.state.motivo}
                                />
                            </Grid>
                        </Grid>
                        {this.props.children}
                    </form>
                </DialogContent>
            </Dialog>
        );
    }
}

CancelarTrayecto.propTypes = {};

export default CancelarTrayecto;
