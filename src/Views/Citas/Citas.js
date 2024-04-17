import TextField from "@mui/material/TextField";
import React, {useEffect, useState} from "react";
import {Checkbox, FormControlLabel, Grid} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

export default function Citas(props){
    const [state, setState] = useState({
        fechaCita: '',
        horaCitaMinima: '',
        horaCitaMaxima: '',
        citaPendiente: false
    })

    useEffect(value => {
        props.onDataChange(state)
    }, [state])

    useEffect(value => {
        if (!props.dataPadreConsulta) {
            return;
          }
        const { dataPadreConsulta: respuesta } = props;
        console.log(respuesta)
        setState({
            ...state,
            fechaCita: respuesta.data.m_sFechaCita,
            horaCitaMinima:respuesta.data.m_sHoraCitaMinima,
            horaCitaMaxima:respuesta.data.m_sHoraCitaMaxima,
            citaPendiente: respuesta.data.m_bCitaPendiente

        })
    }, [props.dataPadreConsulta])
    const handleChangeCita = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })

    }

    const handleChangeCheckbox = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    return(
        <div style={{margin:'20px'}}>
            <div className="widget-header">
                <h2>{props.titulo}</h2>
            </div>
            <div className="widget-container">
                <div className="widget-content">
                    <div className="row">
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={2}>
                                <FormControlLabel
                                    style={{fontSize: '20px'}}
                                    control={
                                        <Checkbox
                                            disabled={props.disabled}
                                            onChange={handleChangeCheckbox}
                                            icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                            checkedIcon={<CheckBoxIcon fontSize="large" />}
                                            checked={state.citaPendiente}
                                            name="citaPendiente"
                                        />
                                    }
                                    label="Cita pendiente"
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <TextField
                                    variant="outlined"
                                    id="fechaCita"
                                    name="fechaCita"
                                    label="Fecha de la cita"
                                    type="date"
                                    onChange={handleChangeCita}
                                    value={state.fechaCita}
                                    className={"form-control"}
                                    disabled={props.disabled}
                                    InputLabelProps={{shrink: true,}}
                                    required={!state.citaPendiente}
                                    onKeyDown={(e) => e.preventDefault()}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <TextField
                                    variant="outlined"
                                    id="horaCitaMinima"
                                    name="horaCitaMinima"
                                    label="Hora mínima"
                                    type="time"
                                    value={state.horaCitaMinima}
                                    onChange={handleChangeCita}
                                    className={"form-control"}
                                    disabled={props.disabled}
                                    InputLabelProps={{shrink: true,}}
                                    inputProps={{step: 300,}}
                                    required={!state.citaPendiente}
                                    onKeyDown={(e) => e.preventDefault()}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <TextField
                                    variant="outlined"
                                    id="horaCitaMaxima"
                                    name="horaCitaMaxima"
                                    label="Hora máxima"
                                    type="time"
                                    onChange={handleChangeCita}
                                    value={state.horaCitaMaxima}
                                    className={"form-control"}
                                    InputLabelProps={{shrink: true,}}
                                    inputProps={{step: 300,}}
                                    disabled={props.disabled}
                                    required={!state.citaPendiente}
                                    onKeyDown={(e) => e.preventDefault()}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        </div>
    )
}