import React, {useEffect, useState, useMemo} from "react";
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import axios from "axios";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import BarraLateralDerecha from "../Components/Template/BarraLateralDerecha";
import BasicTable from "./BasicTable";
import ExportCSV from '../Components/Template/Export';
import ExportPDF from "../Components/Template/ExportPDF";
import * as XLSX from 'xlsx';
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce, useSortBy } from 'react-table'

function Puesto() {

const [data, setData] = React.useState([])
const [state, setState] = React.useState({
    showPopUp: false,
    idPuesto: 0,
    codigoPuesto: 0,
    puesto: "",
    agregar: "Agregar"
})
const [fileUploaded, setFileUploaded] = React.useState([])


const handleAceptar = (e) => {
  e.preventDefault()
	var params = {

	  "Codigo": state.codigoPuesto,
	  "Puesto": state.puesto,
	  "CreadoPor":1,
    "ModificadoPor":1
  }
  console.log(params)
  if(state.idPuesto != 0){
    const url = "http://localhost/Puesto/Modificar/" + state.idPuesto;
    axios.put(url, Object.assign({}, params), {headers}).then(respuesta => {
    alert(respuesta.data)
    window.location.reload();
  }).catch(err => {
    console.log(err)
    alert("err")
  });
  } else {
  const url = "http://localhost/Puesto/Agregar";
  axios.post(url, Object.assign({}, params), {headers}).then(respuesta => {
    alert(respuesta.data)
    window.location.reload();
  }).catch(err => {
    console.log(err)
    alert(err)
  });
  }

}

function handleEliminar(id){
  const url = "http://localhost/Puesto/Eliminar/" + id;
  axios.delete(url, {headers}).then(respuesta => {
    console.log(respuesta)
  }).catch(err => {
    alert(err)
  });
}

function handleShowModificar(row){
  console.log(row.original.m_nIdPuesto)
  const url = "http://localhost/Puesto/GetById/" + row.original.m_nIdPuesto;
    axios.get(url, {headers}).then(respuesta => {
      console.log(respuesta.data)
      setState({
        ...state,
        agregar: "Modificar",
        showPopUp: true,
        idPuesto: row.original.m_nIdPuesto,
        codigoPuesto: respuesta.data.m_nCodigo,
        puesto: respuesta.data.m_sPuesto
      })
    });
  }

function handleShowAgregar() {
    setState({
      ...state,
      agregar: "Agregar",
      showPopUp: true,
      idPuesto: 0,
      codigoPuesto: 0,
      puesto: ""
    })
}

const handleChange = event => {
  console.log(event.target.id + " : " + event.target.value)
  setState( {
    ...state,
    [event.target.id] : event.target.value
  });
};

  const columns = useMemo(() => [{
    cell: (row) => <div>
          <a data-toggle="tab" data-target="#Agregar" onClick={() => (handleShowModificar(row.m_nIdPuesto))} className="btn btn-default btn-sm m-user-edit"><i className="zmdi zmdi-edit" /></a>
          <a href="#" onClick={() => (handleEliminar(row.m_nIdPuesto))} className="btn btn-default btn-sm m-user-delete"><i className="zmdi zmdi-close" /></a>
      </div>,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
  {
    name:"IdPuesto",
    selector: "m_nIdPuesto",
    omit: "true",
    type: "int"
  },
  {
    visible: true,
    name:"Código",
    selector: "m_nCodigo",
    sortable: true
  },{
    visible: true,
    name:"Puesto",
    selector: "m_sPuesto",
    sortable: true
  },{
    visible: true,
    name:"Creado El",
    selector: "m_dtCreadoEl",
    sortable: true
  },{
    visible: true,
    name:"Creado Por",
    selector: "m_nCreadoPor",
    sortable: true
  },{
    visible: true,
    name:"Modificado El",
    selector: "m_dtModificadoEl",
    sortable: true
  },{
    visible: true,
    name:"Modificado Por",
    selector: "m_nModificadoPor",
    sortable: true
  }
  
  ]);
  
  const columns2 = React.useMemo(() => [
    {
      Name:"Código",
      accessor: "m_nCodigo",
    },{
      Name:"Puesto",
      accessor: "m_sPuesto",
    },{
      Name:"Creado El",
      accessor: "m_dtCreadoEl",
    },{
      Name:"Creado Por",
      accessor: "m_nCreadoPor",
    },{
      Name:"Modificado El",
      accessor: "m_dtModificadoEl",
    },{
      Name:"Modificado Por",
      accessor: "m_nModificadoPor",
    }
    
    ]);

  useEffect(value => {
    getAllData();
  }, []);

  function getAllData() {
    const url = "http://localhost/Puesto/GetListado";
    axios.get(url, {headers}).then(respuesta => {
      setData(respuesta.data)
    });
  };

  const handleUpload = (e) => {
    e.preventDefault();

    var files = e.target.files, f = files[0];
    var reader = new FileReader();
    console.log(e.target.files)
    reader.onload = function (e) {
      console.log("Nothing Happened")
        var data = e.target.result;
        let readedData = XLSX.read(data, {type: 'binary'});
        const wsname = readedData.SheetNames[0];
        const ws = readedData.Sheets[wsname];

        /* Convert array to json*/
        const dataParse = XLSX.utils.sheet_to_json(ws, {header:1});
        console.log("dataParse : " +dataParse)
        setFileUploaded(dataParse);
    };
    reader.readAsBinaryString(f)
}

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <input
      id="search" 
      type="text" 
      placeholder="Filter By Name" 
      aria-label="Search Input" 
      value={filterText} 
      onChange={handleChange} />
    <button type="button" onClick={onClear}>X</button>
  </>
);

const getSubHeaderComponent = () => {

};

const headers = {
  'Content-Type': 'application/json',
//    'access-control-allow-origin': '*'
}

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
      setGlobalFilter(value || undefined)
  }, 200)

  return (
      <span>
          Buscar:{' '}
          <input
              className="form-control"
              value={value || ""}
              onChange={e => {
                  setValue(e.target.value);
                  onChange(e.target.value);
              }}
              placeholder={`${count} registros...`}
          />
      </span>
  )
}

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
      <input
          className="form-control"
          value={filterValue || ''}
          onChange={e => {
              setFilter(e.target.value || undefined)
          }}
          placeholder={`Buscar ${count} registros...`}
      />
  )
}

function Table({ columns, data}) {

  const defaultColumn = React.useMemo(
      () => ({
          // Default Filter UI
          Filter: DefaultColumnFilter,
      }),
      []
  )

  const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      state,
      preGlobalFilteredRows,
      setGlobalFilter,
  } = useTable(
      {
          columns,
          data,
          defaultColumn
      },
      useFilters,
      useGlobalFilter,
      useSortBy
  )

  return (
    <div className="col-md-12">
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <table className="table" {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              <th></th>
              {headerGroup.headers.map(column => (
              // Add the sorting props to control sorting. For this example
              // we can add them into the header props
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Name')}
                {/* Add a sort direction indicator */}
                <span>
                  {column.isSorted
                  ? column.isSortedDesc
                  ? <i className="fa fa-caret-up" />
                  : <i className="fa fa-caret-down" />
                  : ''}
                </span>
                <div>{column.canFilter ? column.render('Filter') : null}</div>
              </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(
            (row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  <td>
                  <div>
                    <a href="#Agregar" role="tab" data-toggle="tab" onClick={() => (handleShowModificar(row))} className="btn btn-default btn-sm m-user-edit"><i className="zmdi zmdi-edit" /></a>
                    <a href="#" className="btn btn-default btn-sm m-user-delete" onClick={() => (handleEliminar(row.original.m_nIdPuesto))}><i className="zmdi zmdi-close" /></a>
                  </div>
                  </td>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )
            }
          )}
        </tbody>
      </table>
    </div>
  )
}

  return (
    <div>

  <header className="topbar clearfix">
    <Cabecera />
  </header>

  {/*Leftbar Start Here*/}
  <aside className="iconic-leftbar">
    <BarraLateralIzquierda />
  </aside>
  {/*Leftbar End Here*/}

  {/*Page Container Start Here*/}
  <section className="main-container">
    <div className="container-fluid">

    <div className="page-header full-block light">
        <h2>Puesto</h2>
      </div>

      <ul className="nav nav-tabs">
          <li className="active">
            <a data-toggle="tab" href="#Listado">
              <i className="fa fa-list"/> Listado
            </a>
          </li>
          <li>
            <a data-toggle="tab" href="#Agregar" onClick={handleShowAgregar}>
            <i className="fa fa-plus-circle"/> {state.agregar}
            </a>
          </li>
          
          <li>
            <ExportCSV csvData={data} fileName="Puesto_Listado" />
          </li>
          <li>
            <ExportPDF data={data} column={columns} fileName="Puesto"/>
          </li>
        </ul>
      
      <div className="row" className="tab-content">
        <div className="widget-wrap" id="Listado" className="tab-pane fade in active">
          <div className="widget-wrap">
              <div className="widget-content">
                <div className="row">
                  <Table columns={columns2} data={data} />
                </div>
              </div>
          </div>
        </div>

        <div className="widget-wrap" id="Agregar" className="tab-pane fade">
          <div className="widget-wrap">
              <div className="widget-content">
                <div className="row">
                  <div className="col-md-12">
                    <form className="j-forms">
                      <div className="form-content">
                        
                        <div className="col-sm-12 col-md-6 unit">
                          <label className="label">
                            Código
                          </label>
                          <div className="input">
                            <label
                              className="icon-left"
                              htmlFor="codigoPuesto"
                            >
                              <i className="fa fa-edit" />
                            </label>
                            <input
                              onChange={handleChange}
                              className="form-control"
                              type="text"
                              placeholder={state.codigoPuesto}
                              id="codigoPuesto"
                            />
                          </div>
                        </div>
                        
                        <div className="col-sm-12 col-md-6 unit">
                          <label className="label">
                            Descripción
                          </label>
                          <div className="input">
                            <label
                              className="icon-left"
                              htmlFor="puesto"
                            >
                              <i className="fa fa-edit" />
                            </label>
                            <input
                              onChange={handleChange}
                              className="form-control"
                              type="text"
                              placeholder={state.puesto}
                              id="puesto"
                            />
                          </div>
                        </div>

                      </div>
                      <br></br>
                      <div className="form-footer" className="col-md-12">
                        <button data-layout="topCenter" data-type="information" className="btn btn-primary secondary-btn">Cancelar</button>
                        <button onClick={handleAceptar} className="btn btn-primary primary-btn">Aceptar</button>
                      </div>
                    </form>
                  </div>
                </div>
            </div>
          </div>
        </div>
      
      
      </div>
    </div>

  </section>
  {/*Page Container End Here*/}

  {/*Rightbar Start Here*/}
  <aside className="rightbar">
    <BarraLateralDerecha />
  </aside>

</div>

  );
}

export default Puesto;
