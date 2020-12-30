import React, {useEffect} from "react";
import DataTable from 'react-data-table-component';
import axios from "axios";

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
          <button href="#"  data-bb="departamento_modal" className="btn btn-default btn-sm m-user-edit" onClick= {() => {modificar()}}><i className="zmdi zmdi-edit" /></button>
          <a href="#" className="btn btn-default btn-sm m-user-delete" onClick= {() => {modificar()}}><i className="zmdi zmdi-close" /></a>
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
    const url = `${process.env.REACT_APP_API_URL}/Departamento/GetListado`;
    await axios.get(url, {headers}).then(respuesta => {
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
