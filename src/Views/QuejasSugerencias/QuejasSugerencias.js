import React from 'react';
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {ReactComponent as IconAyuda} from '../../iconos/Cabecera/icono_menu.svg';
import {Button, TextField} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '100%',
        },
    },
}));

export default function QuejasSugerencias(){
    const classes = useStyles();
    const [commentario, setComentario] = React.useState("");
    const [telefono, setTelefono] = React.useState("");
    const [buttonsDisabled, setButtonsDisabled] = React.useState(true);
    const handleCommentTextChange = (event) => {
        setComentario(event.target.value);
        checkValidCommend();
    };
    const handleTelefonoTextChange = (event) => {
        setTelefono(event.target.value);
        checkValidCommend();
    };
    const handleEnviarClick = () => {
        if (checkValidCommend()){
            console.log(commentario);
            console.log(telefono);
        }else {
            console.log("Faltan datos");
        }

    };
    const handleCerrarClick = () => {
        console.log("Cerrar dialogo");
    };

    function checkValidCommend(){
        if (commentario !== "" && telefono !== ""){
            setButtonsDisabled(false);
            return true
        }else {
            setButtonsDisabled(true);
            return false
        }
    }

    return(
        <div>
            <header className="topbar clearfix">
                <Cabecera titulo="Quejas y Sugerencias GM Transport ERP" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li className="active-page">Quejas y sugerencias</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>
            <section className="main-container">
                <div className="container-fluid">
                    <div className="widget-wrap">
                        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                            <IconAyuda style={{width:30, height: 30, marginRight: 30}}/>
                            <p style={{margin: 0}}>
                                Tú opinión nos importa y por eso hemos creado este espacio para que nos expreses
                                tu punto de vista acerca de nuestro sistema.
                                Gracias por brindarnos tu tiempo.
                            </p>
                        </div>
                        <form className={classes.root} noValidate autoComplete="off">
                        <TextField
                            id="outlined-multiline-static"
                            multiline
                            rowsMax={10}
                            variant="outlined"
                            onChange={handleCommentTextChange}
                            value={commentario}
                        />
                        </form>
                        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                            <span>Teléfono para comunicarnos contigo:</span>
                            <TextField
                                id="standard-basic"
                                variant="filled"
                                value={telefono}
                                onChange={handleTelefonoTextChange}/>
                        </div>
                        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleEnviarClick}
                                disabled={buttonsDisabled}>Enviar</Button>
                            {/*<Button
                                variant="contained"
                                color="primary"
                                onClick={handleCerrarClick}>Cerrar</Button>*/}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}