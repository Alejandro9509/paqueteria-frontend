import React, {Component} from 'react';
import { styled } from '@mui/material/styles';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { Table } from 'react-bootstrap';
import Noty from 'noty';
import {
    agregarPaquetesParciales,
    obtenerPaquetesParciales,
    obtenerPaquetesPorParada
} from "../../Util/Contexts/UltimaMillaContext";

const PREFIX = 'PaquetesParcialesGuia';

const classes = {
    table: `${PREFIX}-table`
};

const StyledDialog = styled(Dialog)(({theme}) => ({
    [`& .${classes.table}`]: {
        maxWidth: 650,
      }
}));

function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}

class PaquetesParcialesGuia extends Component{
    constructor(props){
        super(props);
        this.state ={
            height: window.innerHeight,
            idsPaquetesSeleccionadas: [],
            paquetes:[],
            checked:[]
        }
        this.handleToggle = this.handleToggle.bind(this)
        this.onSubmitData = this.onSubmitData.bind(this)    
    }

    componentDidMount() {
        obtenerPaquetesPorParada(this.props.guia.m_nId).then(({data}) => {
            let paquetesConIndex = []
            data.forEach(item => {
                item.indexEnParciales = item.indexEnParciales.map(i => i.noIndex)
            })
            obtenerPaquetesParciales(this.props.tour.m_nIdParadaUltimaMilla, this.props.guia.m_nId).then(({data:paquetesSeleccionados}) => {
                this.setState({
                    idsPaquetesSeleccionadas: paquetesSeleccionados.filter(p => p.idPaquete)
                })
                data.forEach( (item) => {
                    for (let i = 0; i < item.cantidad; i++){
                        let auxObject = {...item}
                        if (item.indexEnParciales.some(p => p === i+1)){
                            //si el index actual está en en parciales ya no se muestra
                            if (paquetesSeleccionados.some(s => s.idPaquete === item.idPaquete && s.noIndex === i+1)){
                                auxObject.noIndex = i+1
                                paquetesConIndex.push(auxObject)
                            }
                        }else{
                            auxObject.noIndex = i+1
                            paquetesConIndex.push(auxObject)
                        }
                    }
                })
                this.setState({
                    paquetes:paquetesConIndex
                })
            })
        })
    }

    handleToggle(value) {
        const currentIndex = this.state.idsPaquetesSeleccionadas.findIndex(p => (p.idPaquete+p.noIndex) === (value.idPaquete+value.noIndex));
        const nuevoChecado = [...this.state.idsPaquetesSeleccionadas];
        if (currentIndex === -1) {
            nuevoChecado.push(value);
        } else {
            nuevoChecado.splice(currentIndex, 1);
        }
        this.setState({idsPaquetesSeleccionadas: nuevoChecado});
    };

    onSubmitData(e){
        e.preventDefault()
        if (this.state.idsPaquetesSeleccionadas.length > 0) {
            agregarPaquetesParciales(this.props.tour.m_nIdParadaUltimaMilla, this.props.guia.m_nId, this.state.idsPaquetesSeleccionadas).then(({data}) => {
                showSuccess(data, 5000, 'success')
                this.props.close()
            }).catch((err) => {
                showSuccess(err.response?.data)
            })
        } else {
            showSuccess("Se requiere agregar por lo menos un paquete")
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <StyledDialog
                fullWidth={true}
                maxWidth={'xs'}
                open={this.props.open}
                onClose={this.props.close}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogTitle>
                    <Typography variant={"h4"}>
                        Seleccionar Paquete
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <div style={{display: 'flex', height: '300px'}}>


                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox checked={0}/>
                                    </TableCell>
                                    <TableCell align="right">Paquete</TableCell>
                                    <TableCell align="right">Identificador&nbsp;</TableCell>
                                    {/*<TableCell align="right">Embalaje&nbsp;</TableCell>*/}
                                </TableRow>
                            </TableHead>
                            <TableBody id="rows">
                                {this.state.paquetes.map((pq) => {
                                        return (
                                            /*<TableRow key={pq.m_nIndex}>*/ //Cambiar luego a Index
                                            <TableRow key={pq.idPaquete+pq.noIndex}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={this.state.idsPaquetesSeleccionadas.some(idPaquete => idPaquete.noIndex === pq.noIndex && idPaquete.idPaquete === pq.idPaquete) /*indexOf(pq) !== -1*/}
                                                        onChange={() => this.handleToggle(pq)}
                                                    />
                                                </TableCell>
                                                {/*<TableCell align="right">{pq.m_nIndex + 1} de {pq.cantidad}</TableCell>*/}
                                                <TableCell align="right">{pq.noIndex} de {pq.cantidad}</TableCell>
                                                <TableCell align="right">{pq.descripcion}</TableCell>
                                                {/*<TableCell align="right">{pq.embalaje}</TableCell>*/}
                                            </TableRow>
                                        )
                                    }
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.close} color="primary">
                        Cerrar
                    </Button>
                    <Button onClick={this.onSubmitData} color="primary" autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </StyledDialog>
        );
    }
}

export default (PaquetesParcialesGuia);