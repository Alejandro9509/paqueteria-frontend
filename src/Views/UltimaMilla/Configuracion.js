import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Grid, Typography, RadioGroup, FormControlLabel, Radio} from "@material-ui/core"
class Configuracion extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    componentDidMount() {

    }


    componentWillUnmount() {

    }

    render() {
        return (
            <Grid container>
                <Grid md={6}>
                    <Typography variant={"h4"}>Sistema Unidad</Typography>
                    <RadioGroup aria-label="unidad" name="gender1" >
                        <FormControlLabel value="1" control={<Radio />} label="Kilómetros" />
                        <FormControlLabel value="2" control={<Radio />} label="Millas" />
                    </RadioGroup>
                </Grid>
                <Grid md={6}>
                    <Typography variant={"h4"}>Optimizar</Typography>
                    <RadioGroup aria-label="unidad" name="gender1" >
                        <FormControlLabel value="1" control={<Radio />} label="Distancia" />
                        <FormControlLabel value="2" control={<Radio />} label="Tiempo" />
                    </RadioGroup>
                </Grid>
                <Grid md={12}>
                    <Typography variant={"h4"}>Creación de rutas</Typography>
                    <RadioGroup aria-label="unidad" name="gender1" >
                        <FormControlLabel value="1" control={<Radio />} label="Solo entregas" />
                        <FormControlLabel value="2" control={<Radio />} label="Solo recolecciones" />
                        <FormControlLabel value="3" control={<Radio />} label="Ambos" />
                    </RadioGroup>
                </Grid>
                <Grid md={12}>
                    <Typography variant={"h4"}>Pantalla completa</Typography>
                </Grid>
            </Grid>
        );
    }
}

Configuracion.propTypes = {};

export default Configuracion;
