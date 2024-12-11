import React, {Component} from 'react';
import {dataGridLocaleText} from "../../Constants";
import {DataGrid} from "@mui/x-data-grid";

class InformesPorAsignar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{height:"100%"}}>
                <DataGrid
                    localeText={dataGridLocaleText}
                    rows={this.props.dataInformesAsignados}
                    columns={this.props.columns}
                    density="compact"
                    getRowId={(row) => { return row.m_nIdInforme}}
                />
            </div>
        );
    }
}

InformesPorAsignar.propTypes = {};

export default InformesPorAsignar;
