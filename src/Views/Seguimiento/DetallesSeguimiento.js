import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Stepper, Step, StepLabel, StepContent, Button, Paper} from '@material-ui/core/';

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

function castStatus(status){
  switch(status){
    case 4: return 0;
    case 5: return 1;
    case 6: return 2;
    case 7: return 3;
    case 8: return 5;
  }
}

export default function DetallesSeguimiento(props) {
  const estatusGuia = props.estatusGuia;
  const classes = useStyles();
  const steps = getSteps();
  const status = castStatus(estatusGuia);
  console.log(status);
  const [activeStep, setActiveStep] = React.useState(status);
  

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((value, index) => (
          <Step key={index}>
            <StepLabel>{value.m_sEstatus}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
