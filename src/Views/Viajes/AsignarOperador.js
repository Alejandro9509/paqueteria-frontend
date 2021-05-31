import React from 'react';
import Grid from '@material-ui/core/Grid';
import {DataGrid} from "@material-ui/data-grid";
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(() => ({

}));


export default function AsignarOperador(props){
    const columnUnidades = [
        {
            headerName: "Tipo Unidad",
            field: "tipoUnidad",
            width: 150,
        },
        {
            headerName: "Código",
            field: "codigo",
            width: 100,
        },
        {
            headerName: "Descripción",
            field: "descripción",
            width: 200,
        },
        {
            headerName: "Estatus",
            field: "nameEstatus",
            width: 200,
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
            field: "ubicación",
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
            field: "placas",
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
    const unidadesListado = [
        {
            id: 0,
            tipoUnidad: "bonita"
        }
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
                <Grid item xs={7} >
                    <div style={{height: 400}}>
                        <h3>Disponibilidad de unidades</h3>
                        <DataGrid
                            columns={columnUnidades}
                            rows={unidadesListado}
                            density={"compact"}
                            hideFooter={true}
                        />
                    </div>

                </Grid>
                <Grid item xs={5}>
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