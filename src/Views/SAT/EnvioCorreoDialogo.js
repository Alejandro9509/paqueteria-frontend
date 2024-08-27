import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControlLabel,
    TextField,
    Typography
} from "@mui/material";

class EnvioCorreoDialogo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            correos: "",
            correoDefault: true,
            idRegistro: 0,
        }
        this.onSubmit = this.onSubmit.bind(this)
    }

   componentDidMount() {
   }


   onSubmit(e){
        e.preventDefault()
       this.props.onSubmit(this.state)
   }

    render() {
        return (
            <Dialog open={this.props.open} onClose={() => this.props.close()}>
                <DialogTitle>Envio de correos</DialogTitle>
                <DialogContent>
                    Se enviará un correo al cliente.
                    <form onSubmit={this.onSubmit}>

                        <Typography style={{marginTop:"10px"}}> En caso que necesite agregar correos adicioneles ingreselos en el campo siguiente separados por una ",".</Typography>

                        <TextField type={"text"} onChange={(e) => this.setState({correos: e.target.value})} label={"Correos"} value={this.state.correos}/>

                    <DialogActions>
                        <Button onClick={() => this.props.close()}>Cancelar </Button>
                        <Button type={"submit"}>Aceptar</Button>
                    </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }
}

EnvioCorreoDialogo.propTypes = {};

export default EnvioCorreoDialogo;
