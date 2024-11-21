import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cabecera from '../../Components/Template/Cabecera';
import BarraLateralIzquierda from '../../Components/Template/BarraLateralIzquierda';
import Noty from 'noty';
import axios from "axios";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as Activo } from "../../iconos/Menu/palomita.svg";
import { ReactComponent as NoActivo } from "../../iconos/Menu/cruz.svg";
import { DataGrid } from '@mui/x-data-grid';
import $ from "jquery";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import AgregarFormatoImpresion from "./AgregarFormatoImpresion";
import { toBase64 } from '../../Util/GlobalFunctions';
import {
    agregarFormatosImpresion,
    modificarFormatosImpresion,
    obtenerFormatosImpresion
} from '../../Util/Contexts/FormatosImpresionContext';
window.jQuery = window.$ = $;
const headers = {
    'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
}
function showSuccess(mensaje) {
    new Noty({
        type: "information",
        layout: "topCenter",
        text: mensaje,
        timeout: "3000"
    }).show()
}


class FormatoImpresion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            agregar: "Agregar",
            openDialog: false,
            height: window.innerHeight,
            CreadoPor: localStorage.getItem("UsuarioId"),
            ModificadoPor: localStorage.getItem("UsuarioId"),
            pantalla: 1,
            id:0,
            selected: {},
            dataSucursal: [],
            columns: [
                {
                    headerName: "Acciones",
                    field: "",
                    renderCell: (row) => {
                        return (
                            <div>
                                <a className="btn btn-default btn-xs" onClick={()=>(this.handleModificar(row.row.m_nIdFormato))}><i  className="fa fa-pencil-square-o"
                                    style={{color: "#F9A03E"}}
                                /></a>
                                <a className="btn btn-default btn-xs" onClick={() => (this.handleEliminar(row.row.m_nIdFormato))}><i className="zmdi zmdi-delete" style={{ color: "#F30B0B" }} /></a>
                            </div>
                        )
                    }
                },
                // {
                //     headerName: "Folio",
                //     field: "m_nFolio",
                //     width: 300,
                // },
                {
                    headerName: "Formato",
                    field: "m_sFormato",
                    width: 300,
                }, {
                    headerName: "Tipo Proceso",
                    field: "m_sNombreTipoProceso",
                    width: 200,
                }, {
                    headerName: "Creado El",
                    field: "m_sCreadoEl",
                    width: 200,
                }, {
                    headerName: "Creado Por",
                    field: "m_sCreadoPor",
                    width: 125,
                }, {
                    headerName: "Modificado El",
                    field: "m_sModificadoEl",
                    width: 200,
                }, {
                    headerName: "Modificado Por",
                    field: "m_sModificadoPor",
                    width: 150,
                }
                // {
                //     headerName: "Estatus",
                //     field: "m_nEstatus",
                //     valueFormatter: (params) => `$${parseFloat(params.value).toFixed(2)}`,
                //     width: 125,
                // },

            ]
        }
        this.cambiarPantalla = this.cambiarPantalla.bind(this)
        this.getAllData = this.getAllData.bind(this)
        this.handleEliminar = this.handleEliminar.bind(this)
        this.handleAceptar = this.handleAceptar.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleModificar=this.handleModificar.bind(this)
    }

    componentDidMount() {
        this.getAllData()
    }

    handleEliminar(id) {
        // var derecho;
        // const urlDelete = `${process.env.REACT_APP_API_URL}/Utilerias/ValidaDerechos/${this.state.CreadoPor}/${this.state.DerechoBorrar}/3`;
        // axios.get(urlDelete, { headers }).then(respuesta => {
        //     derecho = respuesta.data;
        //     if (derecho === false) {
        //         showSuccess("El usuario no tiene derechos para realizar el proceso");
        //         return;
        //     }

        const url = `${process.env.REACT_APP_API_URL}/Folios/Eliminar/` + id + `/${this.state.ModificadoPor}`;
        axios.delete(url, { headers }).then(respuesta => {
            console.log(respuesta);
            showSuccess(respuesta.data)
            this.getAllData();
        }).catch(err => {
            showSuccess(err)
        });
        // }).catch(err => {
        //     showSuccess(err)
        // });
    }
    handleModificar(id){
        console.log (id)
        this.setState(state => {
            return {
                ...state,
                pantalla: 2,
                edit: false,
                agregar: "Modificar",
                id: id
            }
        })
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(1).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Agregar').addClass('in show');
    }

    async handleAceptar(id,data) {
        //let file = await toBase64(data.file[0])
        console.log(data)
        var image = null
        if (data.image.length != 0) {
            image = data.image[0]
        }
        var today = new Date();
        var dateStartString = today.getFullYear()+ "-" +   + (today.getMonth() + 1)+ "-"  +today.getDate() + " " + today.getHours() + ":" + today.getMinutes();

        var params = {
            formato: data.formato,
            tipoProceso: data.idTipoProcesoAgregar,
            idUsuario: this.state.CreadoPor,
            fecha: dateStartString,
            modificadoEl:data.modificadoEl
        }

        console.log(params)
        if(this.state.agregar==="Agregar"){
            agregarFormatosImpresion(params,data.file[0],image).then(respuesta => {

                showSuccess(respuesta.data)
                $('.nav-tabs li ').removeClass('active');
                $('.nav-tabs li').eq(0).addClass('active');
                $('.tab-content div ').removeClass('in show');
                $('#Listado').addClass('in show');

                this.getAllData()
                this.setState({ pantalla: 1})
            }).catch(err => {
                console.log(err)
                showSuccess(err)
            });
        }
        else{
            modificarFormatosImpresion(id,params,image).then(respuesta => {

                showSuccess(respuesta.data)
                $('.nav-tabs li ').removeClass('active');
                $('.nav-tabs li').eq(0).addClass('active');
                $('.tab-content div ').removeClass('in show');
                $('#Listado').addClass('in show');

                this.getAllData()
                this.setState({ pantalla: 1,
                    id:0})
            }).catch(err => {
                console.log(err)
                showSuccess(err)
            });
        }



    }

    cambiarPantalla(id) {
        this.setState({ pantalla: id })
    }

    getAllData() {
        obtenerFormatosImpresion().then(respuesta => {
            let formatos=[];
            if(typeof(respuesta.data) === "string"){
                showSuccess(respuesta.data)
            }else{
                formatos=respuesta.data.filter(d=> d.m_sNombreTipoProceso!=='');
            }
            this.setState({ data: formatos, agregar: "Agregar" })
        });
    }

    handleClose() {
        this.setState({ openDialog: false })
        $('.nav-tabs li ').removeClass('active');
        $('.nav-tabs li').eq(0).addClass('active');
        $('.tab-content div ').removeClass('in show');
        $('#Listado').addClass('in show');
        this.setState({ pantalla: 1,id:0 });
    }

    render() {
        const { height, data, columns, edit, consult } = this.state

        return (
            <div>
                {/*<Dialog open={this.state.openDialog} onClose={() => this.setState({openDialog: false, pantalla: 1, edit: false, consult: false, agregar: "Agregar"})} maxWidth={"sm"} fullWidth>*/}
                {/*    <DialogTitle>*/}
                {/*        <h4>Agregando Folios</h4>*/}
                {/*    </DialogTitle>*/}
                {/*    <DialogContent>*/}
                {/*        <AgregarFolio onSubmit={this.handleAceptar} onClose={this.handleClose}/>*/}
                {/*    </DialogContent>*/}
                {/*</Dialog>*/}

                <header className="topbar clearfix">
                    <Cabecera titulo="Formatos de Impresión" >
                        <div className="page-header">
                            <ul className="list-page-breadcrumb">
                                <li>
                                    <a href="/Configuraciones" className="color-mapeo">
                                        Configuración <i className="zmdi zmdi-chevron-right" />
                                    </a>
                                </li>
                                <li className="active-page">Formatos de Impresión</li>
                            </ul>
                        </div>
                    </Cabecera>
                </header>

                {/*Leftbar Start Here*/}
                <aside className="iconic-leftbar" style={{ minHeight: this.state.height }}>
                    <BarraLateralIzquierda />
                </aside>

                <section className="main-container">
                    <div className="container-fluid">


                        <ul className="nav navStatica nav-tabs">
                            <li className="active">
                                <a data-toggle="tab" data_id="1" href="#Listado" onClick={(event) => { event.stopPropagation(); this.setState({ pantalla: 1, edit: false, consult: false, agregar: "Agregar",id:0 }); $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(0).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Listado').addClass('in show'); }}>
                                    <i className="fa fa-list" /> Listado
                                </a>
                            </li>
                            <li >
                                <a data-toggle="tab" data_id="2" href="#Agregar" onClick={(event) => { event.stopPropagation(); this.setState({ pantalla: 2, edit: false, agregar: "Agregar",id:0 }); $('.nav-tabs li ').removeClass('active'); $('.nav-tabs li').eq(1).addClass('active'); $('.tab-content div ').removeClass('in show'); $('#Agregar').addClass('in show'); }}>
                                    <i className="fa fa-plus-circle" /> {this.state.agregar}
                                </a>
                            </li>

                            {/**<button className="topbar-right pull-right">Boton</button>*/}
                        </ul>


                        <div
                            className="row tab-content"
                            style={{ paddingLeft: "-15px" }}
                        >
                            <div id="Listado" className="tab-pane fade in show">
                                <div className="widget-wrap">
                                    <div className="widget-content">
                                        <div className="row" style={{ height: this.state.height - 250, width: '100%' }}>
                                            {data.length !== 0 ? (
                                                <DataGrid
                                                    rows={data}
                                                    columns={columns}
                                                    density="compact"
                                                    pageSize={Math.floor((this.state.height - 310) / 30)}
                                                    getRowId={(row) => row.m_nIdFormato}
                                                    onRowSelectionModelChange={(newModel)=>{
                                                        if(newModel.length<1)
                                                            return
                                                        let row=data.find(i=>i.m_nIdFormato==newModel[0])
                                                        console.log(data.find(i=>i.m_nIdFormato==newModel[0]))
                                                        this.setState(state => {
                                                            return {
                                                                ...state,
                                                                idTarifa: row.m_nIdFormato
                                                            }
                                                        })
                                                    }}
                                                />
                                            ) : (
                                                <div>No se encontró ningún registro</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="Agregar" className="tab-pane fade">
                                {
                                    this.state.pantalla === 2 &&
                                    <AgregarFormatoImpresion onSubmit={this.handleAceptar} onClose={this.handleClose } id={this.state.id}/>
                                }

                            </div>

                        </div>
                    </div>
                </section>
            </div >
        );
    }
}

FormatoImpresion.propTypes = {

};

export default FormatoImpresion;