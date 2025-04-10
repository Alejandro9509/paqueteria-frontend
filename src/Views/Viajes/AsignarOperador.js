import React, {useEffect} from 'react';
import Grid from '@mui/material/Grid';
import {DataGrid} from "@mui/x-data-grid";
import axios from "axios";
import {API_HEADERS} from "../../Constants";


export default function AsignarOperador(props){

    const headers = API_HEADERS
    const [unidadesListado, setUnidadesListado] = React.useState([]);

    function getUnidadesListado(){
        const url = `${process.env.REACT_APP_API_URL}/InventarioUnidades/GetListado`;
        axios.get(url, { headers }).then(respuesta => {
            setUnidadesListado(respuesta.data);
        });
    }

    useEffect( () => {
        getUnidadesListado();
    }, []);

    const columnUnidades = [
        {
            headerName: "Tipo Unidad",
            field: "m_sTipoUnidad",
            width: 150,
        },
        {
            headerName: "Código",
            field: "m_sCodigoUnidad",
            width: 100,
        },
        {
            headerName: "Descripción",
            field: "descripción",
            width: 200,
        },
        {
            headerName: "Estatus",
            field: "m_sEstatus",
            width: 200,
            renderCell: (row) => {
                let color = "#" + row.row.m_sColor;
                return (
                    <div style={{color: {color}}}>{row.row.m_sEstatus}</div>
                )
            }
        },
        {
            headerName: "Distancia Kms",
            field: "distanciaKms",
            width: 100,
        },
        {
            headerName: "Distancia Mi",
            field: "distanciaMi",
            width: 100,
        },
        {
            headerName: "Ubicación",
            field: "m_sUbicacion",
            width: 300,
        },
        {
            headerName: "Placas",
            field: "placas",
            width: 150,
        },
        {
            headerName: "Vencimiento",
            field: "vencimiento",
            width: 150,
        },
        {
            headerName: "Placas Ext",
            field: "placasExt",
            width: 150,
        },
        {
            headerName: "Vencimiento Ext",
            field: "vencimientoExt",
            width: 150,
        },
        {
            headerName: "Sucursal",
            field: "sucursal",
            width: 200,
        },
        {
            headerName: "Activa",
            field: "activa",
            width: 100,

        },
    ]
    const columnOperadores = [
        {
            headerName: "Núm",
            field: "numero",
            width: 150,
        },
        {
            headerName: "Nombre",
            field: "nombre",
            width: 200,
        },
    ]
    const operadoresListado = [
        {
            id: 0,
            numero: "123",
            nombre: "José Madero",
        },
        {
            id: 1,
            numero: "123",
            nombre: "José Madero",
        },
        {
            id: 2,
            numero: "123",
            nombre: "José Madero",
        }
    ]

    return(
        <div>
            <Grid container spacing={1}>
                <Grid item xs={8} >
                    <div style={{height: 400}}>
                        <h3>Disponibilidad de unidades</h3>
                        <DataGrid
                            columns={columnUnidades}
                            rows={unidadesListado}
                            density={"compact"}
                            hideFooter={true}
                            getRowId={(row) => row.m_nIdUnidad}
                        />
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <div style={{height: 400}}>
                        <h3>Operadores</h3>
                        <DataGrid
                            columns={columnOperadores}
                            rows={operadoresListado}
                            density={"compact"}
                            hideFooter={true}
                        />
                    </div>
                </Grid>
            </Grid>
            {props.children}
        </div>
    )
}