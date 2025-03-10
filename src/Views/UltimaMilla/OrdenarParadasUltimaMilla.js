import React, {Component} from 'react';
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
    Typography
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import {arrayMoveImmutable} from 'array-move';
import {
    sortableContainer,
    sortableElement,
    sortableHandle,
} from 'react-sortable-hoc';
import {obtenerGuiaUltimaMilla} from "../../Util/Contexts/GuiaContext";
import RemplazarPaqueteUltimaMilla from "./RemplazarPaqueteUltimaMilla";
import IconButton from "@mui/material/IconButton";
import {showSuccess} from "../../Util/Util";

class OrdenarParadasUltimaMilla extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [...this.props.paquetes],
            itemsSinModificar: [...this.props.paquetes],
            itemsDescartados: [],
            paquetes: [],
            openRemplazar: false,
            paradaSeleccionada: props.tour
        }
        this.onSortEnd = this.onSortEnd.bind(this)
        this.openSeleccionarPaquetes = this.openSeleccionarPaquetes.bind(this)
        this.onSubmitPaquetesSeleccionados = this.onSubmitPaquetesSeleccionados.bind(this)
        this.quitarPaquete = this.quitarPaquete.bind(this)
        this.onSubmitData = this.onSubmitData.bind(this)
    }

    componentDidMount() {
        this.setState({items: [...this.props.paquetes]})
    }

    onSubmitData(e) {
        e.preventDefault()
        this.props.onSubmit(this.state.items, this.state.itemsDescartados)
    }

    onSubmitPaquetesSeleccionados(seleccionados){
        var array = []
        const {items} = this.state
        array = array.concat(items)
        array = array.concat(seleccionados)
        this.setState({items: array, openRemplazar: false})
    }

    openSeleccionarPaquetes() {
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
        if (this.state.items.length === 1){
            showSuccess("No se pueden borrar todas las paradas de la ruta.")
        } else {
            const items = this.state.items
            const paquetesDescartados = this.state.itemsDescartados
            paquetesDescartados.push(items[index])
            items.splice(index,1)
            this.setState({items: items, itemsDescartados: paquetesDescartados})
        }
    }

    render() {
        const {items} = this.state;
        return (
            <div>
                {
                    this.state.openRemplazar &&
                    <RemplazarPaqueteUltimaMilla open={this.state.openRemplazar}
                                                 onSubmit={this.onSubmitPaquetesSeleccionados}
                                                 close={() => this.setState({openRemplazar: false})}
                                                 data={this.state.paquetes} multiples={true}/>
                }

                <Dialog
                    fullWidth={true}
                    maxWidth={'sm'}
                    open={this.props.open}
                    onClose={this.props.close}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle>
                        <Typography variant={"h4"}>
                            Paquetes - {this.state.paradaSeleccionada.m_snNombreOperador}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <div align={"right"} style={{width: "100%"}}>
                            <Button variant={"contained"} color={"primary"}
                                    onClick={() => this.openSeleccionarPaquetes()}
                                    disabled={this.props.deshabilidarAgregar}>
                                Agregar Paquetes
                            </Button>
                        </div>

                        <SortableContainer onSortEnd={this.onSortEnd} useDragHandle>
                            {items.map((value, index) => {
                                return (
                                <SortableItem  disabled={value.m_nEstatusUlimaMilla !== 1}
                                               apagao={value.m_nEstatusUlimaMilla !== 1 || this.props.deshabilidarAgregar}
                                               quitarPaquete={this.quitarPaquete}
                                               key={`item-${value.m_sFolio}`}
                                               index={index}
                                               position={index}
                                               primary={value.m_sFolio}
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

OrdenarParadasUltimaMilla.propTypes = {};

export default OrdenarParadasUltimaMilla;

const DragHandle = sortableHandle(() => <DragHandleIcon fontSize={"large"}/>);

const SortableItem = sortableElement(({primary, secundary, quitarPaquete, position, apagao}) => {
    return (
        <ListItem style={{zIndex: 3000000000}}>
            <ListItemIcon>
                <DragHandle />
            </ListItemIcon>
            <ListItemText primary={`${primary}`} secondary={secundary}/>
            <IconButton onClick={() => quitarPaquete(position)} disabled={apagao} size="large">
                <DeleteIcon />
            </IconButton>
        </ListItem>
    );});

const SortableContainer = sortableContainer(({children}) => {
    return <List>{children}</List>;
});

