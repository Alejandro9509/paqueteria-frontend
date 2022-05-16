import React from 'react'
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import Cabecera from "../../Components/Template/Cabecera";
function Seguros() {
  return (
    <div>
  <header className="topbar clearfix">
                <Cabecera titulo="Seguros" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li>
                                <a href="/Catalogos" className="color-mapeo">
                                    Catálogos <i className="zmdi zmdi-chevron-right" />
                                </a>
                            </li>
                            <li className="active-page">Seguros</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>

            {/*Leftbar Start Here*/}
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>
            {/*Leftbar End Here*/}

            <section className="main-container">

<div className="container-fluid">





</div>

</section>


    </div>
  )
}

export default Seguros