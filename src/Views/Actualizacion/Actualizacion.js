import React from 'react';
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import ArchivosListado from "../../Components/Template/ArchivosListado";
import file_1 from '../../Files/Actualizacion/Version 8.0.0.13.pdf';
import file_2 from '../../Files/Actualizacion/Version 8.0.1.17.pdf';
import file_3 from '../../Files/Actualizacion/Version 8.0.2.14.pdf';

const archivos= [
    {
        file: file_1,
        name: "Version 8.0.0.13.pdf",
    },
    {
        file: file_2,
        name: "Version 8.0.1.17.pdf",
    },
    {
        file: file_3,
        name: "Version 8.0.2.14.pdf",
    },
]

export default function Actualizacion() {
    return (
        <div>
            <header className="topbar clearfix">
                <Cabecera titulo="Actualización" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li className="active-page"> Actualización</li>
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