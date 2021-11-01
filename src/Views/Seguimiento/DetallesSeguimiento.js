import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Stepper, Step, StepLabel, StepContent, Button, Paper} from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Check from '@material-ui/icons/Check';
import SettingsIcon from '@material-ui/icons/Settings';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import StepConnector from '@material-ui/core/StepConnector';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  step: {
    fontSize: '16em'
  }
}));


const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      borderColor: '#F9A03E',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#F9A03E',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 70,
    height: 70,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#F9A03E',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundColor: '#F9A03E',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
  };

  return (
      <div
          className={clsx(classes.root, {
            [classes.active]: active,
            [classes.completed]: completed,
          })}
      >
        {icons[String(props.icon)]}
      </div>
  );
}

// function getSteps() {
//   return ['Pendiente', 'Documentado', 'En Ruta', 'Completado', 'Cancelado'];
// }
function getSteps() {
  return [
    
    {
      m_nIdEstatusGuia:4,
      m_sAbreviacion:"Pen",
      m_sEstatus:"Pendiente",
      m_sDescripcion:"No cuenta con informe asignado",
      m_sColor:"#FDBC0547"
    },
    {
      m_nIdEstatusGuia:5,
      m_sAbreviacion:"Docu",
      m_sEstatus:"Documentado",
      m_sDescripcion:"Con informe asignado, pero no ha salido a ruta",
      m_sColor:"#0ABF1047"
    },
    {
      m_nIdEstatusGuia:6,
      m_sAbreviacion:"E\/R",
      m_sEstatus:"En Ruta",
      m_sDescripcion:"Cuando el viaje relacionado al informe en el que se encuentra la gu\u00eda tiene salida",
      m_sColor:"#F9A03E47"
    },
    {
      m_nIdEstatusGuia:14,
      m_sAbreviacion:"U\/M",
      m_sEstatus:"Última Milla",
      m_sDescripcion:"La guía se encuentra en proceso de última milla",
      m_sColor:"#F9A03E47"
    },
    {
      m_nIdEstatusGuia:17,
      m_sAbreviacion:"RUTA U\/M",
      m_sEstatus:"En Ruta UltimaMilla",
      m_sDescripcion:"La guía se encuentra en ruta",
      m_sColor:"#F9A03E47"
    },
    {
      m_nIdEstatusGuia:18,
      m_sAbreviacion:"Ent",
      m_sEstatus:"Entregada",
      m_sDescripcion:"La guía fue entregada en el domicilio",
      m_sColor:"#F9A03E47"
    },
    {
      m_nIdEstatusGuia:19,
      m_sAbreviacion:"Ent C",
      m_sEstatus:"Entrega Cancelada",
      m_sDescripcion:"La guía no pudo ser entregada",
      m_sColor:"#F70F2647"
    },
    {
      m_nIdEstatusGuia:7,
      m_sAbreviacion:"Com",
      m_sEstatus:"Completado",
      m_sDescripcion:"Cuando el viaje relacionado al informe que contiene la gu\u00eda fue entregado a su destino, es decir el viaje\/parada tiene llegada",
      m_sColor:"#0982AD47"
   },
   {
    m_nIdEstatusGuia:8,
    m_sAbreviacion:"Cance",
    m_sEstatus:"Cancelado",
    m_sDescripcion:"Gu\u00eda cancelada",
    m_sColor:"#F70F2647"
    }
  ];
}
function getStepsRecoleccion() {
  return [

    {
      m_nIdEstatusGuia:1,
      m_sAbreviacion:"Pen",
      m_sEstatus:"Pendiente",
      m_sDescripcion:"No cuenta con embarque asignado",
      m_sColor:"#FDBC0547"
    },
    {
      m_nIdEstatusGuia:2,
      m_sAbreviacion:"Docu",
      m_sEstatus:"Documentado",
      m_sDescripcion:"Recolección asignada a un embarque",
      m_sColor:"#0ABF1047"
    },
    {
      m_nIdEstatusGuia:3,
      m_sAbreviacion:"E\/R",
      m_sEstatus:"En Ruta",
      m_sDescripcion:"Recolección con salida registrada",
      m_sColor:"#F9A03E47"
    },
    {
      m_nIdEstatusGuia:4,
      m_sAbreviacion:"Com",
      m_sEstatus:"Completado",
      m_sDescripcion:"Recolección terminada, se le dio llegada a siguiente punto de registro",
      m_sColor:"#0982AD47"
    },
    {
      m_nIdEstatusGuia:5,
      m_sAbreviacion:"Cance",
      m_sEstatus:"Cancelado",
      m_sDescripcion:"Recolección cancelada                                                           ",
      m_sColor:"#F70F2647"
    },
    {
      m_nIdEstatusGuia:6,
      m_sAbreviacion:"Pen A",
      m_sEstatus:"Pendiente Aprobar",
      m_sDescripcion:"La recolección se encuentra pendiente de aprobar",
      m_sColor:"#F70F2647"
    }
  ];
}

function castStatus(status){
  switch(status){
    case 4: return 0;
    case 5: return 1;
    case 6: return 2;
    case 7: return 8;
    case 8: return 9;
    case 14: return 3;
    case 17: return 4;
    case 18: return 5;
    case 19: return 6;
  }
}
function castStatusRecoleccion(status){
  return status-1
}

export default function DetallesSeguimiento({guia}) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = guia.m_bEsRecoleccion ? getStepsRecoleccion() :getSteps();

  useEffect(value =>{
    if (guia !== undefined){
      const status = guia.m_bEsRecoleccion ? castStatusRecoleccion(guia.m_nIdEstatusRecoleccion) : castStatus(guia.m_nIdEstatusGuia);
      console.log(status);
      setActiveStep(status)
    }

  }, [guia])

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      {/*<Stepper activeStep={activeStep} alternativeLabel connector={<ColorlibConnector />} >
        {steps.map((value, index) => (
          <Step key={index}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{value.m_sEstatus}</StepLabel>
          </Step>
        ))}
      </Stepper>*/}

      <div style={{marginLeft:100, marginRight:100, paddingBottom:10}}>
        <h4>ESTATUS DE LA CARGA:</h4>
        <h1>{guia.m_bEsRecoleccion ? guia.m_sEstatusRecoleccion : guia.m_sEstatusGuia}</h1>
      </div>
    </div>
  );
}
