import React, {useEffect} from "react";
import DataTable from 'react-data-table-component';
import axios from "axios";
import { obtenerDepartamentos } from "../../Util/Contexts/DepartamentoContext";

function TablaDepartamento() {
  const headers = {
    'Content-Type': 'application/json'
  }
  
  const modificar = () => {
    alert("Hello World")
  }
  
  const columns = [ {
    name:"IdDepartamento",
    selector: "m_nIdDepartamento",
    omit: "true",
    type: "int"
  },
  {
    cell: () => <div>
          <button href="#"  data-bb="departamento_modal" className="btn btn-default btn-sm" onClick= {() => {modificar()}}><i className="fa fa-pencil-square-o"style={{color:"#F9A03E"}} /></button>
          <a href="#" className="btn btn-default btn-sm" onClick= {() => {modificar()}}><i className="zmdi zmdi-delete"  style={{color:"#F30B0B"}} /></a>
      </div>,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
  {
    visible: true,
    name:"Código",
    selector: "m_nCodigo",
  },{
    visible: true,
    name:"Descripción",
    selector: "m_sDescripcion",
  },{
    visible: true,
    name:"Creado El",
    selector: "m_dtCreadoEl",
  },{
    visible: true,
    name:"Creado Por",
    selector: "m_nCreadoPor",
  },{
    visible: true,
    name:"Modificado El",
    selector: "m_dtModificadoEl",
  },{
    visible: true,
    name:"Modificado Por",
    selector: "m_nModificadoPor",
  }
  
  ];

  const [state, setState] = React.useState({
    showing: true
  })

  const [data, setData] = React.useState([])

  useEffect(value => {
    getAllData();
  }, []);

  async function getAllData() {
    obtenerDepartamentos().then(respuesta => {
      setData(respuesta.data)
    });
  };

  return (
    <div>
  {/*Page Container Start Here*/}
		<div className="widget-wrap" id="Listado" className="tab-pane fade in active">
			<DataTable
      	title = "Departamentos"
        columns={columns}
        data={data}
        responsive = "true"
        ignoreRowClick = "true"
        button = "true"
      />  
		</div>
  {/*Page Container End Here*/}
</div>

  );
}

export default TablaDepartamento;
