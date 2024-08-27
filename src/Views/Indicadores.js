import { ButtonBase, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, ImageList, ImageListItem, ImageListItemBar, IconButton, Paper } from '@mui/material';
import React from 'react';
import BarraLateralIzquierda from '../Components/Template/BarraLateralIzquierda';
import Cabecera from '../Components/Template/Cabecera';
import addIcon from '../iconos/ionic-ios-add-circle.png'
import CancelIcon from '@mui/icons-material/Cancel';
function Indicadores(props) {

    const [state, setState] = React.useState({
        height: window.innerHeight,
        indicadores: [{}, {}, {}, {}, {}, {}],
        openDialog: false,
    })

    return (
        <div >

             <Dialog open={state.openDialog} onClose={() => setState({ ...state, openDialog: false })}>
                 <DialogTitle>
                     Seleccionar el Indicador
                 </DialogTitle>
                 <DialogContent>

                 </DialogContent>
                 <DialogActions>

                     <button className="btn btn-primary primary-btn" >Aceptar</button>
                     <button className="btn btn-secondary secondary-btn" onClick={() => setState({ ...state, openDialog: false })}>Cancelar</button>
                 </DialogActions>
             </Dialog>
             <header className="topbar clearfix">
                 <Cabecera titulo="Indicadores" >
                     <div className="page-header">
                         <ul className="list-page-breadcrumb">
                             <li className="active-page"> Indicadores</li>
                         </ul>
                     </div>
                 </Cabecera>
             </header>
             {/*Topbar End Here*/}
             {/*Leftbar Start Here*/}
             <aside className="iconic-leftbar">
                 <BarraLateralIzquierda />
             </aside>
            <section className="main-container">
                <div className="container-fluid">


                    <div className="widget-wrap">
                        <div className="widget-container">
                            <div className="widget-content">
                                <div className="row">
                                    {
                                        state.indicadores.map((i, index) => (
                                            <div className="col-sm-6 col-md-4 col-lg-4 unit" style={{ padding: "10px", height: "400px" }}>
                                                <ButtonBase style={{ height: "100%", width: "100%" }} onClick={(e) => { e.stopPropagation(); setState({ ...state, openDialog: true }) }}>
                                                    <Paper style={{ height: "100%", width: "100%" }} elevation={3}>
                                                        <div className="light" style={{ padding: "10px" }}>
                                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                                <h4>
                                                                    <strong > Agregar un Indicador</strong>
                                                                </h4>
                                                                <IconButton
                                                                    style={{ float: "right" }}
                                                                    onClick={(e) => { e.stopPropagation(); }}
                                                                    size="large">
                                                                    <CancelIcon />
                                                                </IconButton>
                                                            </div>

                                                            <div style={{ alignItems: "center", display: "flex", height: "300px" }}>
                                                                <img src={addIcon} alt="add" style={{ margin: "auto", display: "block", width: "100px", verticalAlign: "middle" }} />

                                                            </div>
                                                        </div>

                                                    </Paper>
                                                </ButtonBase>
                                            </div>

                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
         </div>
    );
}

export default Indicadores;