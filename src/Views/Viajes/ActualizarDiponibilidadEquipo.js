import React, {useEffect} from 'react';
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

function ActualizarDiponibilidadEquipo(props) {

    useEffect(value => {
        getEstatusEquipoListado();
        setEquipo(props.equipo)
    }, [])

    const [equipo, setEquipo] = React.useState(null);
    const [estatusEquipoListado, setEstatusEquipoListado] = React.useState([]);

    const handleEstatus = (event) => {
        // setIdEstatus(event.target.value);
        setEquipo({
            ...equipo,
            idEstatus: event.target.value,
        })
    }

    const handleOrigen = (event) => {
        setEquipo({
            ...equipo,
            origen: event.target.value,
        })
    }

    function getEstatusEquipoListado(){
        setEstatusEquipoListado([
            {
                id: 0,
                name: "Disponible",
            },
            {
                id: 1,
                name: "Mantenimiento",
            },
            {
                id: 2,
                name: "En Patio",
            },
            {
                id: 3,
                name: "En Reparación",
            }
        ]);
    }

    function onSubmit(event){
        event.preventDefault();
        props.onSubmit(equipo)
    }

    return(
        <form onSubmit={onSubmit}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: 'space-between',
                alignItems: 'center'}}>
                <div>
                    <span>Actualizar Estatus de Unidad</span>
                </div>
                <div>
                    <span>Unidad:</span>
                    <span style={{margin: 10}}>{equipo.unidad}</span>
                </div>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: 'center'}}>
                    <span style={{marginRight: 10}}>Estatus: </span>
                    <label className="input select">
                        <FormControl fullWidth variant="outlined" margin="dense">
                            <Select
                                labelId="idEstatusLabel"
                                className="form-control"
                                required
                                value={equipo.idEstatus}
                                onChange={handleEstatus}
                                id="estatusListado">
                                {estatusEquipoListado.map((estatus) => (
                                    <option
                                        key={estatus.id}
                                        value={estatus.id}>
                                        {estatus.name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </label>
                </div>
            </div>
            <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: 10}}>
            <span style={{marginRight: 10}}>Origen: </span>
            <TextField id="outlined-basic" variant="outlined"
                       type={"text"}
                       required
                       onChange={handleOrigen}
                       value={equipo.origen}/>
        </div>
            {props.children}
        </form>
    )
}

export default ActualizarDiponibilidadEquipo;