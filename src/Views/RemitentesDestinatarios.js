import logo from "../logo.svg";
import "../App.css";


import React, { useEffect, useState, setData, useMemo, Component } from "react";

import axios from "axios";
import { FormControl, Input, InputLabel } from "@material-ui/core";

import DataTable from "react-data-table-component";
import Cabecera from "../Components/Template/Cabecera";
import BarraLateralIzquierda from "../Components/Template/BarraLateralIzquierda";
import $ from "jquery";
import { useTable, useFilters, useSortBy } from 'react-table'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

window.jQuery = window.$ = $;
const headers = {
  "Content-Type": "application/json",
};
function App(props) {
  const [dataPais, setDataPais] = React.useState([]);
  const [dataEstado, setDataEstado] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [dataClientes, setDataClientes] = React.useState([]);
  const [dataCP, setDataCP] = React.useState([]);




  const [state, setState] = React.useState({
    showPopUp: false,
    idRemitenteDestinatario: 0,
    idCliente: 0,
    numero: 0,
    nombre: "",
    rfc: "",
    activo: "true",
    calle: "",
    noExterior: 0,
    noInterior: 0,
    colonia: "",
    localidad:"",
    municipio: 0,
    idEstado: 0,
    codigoPostal: 0,
    sucursal: 0,
    creadoPor:0,
    creadoEl:"",
    modificadoPor:"",
    modificadoEl:"",
    contacto:"",
    correoElectronico:"",
    telefono:"",
    agregar: "Agregar",
    importar: ""
})



function getAllClientes() {
  const url = "http://localhost/Clientes/GetListado";
  axios.get(url, { headers }).then((respuesta) => {
    console.log(respuesta);

    setDataClientes(respuesta.data);
  });
}

function getAllCP() {
  const url = "http://localhost/Clientes/GetListado";
  axios.get(url, { headers }).then((respuesta) => {
    console.log(respuesta);

    setDataClientes(respuesta.data);
  });
}


const handleAceptar = (e) => {
  e.preventDefault()
	var params = { 
    "IdCliente": state.idCliente,
    Numero: 0,
    Nombre: "",
    RFC: "",
    Activo: "true",
    Calle: "",
    NoExterior: 0,
    NoInterior: 0,
    Colonia: "",
    Localidad:"",
    Municipio: 0,
    IdEstado: 0,
    CodigoPostal: 0,
    IdSucursal: 0,
    CreadoPor:0,
    CreadoEl:"",
    ModificadoPor:"",
    ModificadoEl:"",
    Contacto:"",
    CorreoElectronico:"",
    Telefono:"",
    agregar: "Agregar",
    importar: ""
	  
  }
  console.log(params)
  if(state.idDepartamento != 0){
    const url = "http://localhost/Departamento/Modificar/" + state.idDepartamento;
    axios.put(url, Object.assign({}, params), {headers}).then(respuesta => {
    alert(respuesta.data)
    window.location.reload();
  }).catch(err => {
    console.log(err)
    alert("err")
  });
  } else {
  const url = "http://localhost/Departamento/Agregar";
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
    const url = "http://localhost/Departamento/Eliminar/" + id;
    axios.delete(url, {headers}).then(respuesta => {
    }).catch(err => {
      alert(err)
    });
  }
  
  function handleShowModificar(row){
    console.log(row.original.m_nIdDepartamento)
    const url = "http://localhost/Departamento/GetById/" + row.original.m_nIdDepartamento;
      axios.get(url, {headers}).then(respuesta => {
        setState({
          ...state,
          agregar: "Modificar",
          showPopUp: true,
          idDepartamento: row.original.m_nIdDepartamento,
          codigoDepartamento: respuesta.data.m_nCodigo,
          descripcionDepartamento: respuesta.data.m_sDescripcion
        })
      });
    }








  const columns2 = React.useMemo(() => [
    {
      Name:"Número",
      accessor: "m_nIdRemitenteDestinatario",
    },{
      Name:"RFC",
      accessor: "m_sRFC",
    },{
      Name:"Remitente-Destinatario",
      accessor: "m_sNombre",
    },{
      Name:"Núm.Cliente",
      accessor: "m_nNumero",
    },{
      Name:"Cliente",
      accessor: "m_sNombreFiscal",
    }
    
    ]);


    const headers = {
      'Content-Type': 'application/json',
    //    'access-control-allow-origin': '*'
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
     
      } = useTable(
          {
              columns,
              data,
              defaultColumn
          },
          useFilters,
          useSortBy
      )
    
      return (
        <div className="col-md-12">
         
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
                        <a href="#" className="btn btn-default btn-sm m-user-delete" onClick={() => (handleEliminar(row.original.m_nIdDepartamento))}><i className="zmdi zmdi-close" /></a>
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
    



  useEffect((value) => {
    getAllPaises();
    getAllDataRemDes();
    getAllClientes();
  }, []);

  function AutoCliente() {
    return (
      <div>
       
        <Autocomplete
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          options={dataClientes.map((option) => option.m_sNombreFiscal)}
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{ ...params.InputProps, type: 'search' }}
            />
          )}
        />
      </div>
    );
  }
  const vars =[
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 },
    { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
    { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: 'Goodfellas', year: 1990 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Seven Samurai', year: 1954 },
    { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
    { title: 'City of God', year: 2002 },
    { title: 'Se7en', year: 1995 },
    { title: 'The Silence of the Lambs', year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: 'Life Is Beautiful', year: 1997 },
    { title: 'The Usual Suspects', year: 1995 },
    { title: 'Léon: The Professional', year: 1994 },
    { title: 'Spirited Away', year: 2001 },
    { title: 'Saving Private Ryan', year: 1998 },
    { title: 'Once Upon a Time in the West', year: 1968 },
    { title: 'American History X', year: 1998 },
    { title: 'Interstellar', year: 2014 },
    { title: 'Casablanca', year: 1942 },
    { title: 'City Lights', year: 1931 },
    { title: 'Psycho', year: 1960 },
    { title: 'The Green Mile', year: 1999 },
    { title: 'The Intouchables', year: 2011 },
    { title: 'Modern Times', year: 1936 },
    { title: 'Raiders of the Lost Ark', year: 1981 },
    { title: 'Rear Window', year: 1954 },
    { title: 'The Pianist', year: 2002 },
    { title: 'The Departed', year: 2006 },
    { title: 'Terminator 2: Judgment Day', year: 1991 },
    { title: 'Back to the Future', year: 1985 },
    { title: 'Whiplash', year: 2014 },
    { title: 'Gladiator', year: 2000 },
    { title: 'Memento', year: 2000 },
    { title: 'The Prestige', year: 2006 },
    { title: 'The Lion King', year: 1994 },
    { title: 'Apocalypse Now', year: 1979 },
    { title: 'Alien', year: 1979 },
    { title: 'Sunset Boulevard', year: 1950 },
    { title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', year: 1964 },
    { title: 'The Great Dictator', year: 1940 },
    { title: 'Cinema Paradiso', year: 1988 },
    { title: 'The Lives of Others', year: 2006 },
    { title: 'Grave of the Fireflies', year: 1988 },
    { title: 'Paths of Glory', year: 1957 },
    { title: 'Django Unchained', year: 2012 },
    { title: 'The Shining', year: 1980 },
    { title: 'WALL·E', year: 2008 },
    { title: 'American Beauty', year: 1999 },
    { title: 'The Dark Knight Rises', year: 2012 },
    { title: 'Princess Mononoke', year: 1997 },
    { title: 'Aliens', year: 1986 },
    { title: 'Oldboy', year: 2003 },
    { title: 'Once Upon a Time in America', year: 1984 },
    { title: 'Witness for the Prosecution', year: 1957 },
    { title: 'Das Boot', year: 1981 },
    { title: 'Citizen Kane', year: 1941 },
    { title: 'North by Northwest', year: 1959 },
    { title: 'Vertigo', year: 1958 },
    { title: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
    { title: 'Reservoir Dogs', year: 1992 },
    { title: 'Braveheart', year: 1995 },
    { title: 'M', year: 1931 },
    { title: 'Requiem for a Dream', year: 2000 },
    { title: 'Amélie', year: 2001 },
    { title: 'A Clockwork Orange', year: 1971 },
    { title: 'Like Stars on Earth', year: 2007 },
    { title: 'Taxi Driver', year: 1976 },
    { title: 'Lawrence of Arabia', year: 1962 },
    { title: 'Double Indemnity', year: 1944 },
    { title: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
    { title: 'Amadeus', year: 1984 },
    { title: 'To Kill a Mockingbird', year: 1962 },
    { title: 'Toy Story 3', year: 2010 },
    { title: 'Logan', year: 2017 },
    { title: 'Full Metal Jacket', year: 1987 },
    { title: 'Dangal', year: 2016 },
    { title: 'The Sting', year: 1973 },
    { title: '2001: A Space Odyssey', year: 1968 },
    { title: "Singin' in the Rain", year: 1952 },
    { title: 'Toy Story', year: 1995 },
    { title: 'Bicycle Thieves', year: 1948 },
    { title: 'The Kid', year: 1921 },
    { title: 'Inglourious Basterds', year: 2009 },
    { title: 'Snatch', year: 2000 },
    { title: '3 Idiots', year: 2009 },
    { title: 'Monty Python and the Holy Grail', year: 1975 },
  ];
  
  

  function getAllDataRemDes() {
    const url = "http://localhost/RemitentesDestinatarios/GetListado";
    axios.get(url, {headers}).then(respuesta => {
      setData(respuesta.data)
    });
  };

  function getAllPaises() {
    const url = "http://localhost/Pais/GetListado";
    axios.get(url, { headers }).then((respuesta) => {

      setDataPais(respuesta.data);
    });
  }


  function onchangeSelectPais(id) {
    getAllEstados(id);
  }

  const [idstate, setidState] = React.useState({
    idPais: 0,
  });

  function getAllEstados(idPais) {
    const url = "http://localhost/Estados/ByPais/" + idPais;
    axios.get(url, { headers }).then((respuesta) => {

      setDataEstado(respuesta.data);
    });
  }
 

  return (
    <div>
      <header className="topbar clearfix">
        <Cabecera />
      </header>
      {/*Topbar End Here*/}
      {/*Leftbar Start Here*/}
      <aside className="iconic-leftbar">
        <BarraLateralIzquierda />
      </aside>

      <section className="main-container">
        <div className="container-fluid">
          <div className="page-header filled full-block light">
            <div className="row">
              <div className="col-md-6 col-sm-6">
                <h2>Remitente/Destinatario</h2>
              </div>
              <div className="col-md-6 col-sm-6">
                <ul className="list-page-breadcrumb">
                  <li>
                    <a href="#">
                      Home <i className="zmdi zmdi-chevron-right" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      Layout <i className="zmdi zmdi-chevron-right" />
                    </a>
                  </li>
                  <li className="active-page"> Dashboard</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        
        <ul className="nav nav-tabs">
          <li className="active">
            <a data-toggle="tab" href="#Listado">
              Listado
            </a>
          </li>
          <li>
            <a data-toggle="tab" href="#Agregar">
              Agregar
            </a>
          </li>
          <li>
            <a data-toggle="tab" href="#Importar">
              Importar
            </a>
          </li>
          <li>
            <a data-toggle="tab" href="#Imprimir">
              Imprimir
            </a>
          </li>
        </ul>

        <div className="tab-content">
        <div className="widget-wrap" id="Listado" className="tab-pane fade in active">
          <div className="widget-wrap">
              <div className="widget-content">
                <div className="row">

                <Table columns={columns2} data={data} />

                </div>
              </div>
          </div>
        </div>
          <div id="Importar" className="tab-pane fade "></div>
          <div id="Imprimir" className="tab-pane fade ">
            Imprimir
          </div>
          <div id="Importar" className="tab-pane fade ">
            Importar
          </div>
          <div id="Agregar" className="tab-pane fade ">
            <div className="row">
              <div className="col-md-12">
                <div className="widget-wrap">
                  <div className="widget-container margin-top-0">
                    <div className="widget-content">
                      <form className="j-forms j-multistep" id="j-forms">
                        {/*Inicio de ejemplo*/}
                        <div className="widget-container">
                          <div className="widget-content">
                            <div className="row">
                              <div className="col-md-12">
                                <form action="#" className="j-forms" noValidate>
                                  <div className="form-content">
                                    <div className="row">
                                      <div className="col-md-6 unit">
                                        <label className="label">Número</label>
                                        <div className="input">
                                          <label
                                            className="icon-left"
                                            htmlFor="text"
                                          >
                                            <i className="fa fa-edit" />
                                          </label>
                                          <input
                                          type="text" pattern="[0-9]*"
                                            className="form-control"
                                            placeholder="Número"
                                            id="text"
                                            name="txtNumber" 
                                            maxlength="4"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-6 unit">
                                        <label className="label">Estatus</label>
                                        <label className="checkbox">
                                          <input
                                            required
                                            native
                                            name="activo"
                                            type="checkbox"
                                          />
                                          <i />
                                          Activo
                                        </label>
                                      </div>
                                    </div>
                                    <div className="unit">
                                      <label className="label">RFC</label>
                                      <div className="input">
                                        <label
                                          className="icon-left"
                                          htmlFor="text"
                                        >
                                          <i className="fa fa-edit" />
                                        </label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="some text"
                                          id="text"
                                        />
                                      </div>
                                    </div>
                                    <div className="unit">
                                      <label className="label">Nombre</label>
                                      <div className="input">
                                        <label
                                          className="icon-left"
                                          htmlFor="text"
                                        >
                                          <i className="fa fa-edit" />
                                        </label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="some text"
                                          id="text"
                                        />
                                      </div>
                                    </div>
                                    <div className="unit">
                                      <label className="label">Cliente</label>
                                    {/*  <input class="form-control" type="text" placeholder="Enter a letter" id="list-autocomplete" name="list-autocomplete"/> */}
                                    <AutoCliente/>
                                    </div>
                                    <div className="row">
                                      <div className="w-section-header">
                                        <h3>Domicilio Fiscal</h3>
                                      </div>
                                      <div class="col-md-8 unit">
                                        <label className="label">País</label>
                                        <label className="input select">
                                          <select
                                            onChange={value => props.input.onChange(value)}

                                            className="form-control"
                                            required
                                            native
                                            name="pais"
                                            
                                          >
                                            <option value="none">País</option>

                                            {dataPais.map((pais) => (
                                              <option value="{pais.m_nIdPais}">
                                                {pais.m_sPais}
                                              </option>
                                            ))}
                                          </select>
                                          <i></i>
                                        </label>
                                      </div>
                                      <div class="col-md-4 unit">
                                        <label className="label">C.P</label>
                                        <div className="input">
                                          <label
                                            className="icon-left"
                                            htmlFor="text"
                                          >
                                            <i className="fa fa-edit" />
                                          </label>
                                          <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Some text"
                                            id="text"
                                            required
                                            native
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="unit">
                                      <label className="label">Estado</label>
                                      <label className="input select">
                                        <select
                                          className="form-control"
                                          required
                                          native
                                          name="estado"
                                        >
                                          <option value="none">Estado</option>

                                          {dataEstado.map((estado) => (
                                            <option value="{estado.m_nIdEstado}">
                                              {estado.m_sEstado}
                                            </option>
                                          ))}
                                        </select>
                                        <i></i>
                                      </label>
                                    </div>
                                    <div class="row">
                                      <div class="col-md-6 unit">
                                        {" "}
                                        <label className="label">
                                          Municipio
                                        </label>
                                        <div className="input">
                                          <label
                                            className="icon-left"
                                            htmlFor="text"
                                          >
                                            <i className="fa fa-edit" />
                                          </label>
                                          <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Municipio"
                                            id="text"
                                          />
                                        </div>{" "}
                                      </div>
                                      <div class="col-md-6 unit">
                                        <label className="label">
                                          Localidad
                                        </label>
                                        <div className="input">
                                          <label
                                            className="icon-left"
                                            htmlFor="text"
                                          >
                                            <i className="fa fa-edit" />
                                          </label>
                                          <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Localidad"
                                            id="text"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="unit">
                                      <label className="label">Colonia</label>
                                      <div className="input">
                                        <label
                                          className="icon-left"
                                          htmlFor="text"
                                        >
                                          <i className="fa fa-edit" />
                                        </label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="Colonia"
                                          id="text"
                                        />
                                      </div>
                                    </div>
                                    <div className="unit">
                                      <label className="label">Calle</label>
                                      <div className="input">
                                        <label
                                          className="icon-left"
                                          htmlFor="text"
                                        >
                                          <i className="fa fa-edit" />
                                        </label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="Calle"
                                          id="text"
                                        />
                                      </div>
                                    </div>
                                    <div class="row">
                                      <div class="col-md-6 unit">
                                        {" "}
                                        <label className="label">
                                          Núm. Exterior
                                        </label>
                                        <div className="input">
                                          <label
                                            className="icon-left"
                                            htmlFor="text"
                                          >
                                            <i className="fa fa-edit" />
                                          </label>
                                          <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Núm. Exterior"
                                            id="text"
                                          />
                                        </div>{" "}
                                      </div>
                                      <div class="col-md-6 unit">
                                        <label className="label">
                                          Núm. Interior
                                        </label>
                                        <div className="input">
                                          <label
                                            className="icon-left"
                                            htmlFor="text"
                                          >
                                            <i className="fa fa-edit" />
                                          </label> 
                                          <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Núm. Interior"
                                            id="text"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="unit">
                                      <label className="label">
                                        Nombre del contacto
                                      </label>
                                      <div className="input">
                                        <label
                                          className="icon-left"
                                          htmlFor="text"
                                        >
                                          <i className="fa fa-edit" />
                                        </label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="Nombre del contacto"
                                          id="text"
                                        />
                                      </div>
                                     
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6 unit">
                                          {" "}
                                          <label className="label">
                                            Teléfonos
                                          </label>
                                          <div className="input">
                                            <label
                                              className="icon-left"
                                              htmlFor="text"
                                            >
                                              <i className="fa fa-edit" />
                                            </label>
                                            <input
                                              className="form-control"
                                              type="text"
                                              placeholder="Teléfonos"
                                              id="text"
                                            />
                                          </div>{" "}
                                        </div>
                                        <div class="col-md-6 unit">
                                          <label className="label">
                                            Correo
                                          </label>
                                          <div className="input">
                                            <label
                                              className="icon-left"
                                              htmlFor="email"
                                            >
                                              <i className="fa fa-envelope-o" />
                                            </label>
                                           
                                    <input className="form-control" type="email" placeholder="email@example.com" name="email" id="email"/>

                                          </div>
                                        </div>
                                      </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
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
    </div>
  );
}

export default App;
