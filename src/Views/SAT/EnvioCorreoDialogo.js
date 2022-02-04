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
} from "@material-ui/core";

class MyComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            correos: "",
            correoDefault: false,
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
                    <form onSubmit={this.onSubmit}>
                        <FormControlLabel style={{padding:"0px !important"}}
                                          onChange={(e) => this.setState({correoDefault: e.target.checked})}
                                          control={<Checkbox
                                              checked={this.state.correoDefault}
                                              name="correoDefault"/>}
                                          label="Enviar correo al operador"/>
                        <Typography> En caso que necesite agregar correos adicioneles ingreselos en el campo siguiente separados por una ",".</Typography>

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

MyComponent.propTypes = {};

export default MyComponent;
