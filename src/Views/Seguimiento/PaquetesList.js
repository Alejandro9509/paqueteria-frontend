import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Divider, Grid, Typography} from "@mui/material";

class PaquetesList extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }



    render() {
        return (
            <div>
                {this.props.paquetes.map((p, index) =>
                <>
                    <Divider orientation="horizontal" flexItem />
                    <Grid container alignItems={"center"} justifyContent={"center"} direction="row" spacing={2}>
                        <Grid item md={12}>
                            <Typography variant={"h5"}> Paquete: {index + 1} de {this.props.paquetes.length}</Typography>

                        </Grid>
                        <Grid item md={3}>
                            <Typography variant={"body1"}>Peso: <b>{p.m_rPeso} kg</b></Typography>

                        </Grid>
                        <Grid item md={3}>
                            <Typography variant={"body1"}>Largo: <b>{p.m_rLargo} cm</b></Typography>

                        </Grid>
                        <Grid item md={3}>
                            <Typography variant={"body1"}>Ancho: <b>{p.m_rAncho} cm</b></Typography>

                        </Grid>
                        <Grid item md={3}>
                            <Typography variant={"body1"}>Alto: <b>{p.m_rAlto} cm</b></Typography>

                        </Grid>
                    </Grid>
                    <Grid container alignItems={"center"} justifyContent={"center"} direction="row" spacing={2}>
                        <Grid item md={6}>
                        <Typography variant={"body1"}>Descripción: <b>{p.m_sDescripcion}</b></Typography>
                        </Grid>
                            <Grid item md={6}>
                        <Typography variant={"body1"}>Cantidad: <b>{p.m_nCantidad} pzas</b></Typography>
                            </Grid>
                    </Grid>
                    <Divider orientation="horizontal" flexItem />
                </>
                )}

            </div>
        );
    }
}

PaquetesList.propTypes = {};

export default PaquetesList;
