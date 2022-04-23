import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemIcon, ListItemText, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, withStyles} from "@material-ui/core";
import {DataGrid} from "@material-ui/data-grid";
import {dataGridLocaleText} from "../../Constants";
import { Table } from 'react-bootstrap';
import Noty from 'noty';
import Paper from '@material-ui/core/Paper';
import { confirmAlert } from 'react-confirm-alert';
const useStyles = theme => ({
    table: {
        maxWidth: 650,
      },
});

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
        let arrayAux = []
        this.props.guia.m_arrPaquetes.map((paquetes) => {
            for(let i=0;i<paquetes.ctd;i++){
                let paquete = { 
                    "m_nIdEmbarqueDetalle":0,
                    "m_sEmbalaje":"",
                    "m_nIndex":0,
                    "m_nCantidad":0
                }; 
                paquete.m_nIdEmbarqueDetalle = paquetes.m_nIdEmbarqueDetalle
                paquete.m_nIdEmbarque = paquetes.m_nIdEmbarque
                paquete.m_sEmbalaje = paquetes.m_sEmbalaje
                paquete.m_nCantidad = paquetes.ctd
                paquete.m_nIndex = i
                arrayAux.push(paquete)
            }
                return arrayAux
        })

             this.setState(
            {paquetes:arrayAux});
    }
    handleToggle(value){
        const currentIndex = this.state.idsPaquetesSeleccionadas.indexOf(value);
        const nuevoChecado = [...this.state.idsPaquetesSeleccionadas];
    
        if (currentIndex === -1) {
            nuevoChecado.push(value);
        } else {
            nuevoChecado.splice(currentIndex, 1);
        }
    
        this.setState(
            {idsPaquetesSeleccionadas:nuevoChecado});
      };
    onSubmitData(e){
        e.preventDefault()
       let {m_nIdEmbarqueDetalle,m_sEmbalaje,m_nIndex,m_nCantidad} = this.state.idsPaquetesSeleccionadas
       console.log(`${this.props.guia.m_nId}`)
       console.log(`${this.props.guia.m_bEsRecoleccion}`)
       console.log(`${JSON.stringify(this.props.tour.m_nIdParadaUltimaMilla)}`)
       console.log(JSON.stringify(this.state.idsPaquetesSeleccionadas))
        if(this.state.idsPaquetesSeleccionadas.length>0)
        {  showSuccess("Se han agregados los paquetes con exito")
            this.props.close()
        }
         else{
            showSuccess("Se requiere agregar por lo menos un paquete")
       }
    }

    render() {
        const { classes } = this.props;
        return (
            <Dialog
                fullWidth={true}
                maxWidth={'xs'}
                open={this.props.open}
                onClose={this.props.close}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogTitle><Typography variant={"h4"}>Seleccionar Paquete</Typography> </DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', height: '300px' }}>
               

                  
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                  <TableCell padding="checkbox">
                  <Checkbox
                    checked={0}
                    onChange={()=>console.log("")}
                  />
                </TableCell>
                    <TableCell align="right">Paquete</TableCell>
                    <TableCell align="right">Identificador&nbsp;</TableCell>
                    <TableCell align="right">Embalaje&nbsp;</TableCell>
                  </TableRow>
                </TableHead>


                <TableBody id="rows">
                    {this.state.paquetes.map((pq)=>{      
                         return (
                    <TableRow key={pq.m_nIndex}>
                    <TableCell padding="checkbox">
                      <Checkbox
                      checked={this.state.idsPaquetesSeleccionadas.indexOf(pq) !== -1}
                      onChange={()=>this.handleToggle(pq)}
                      />
                      </TableCell>
                      <TableCell align="right">{pq.m_nIndex + 1} de {pq.m_nCantidad}</TableCell>
                      <TableCell align="right">{pq.m_nIdEmbarqueDetalle}</TableCell>
                      <TableCell align="right">{pq.m_sEmbalaje}</TableCell>
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
            </Dialog>
        );
    }
}

export default withStyles(useStyles)(PaquetesParcialesGuia);