import React, {useEffect} from 'react';
import Cabecera from "../../Components/Template/Cabecera";
import BarraLateralIzquierda from "../../Components/Template/BarraLateralIzquierda";
import {ReactComponent as GClienteIcon} from "../../iconos/Catalogos/Icono Grupo Clientes/icono_grupo_cliente.svg";
import GrupoClientePage from "../GrupoCliente";
import {makeStyles} from "@material-ui/core/styles";
import {Button, ButtonBase, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {obtenerAtajosUsuario, obtenerTodosAtajos} from "../../Util/Contexts/AccesosDirectosContext";


const useStyles = makeStyles((theme) => ({
    root: {
        width: '33%',
        backgroundColor: theme.palette.background.paper,
    },
}));

/*const allShortcuts =[
    {
        id: 0,
        path: "/GrupoCliente",
        name: "Grupo Clientes1",
        icon:  <GClienteIcon style={{width:30, height:30}}/>,
        component: GrupoClientePage,
    },{
        id: 1,
        path: "/GrupoCliente",
        name: "Grupo Clientes2",
        icon:  <GClienteIcon style={{width:30, height:30}}/>,
        component: GrupoClientePage,
    },{
        id: 2,
        path: "/GrupoCliente",
        name: "Grupo Clientes3",
        icon:  <GClienteIcon style={{width:30, height:30}}/>,
        component: GrupoClientePage,
    },{
        id: 3,
        path: "/GrupoCliente",
        name: "Grupo Clientes4",
        icon:  <GClienteIcon style={{width:30, height:30}}/>,
        component: GrupoClientePage,
    },
];*/
/*const userShortcuts =[
    {
        id: 4,
        path: "/GrupoCliente",
        name: "Grupo Clientes5",
        icon:  <GClienteIcon style={{width:30, height:30}}/>,
        component: GrupoClientePage,
    },{
        id: 5,
        path: "/GrupoCliente",
        name: "Grupo Clientes6",
        icon:  <GClienteIcon style={{width:30, height:30}}/>,
        component: GrupoClientePage,
    },{
        id: 6,
        path: "/GrupoCliente",
        name: "Grupo Clientes7",
        icon:  <GClienteIcon style={{width:30, height:30}}/>,
        component: GrupoClientePage,
    },{
        id: 7,
        path: "/GrupoCliente",
        name: "Grupo Clientes8",
        icon:  <GClienteIcon style={{width:30, height:30}}/>,
        component: GrupoClientePage,
    },
];*/

export default function AccesosDirectos(){
    const classes = useStyles();
    const [allAtajos, setAllAtajos] = React.useState([
        /*{
            id: 0,
            path: "/GrupoCliente",
            name: "Grupo Clientes1",
            icon:  <GClienteIcon style={{width:30, height:30}}/>,
            component: GrupoClientePage,
        },{
            id: 1,
            path: "/GrupoCliente",
            name: "Grupo Clientes2",
            icon:  <GClienteIcon style={{width:30, height:30}}/>,
            component: GrupoClientePage,
        },{
            id: 2,
            path: "/GrupoCliente",
            name: "Grupo Clientes3",
            icon:  <GClienteIcon style={{width:30, height:30}}/>,
            component: GrupoClientePage,
        },{
            id: 3,
            path: "/GrupoCliente",
            name: "Grupo Clientes4",
            icon:  <GClienteIcon style={{width:30, height:30}}/>,
            component: GrupoClientePage,
        },*/
        ]);
    const [userAtajos, setUserAtajos] = React.useState([]);

    const [disableButtons, setButtonsDisable] = React.useState(true);
    const [disableSaveButton, setSaveButtonDisable] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState();
    const [selectedItem, setSelectedItem] = React.useState();

    useEffect(() => {
        obtenerAtajosUsuario(localStorage.getItem("UsuarioId")).then((respuesta) => {
            console.log(respuesta)
            // setUserAtajos(respuesta.data)
            // setAllAtajos(respuesta.data)
        })

    }, [])

    /**Elimina un elemento del array*/
    function arrayRemove(arr, value) {

        return arr.filter(function(ele){
            return ele != value;
        });
    }
    /**Hace compara dos valores, se usa para acomodar los atajos*/
    function compare(a, b) {
        const A = a.name;
        const B = b.name;

        let comparison = 0;
        if (A > B) {
            comparison = 1;
        } else if (A < B) {
            comparison = -1;
        }
        return comparison;
    }

    const handleAgregarClick = () =>{
        if (userAtajos.includes(selectedItem)){
            return
        }
        userAtajos.push(selectedItem);
        userAtajos.sort(compare);
        setUserAtajos(userAtajos);
        setAllAtajos(arrayRemove(allAtajos, selectedItem).sort(compare));
        // console.log(userAtajos);
    }
    const handleRegresarClick = () =>{
        if (allAtajos.includes(selectedItem)){
            return
        }
        allAtajos.push(selectedItem);
        allAtajos.sort(compare);
        setAllAtajos(allAtajos);
        setUserAtajos(arrayRemove(userAtajos, selectedItem).sort(compare));
        console.log(allAtajos);
    }
    const handleRegresarTodoClick = () => {
        userAtajos.map((item) => (
            allAtajos.push(item)
        ))
        allAtajos.sort(compare);
        userAtajos.length = 0;
        setAllAtajos(allAtajos);
        setUserAtajos(userAtajos);
        console.log(allAtajos);
        console.log(userAtajos);
    }
    const handleListItemClick = (event, index, atajo) => {
        setSelectedIndex(index);
        setSelectedItem(atajo);
        setButtonsDisable(false);
    };
    return (
        <div>
            <header className="topbar clearfix">
                <Cabecera titulo="Accesos directos" >
                    <div className="page-header">
                        <ul className="list-page-breadcrumb">
                            <li className="active-page"> Accesos directos</li>
                        </ul>
                    </div>
                </Cabecera>
            </header>
            <aside className="iconic-leftbar">
                <BarraLateralIzquierda />
            </aside>
            <section className="main-container">
                <div className="container-fluid">
                    <div className="widget-wrap">

                        <div style={{
                            display:'flex',
                            flexDirection: "row",
                            justifyContent: "center"
                        }}>
                            <List component="nav" aria-label="main mailbox folders" style={{width: '33%'}}>
                                {allAtajos.map((atajo, index) => (
                                    <ListItem
                                        key={atajo.m_nIdProceso}
                                        button
                                        selected={selectedIndex === atajo.m_nIdProceso}
                                        onClick={(event) => handleListItemClick(event, index, atajo)}>
                                        {/*<ListItemIcon>
                                            {atajo.icon}
                                        </ListItemIcon>*/}
                                        <ListItemText primary={atajo.m_sNombreAtajo} />
                                    </ListItem>
                                ))}
                            </List>

                            <div style={{
                                display:"flex",
                                flexDirection:"column"
                            }}>
                                <Button
                                    variant={"contained"}
                                    color={"primary"}
                                    disabled={disableButtons}
                                    onClick={handleAgregarClick}
                                    style={{width: 100, height:100, margin: 5}}>Pasar</Button>
                                <Button
                                    variant={"contained"}
                                    color={"primary"}
                                    disabled={disableButtons}
                                    onClick={handleRegresarClick}
                                    style={{width: 100, height:100, margin: 5}}>Regresar</Button>
                                <Button
                                    variant={"contained"}
                                    color={"primary"}
                                    disabled={disableButtons}
                                    onClick={handleRegresarTodoClick}
                                    style={{width: 100, height:100, margin: 5}}>Regresar Todo</Button>
                            </div>

                            <List component="nav" aria-label="main mailbox folders" style={{width: '33%'}}>
                                {userAtajos.map((atajo, index) => (
                                    <ListItem
                                        button
                                        key={atajo.m_nIdProceso}
                                        selected={selectedIndex === atajo.m_nIdProceso}
                                        onClick={(event) => handleListItemClick(event, index, atajo)}>
                                        {/*<ListItemIcon>
                                            {atajo.icon}
                                        </ListItemIcon>*/}
                                        <ListItemText primary={atajo.m_sNombreAtajo} />
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                        <div style={{
                            display:'flex',
                            flexDirection: "row",
                            justifyContent: "flex-end"
                        }}>
                            <Button variant={"contained"} color={"primary"} disabled={disableSaveButton}>Guardar</Button>
                        </div>
                        {/*<Button variant={"contained"} color={"primary"}>Salir</Button>*/}
                    </div>
                </div>
            </section>

        </div>
        )

}