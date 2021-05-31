import React from 'react';
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import ArchivosListado from "../../Components/Template/ArchivosListado";
import file_1 from '../../Files/Tutoriales/1- ANTES DE EMPEZAR, LEEME.pdf';
import file_2 from '../../Files/Tutoriales/2- CONFIGURE INDICADORES.pdf';
import file_3 from '../../Files/Tutoriales/3- ANTES DE HACER CARTA PORTE Y FACTURA POR PRIMERA VEZ.pdf';

const archivos = [
    {
        file: file_1,
        name: "1- Antes de empezar, leeme.pdf",
    },
    {
        file: file_2,
        name: "2- Configure indicadores.pdf",
    },
    {
        file: file_3,
        name: "3- ANTES DE HACER CARTA PORTE Y FACTURA POR PRIMERA VEZ.pdf",
    },
]

export default function Tutoriales() {
    return (
        <div>
            <header className="topbar clearfix">
                <Cabecera titulo="Tutoriales" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li className="active-page"> Tutoriales</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>
            <ArchivosListado archivos={archivos}/>
        </div>
    )
}