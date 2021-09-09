import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    ListItem,
    List,
    ListItemIcon,
    ListItemText,
    Typography,
    ListItemSecondaryAction
} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import {arrayMoveImmutable} from 'array-move';
import {
    sortableContainer,
    sortableElement,
    sortableHandle,
} from 'react-sortable-hoc';
import {obtenerGuiaUltimaMilla} from "../../Util/Contexts/GuiaContext";
import RemplazarPaqueteUltimaMilla from "./RemplazarPaqueteUltimaMilla";

class AgregarPaqueteUltimaMilla extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: props.paquetes,
            itemsSinModificar: props.paquetes,
            paquetes: [],
            openRemplazar: false,
            paradaSeleccionada: props.tour
        }
        this.onSortEnd = this.onSortEnd.bind(this)
        this.openSeleccionarPaquetes = this.openSeleccionarPaquetes.bind(this)
        this.onSubmitPaquetesSeleccionados = this.onSubmitPaquetesSeleccionados.bind(this)
        this.quitarPaquete = this.quitarPaquete.bind(this)
        this.onSubmitData = this.onSubmitData.bind(this)
        //this.getAllPaquetes = this.getAllPaquetes.bind(this)
    }

    componentDidMount() {
        console.log(this.props.paquetes)
        this.setState({items: this.props.paquetes})
    }


    onSubmitData(e) {
        e.preventDefault()
        this.props.onSubmit(this.state.items)
    }

    onSubmitPaquetesSeleccionados(seleccionados){
        var array = []
        const {items} = this.state
        array = array.concat(items)
        array = array.concat(seleccionados)
        console.log(array)

        this.setState({items: array, openRemplazar: false})
    }


    openSeleccionarPaquetes() {
        //"0", "0", this.props.data.sucursalSeleccionada.m_nIdSucursal, 4
        obtenerGuiaUltimaMilla(this.props.zonasIds, this.props.tipoServicio).then(({data}) => {

            this.setState({paquetes: data, openRemplazar: true})
        })
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({items}) => ({
            items: arrayMoveImmutable(items, oldIndex, newIndex),
        }));
    };

    quitarPaquete(index){
        const items = this.state.items
        items.splice(index,1)
        this.setState({items: items})
    }

    render() {
        const {items} = this.state;
        return (
            <div>
                {
                    this.state.openRemplazar &&
                    <RemplazarPaqueteUltimaMilla open={this.state.openRemplazar} onSubmit={this.onSubmitPaquetesSeleccionados}
                                                 close={() => this.setState({openRemplazar: false})}
                                                 data={this.state.paquetes} multiples={true}/>
                }

                <Dialog
                    fullWidth={true}
                    maxWidth={'xl'}
                    open={this.props.open}
                    onClose={this.props.close}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle><Typography variant={"h4"}>Paquetes - {this.state.paradaSeleccionada.m_snNombreOperador} </Typography></DialogTitle>
                    <DialogContent>
                        <div align={"right"} style={{width: "100%"}}>
                            <Button variant={"contained"} color={"primary"} onClick={() => this.openSeleccionarPaquetes()}>Agregar Paquetes</Button>

                        </div>
                        <SortableContainer onSortEnd={this.onSortEnd} useDragHandle>

                            {items.map((value, index) => {
                                return (
                                <SortableItem quitarPaquete={this.quitarPaquete} key={`item-${value.m_sFolio}`} index={index} position={index} primary={value.m_sFolio}
                                              secundary={value.m_bEsRecoleccion ? value.m_sDomicilioRemitente : value.m_sDomicilioDestinatario}/>
                                )})}
                        </SortableContainer>
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
            </div>
        );
    }
}

AgregarPaqueteUltimaMilla.propTypes = {};

export default AgregarPaqueteUltimaMilla;

const DragHandle = sortableHandle(() => <DragHandleIcon/>);

const SortableItem = sortableElement(({primary, secundary, quitarPaquete, position}) => {
    return (
    <ListItem style={{zIndex: 3000000000}}>
        <ListItemIcon>
            <DragHandle/>
        </ListItemIcon>
        <ListItemText primary={`${primary}`} secondary={secundary}/>
        <DeleteIcon onClick={() => quitarPaquete(position)}/>
    </ListItem>
)});

const SortableContainer = sortableContainer(({children}) => {
    return <List>{children}</List>;
});

