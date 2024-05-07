import React, {useEffect, useState} from "react";
import {DataGrid} from "@mui/x-data-grid";
import {dataGridLocaleText} from "../../Constants";
import {MenuItem, TextField, Tooltip} from "@mui/material";
import {
    obtenerRutasByOrigenDestinoCliente,
    obtenerRutasByOrigenDestinoPublicoGeneral, obtenerRutasId,
    obtenerTrayectosByRuta
} from "../../Util/Contexts/RutasContext";

/**Props
 * IdOrigen: Int
 * IdDestino: Int
 * IdCliente: Int
 * IdRuta: Int
 * disabled: Boolean
 * onChangeRuta: function
 * EsConsulta: Boolean
 * */
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
            headerName: "Kilómetros",
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
        if (!props.EsConsulta){
            if (props.IdOrigen && props.IdDestino && props.IdCliente >= 0){
                setDataTrayectos([])
                getRutasByOrigenDestino(props.IdOrigen, props.IdDestino, props.IdCliente)
            }
        }
    },[props.IdOrigen, props.IdDestino, props.IdCliente])

    useEffect(() => {
        if (props.IdRuta === 0){
            setDataRutas([])
            setDataTrayectos([])
        }else {
            if (props.EsConsulta){
                obtenerRutasId(props.IdRuta).then(respuesta => {
                    dataRutas.push(respuesta.data)
                    setDataRutas(dataRutas)
                })
            }
            getTrayectosByRuta(props.IdRuta)
        }
    },[props.IdRuta])

    const handleChange = (event) => {
        props.onChangeRuta(event.target.value)
        // getTrayectosByRuta(event.target.value)
    }

    const getRutasByOrigenDestino = (idOrigen, idDestino, idCliente) => {
        if (idCliente === 0){
            obtenerRutasByOrigenDestinoPublicoGeneral(idOrigen, idDestino).then(({data}) => {
                setDataRutas(data)
            })
        }else{
            obtenerRutasByOrigenDestinoCliente(idCliente, idOrigen, idDestino).then(({data}) => {
                if(data.length !== 0 ) {
                    setDataRutas(data)
                    if (data.length === 1){
                        props.onChangeRuta(data[0].IdRuta)
                        getTrayectosByRuta(data[0].IdRuta)
                    }
                }else {
                    obtenerRutasByOrigenDestinoPublicoGeneral(idOrigen, idDestino).then(({data}) => {
                        setDataRutas(data)
                        if (data.length === 1){
                            props.onChangeRuta(data[0].IdRuta)
                            getTrayectosByRuta(data[0].IdRuta)
                        }
                    })
                }

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
                value={props.IdRuta}
                fullWidth
                disabled={props.disabled}
                onChange={handleChange}
                helperText={"Selecciona la ruta que tomará " + (props.viaje ? "el viaje" :  "la guía")}
            >
                {dataRutas.map((option) => (
                    <MenuItem key={option.IdRuta} value={option.IdRuta}>
                        {option.DescripcionRuta}
                    </MenuItem>
                ))}
            </TextField>
            <div className="widget-header">
                <h2>Trayectos</h2>
            </div>
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