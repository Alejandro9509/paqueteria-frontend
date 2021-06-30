import React, {Component} from 'react'

export default class NavTabs extends Component{
    render(){
        return(
            <ul className="nav nav-tabs">
                <li className="active">
                    <a data-toggle="tab" href="#Domicilio">Domicilio</a>
                </li>
                <li>
                    <a data-toggle="tab" href="#Formatos">Formatos</a>
                </li>
                <li>
                    <a data-toggle="tab" href="#Especiales">Procesos Especiales</a>
                </li>
                <li>
                    <a data-toggle="tab" href="#Adicional">Inf. Adicional</a>
                </li>
            </ul>
        )
    }
}