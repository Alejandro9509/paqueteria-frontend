import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography,Button, makeStyles, Slider, Checkbox } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { List, ListItem, ListItemIcon, ListItemText, TableBody, TableCell, TableContainer, TableHead, TableRow, Table, withStyles} from "@material-ui/core";
import PropTypes from 'prop-types';
import { DataGrid } from '@material-ui/data-grid';
export default function ImprimirEtiquetas2(props) {

  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [valuePage, setValuePage] = React.useState([0, 0]);
  const [idsPaquetesSeleccionadas,setIdsPaquetesSeleccionadas] = React.useState([])
  const [Paquetes,setPaquetes] = React.useState([])
  const handleChange = (event, newValue) => {

    setValue(newValue);
  };
  const handleChangePages = (event, newValue) => {
    setValuePage(newValue);
  };
  const handleToggle = (value) =>{
    const currentIndex = idsPaquetesSeleccionadas.indexOf(value);
    let nuevoChecado = [...idsPaquetesSeleccionadas];

    if (currentIndex === -1) {
        nuevoChecado.push(value);
    } else {
        nuevoChecado.splice(currentIndex, 1);
    }
    setIdsPaquetesSeleccionadas(nuevoChecado);
  };


useEffect(()=>{
 let arrayAux = props.detallesPaquetesEtiquetas.map((paquetes)=>{
    let paquete = { 
      "m_nIdEmbarqueDetalle":0,
      "m_nCantidad":0,
      "m_nRango":[0,0],
      "m_sEmbalaje":""
  }; 
    paquete.m_nIdEmbarqueDetalle = paquetes.m_nIdEmbarqueDetalle
    paquete.m_nCantidad = paquetes.ctd
    paquete.m_nRango = [0,0]
    paquete.m_sEmbalaje = paquetes.m_sEmbalaje
    return paquete
  })
  setPaquetes(arrayAux)
  console.log(JSON.stringify(arrayAux))
},[props.open])

  return (
   <form  onSubmit={(e) => {e.preventDefault();props.handleImprimirEtiquetas(idsPaquetesSeleccionadas)}}>
    <DialogTitle>
        <Box display="flex">
            <Box width="90%"><Typography variant={"h1"}>Etiquetas</Typography>
            </Box>
            <Box width="10%">
                            <IconButton aria-label="close" onClick={() => props.closeEtiquetas()}
                                        style={{position: 'absolute', right: '20px', top: '20px', padding: '5px'}}>
                                <CloseIcon style={{fontSize: '30px'}}/>
                            </IconButton>
                        </Box>
        </Box>
    </DialogTitle>

    <DialogContent>
    <div className={classes.root}>
            {/*------------------------------TABS--------------------------------------*/}
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        {Paquetes.map((paquete,index)=>{
          return (
            <Tab label={paquete.m_sEmbalaje} {...a11yProps(index)} />
          );
        })}
      </Tabs>

      {/*------------------------------TAB PANEL--------------------------------------*/}



      {Paquetes.map((paquete,index,array)=>{

          return (
            <TabPanel value={value} index={index} className={classes.tab}>
            <Table >
                <TableHead>
                  <TableRow  key={index}>
                  <TableCell align="right">Seleccionado&nbsp;</TableCell>
                    <TableCell align="center">Identificador&nbsp;</TableCell>
                    <TableCell align="center">Rango&nbsp;</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody id="rows" >
                    <TableRow key={index} > 
                    <TableCell padding="checkbox" align="center">
                      <Checkbox
                      checked={idsPaquetesSeleccionadas.indexOf(paquete) !== -1}
                      onChange={()=>handleToggle(paquete)}
                      />
                      </TableCell>
                      <TableCell align="center">{paquete.m_nIdEmbarqueDetalle}</TableCell>
                      <TableCell align="center">
              <Slider
              value={paquete.m_nRango}
              onChange={(event,newValue)=>{
                paquete.m_nRango = newValue
                array[index] = paquete
               // console.log(JSON.stringify(array))
                setPaquetes(array)
                setIdsPaquetesSeleccionadas([...array]);
              }} 
              valueLabelDisplay="on"
              aria-labelledby="range-slider"
              min={0}
              disabled={idsPaquetesSeleccionadas.indexOf(paquete) == -1}
              max={paquete.m_nCantidad}
            />

</TableCell>
                    </TableRow>        
              
        </TableBody>
      </Table>

            </TabPanel>
          );
        })}
 
    </div>
    </DialogContent>
    <DialogActions>
    <Box display="flex">
        <Button size="medium" type={"submit"} variant={"contained"} color={"primary"}
                onClick={(e) =>{
                  props.handleImprimirTodasEtiquetas()
                  props.closeEtiquetas()
                }} 
                className={classes.botonesImprimir}>Imprimir Todas</Button>
        <Button size="medium" type={"submit"} variant={"contained"} color={"primary"}
                onClick={(e) =>props.closeEtiquetas()}  className={classes.botonesImprimir}>Imprimir</Button>
    </Box>
    </DialogActions>
</form>
  )
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 224,
    width:'100%'
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tab:{
    width:'100%'
  },
botonesImprimir:{
  margin:'0 10px'
}
}));