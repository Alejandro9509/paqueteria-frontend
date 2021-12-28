import React, {useEffect, useState} from "react";
import {DataGrid} from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import {MenuItem, TextField, Tooltip} from "@material-ui/core";
import {
    obtenerRutasByOrigenDestinoCliente,
    obtenerRutasByOrigenDestinoPublicoGeneral,
    obtenerTrayectosByRuta
} from "../../Util/Contexts/RutasContext";

export default function SeleccionarRuta(props){
    const [state, setState] = useState({
        height: window.innerHeight,
    })
    const [dataRutas, setDataRutas] = useState([])
    const [dataTrayectos, setDataTrayectos] = useState([])

    const columns = React.useMemo(() => [
        {
            headerName: "Secuencia",
            field: "Secuencia",
            width: 300,
        },
        {
            headerName: "Origen",
            field: "Origen",
            width: 300,
        },
        {
            headerName: "Destino",
            field: "Destino",
            width: 300,
        },
        {
            headerName: "Kilometros",
            field: "Kilometros",
            width: 150,
        },
        {
            headerName: "Horas",
            field: "Horas",
            width: 150,
        },
    ]);

    useEffect(() => {
        if (props.IdOrigen && props.IdDestino && props.IdCliente >= 0){
            setDataTrayectos([])
            getRutasByOrigenDestino(props.IdOrigen, props.IdDestino, props.IdCliente)
        }
    },[props.IdOrigen, props.IdDestino])

    useEffect(() => {
        if (props.IdRuta === 0){
            setDataRutas([])
            setDataTrayectos([])
        }
    },[props.IdRuta])

    const handleChange = (event) => {
        props.onChangeRuta(event.target.value)
        getTrayectosByRuta(event.target.value)
    }

    const getRutasByOrigenDestino = (idOrigen, idDestino, idCliente) => {
        if (idCliente === 0){
            obtenerRutasByOrigenDestinoPublicoGeneral(idOrigen, idDestino).then(({data}) => {
                setDataRutas(data)
            })
        }else{
            obtenerRutasByOrigenDestinoCliente(idCliente, idOrigen, idDestino).then(({data}) => {
                setDataRutas(data)
            })
        }


    }
    const getTrayectosByRuta = (idRuta) => {
        obtenerTrayectosByRuta(idRuta).then(({data}) => {
            setDataTrayectos(data)
        })

    }

    return(
        <div>
            <TextField
                id="outlined-select-currency"
                select
                variant="outlined" margin="dense"
                label="Selecciona ruta"
                value={props.idRuta}
                fullWidth
                disabled={props.disabled}
                onChange={handleChange}
                helperText="Selecciona la ruta que tomará la guía"
            >
                {dataRutas.map((option) => (
                    <MenuItem key={option.IdRuta} value={option.IdRuta}>
                        {option.DescripcionRuta}
                    </MenuItem>
                ))}
            </TextField>
            <div className={"row"} style={{ height: '100%' }}>
                <DataGrid
                    columns={columns}
                    rows={dataTrayectos}
                    locateText={dataGridLocaleText}
                    hideFooter
                    autoHeight {...{dataSet:'Commodity', rowLength: 4, maxColumns: 6}}
                    getRowId={(row) => row.IdRutaTrayecto}
                    pageSize={20}
                />
            </div>
        </div>
    )
}