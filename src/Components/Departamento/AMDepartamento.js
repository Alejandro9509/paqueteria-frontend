import React from "react";

function AMDepartamento() {

    return (
        <div>
            {/*Page Container Start Here*/}
            <div className="widget-wrap" id="Agregar" className="tab-pane fade">
                <form className="form-horizontal">
                    <div className="form-group">
                        <label className="col-md-4 control-label" forHTML="codigo">Código</label>
                        <div className="col-md-4">
                            <input id="codigo" name="codigo" type="number" placeholder="Código" className="form-control input-md"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-4 control-label" forHTML="descripcion">Descripción</label>
                        <div className="col-md-4">
                            <input id="descripcion" name="descripcion" type="text" placeholder="Descripción" className="form-control input-md"/>
                        </div>
                    </div>
                </form>
            </div>
            {/*Page Container End Here*/}
        </div>

    );
}

export default AMDepartamento;
