import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Divider,
    Grid,
    Step,
    StepLabel,
    Stepper,
    Tab,
    Tabs,
    Typography,
    withStyles
} from "@material-ui/core";
import Timeline from "react-time-line";
import StepConnector  from '@material-ui/core/StepConnector';
import clsx from "clsx";
import {Check} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import PaquetesList from "./PaquetesList";
import RemitenteDestinatario from "./RemitenteDestinatario";


class TrackingEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0,
        }
        this.handleChangeTab = this.handleChangeTab.bind(this)
    }

    handleChangeTab(event, newValue){
        this.setState({activeTab: newValue})
    }
    render() {
        function QontoStepIcon(props) {
            const classes = useQontoStepIconStyles();
            const { active, completed } = props;

            return (
                <div
                    className={clsx(classes.root, {
                        [classes.active]: active,
                    })}
                >
                    {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
                </div>
            );
        }

        const useQontoStepIconStyles = makeStyles({
            root: {
                color: '#eaeaf0',
                display: 'flex',
                height: 22,
                alignItems: 'center',
            },
            active: {
                color: '#F9A03E',
            },
            circle: {
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'currentColor',
            },
            completed: {
                color: '#F9A03E',
                zIndex: 1,
                fontSize: 18,
            },
        });



        const QontoConnector = withStyles({
            alternativeLabel: {
                top: 10,
                left: 'calc(-50% + 16px)',
                right: 'calc(50% + 16px)',
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
                borderColor: '#eaeaf0',
                borderTopWidth: 3,
                borderRadius: 1,
            },
        })(StepConnector);

        return (
            <Grid container spacing={2} justify="center" style={{padding:"5px"}}>
                <Grid item sx={12} md={12}>
                    <Typography variant={"h4"}>{this.props.data.m_sNombreResponsablePago}</Typography>
                </Grid>
                <Grid item sx={12} md={12}>
                    <Typography variant={"h5"}>Número de rastreo: <b>{this.props.data.m_sTracking}</b></Typography>

                    <Grid item sx={12} md={12}>
                        <Typography align={"center"}  variant={"h3"}>{this.props.data.m_sEstatusSeguimiento}</Typography>
                    </Grid>
                    {
                        this.props.data.m_nEstatusSeguimiento === 2 &&
                        <Grid item sx={12} md={12}>
                            <Typography align={"center"}  variant={"h3"}>Recibió: {this.props.data.m_sReceptor}</Typography>
                        </Grid>
                    }

                <Grid item sx={12} md={12}>
                    <Box sx={{ width: '100%' }}>
                        <Stepper alternativeLabel activeStep={this.props.data.m_nEstatusSeguimiento} connector={<QontoConnector />}>
                            {[this.props.data.m_bAplicaRecoleccion ? "Recolectado" : "Documentado","En ruta", "Entregado"].map((label) => (
                                <Step key={label}>
                                    <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                </Grid>
                <Grid item sx={12} md={12}>
                    <RemitenteDestinatario data={this.props.data}/>
                </Grid>
                <Grid item sx={12} md={12}>

                    <Tabs variant={"standard"} centered value={this.state.activeTab} onChange={this.handleChangeTab} >
                            <Tab label="Historial de viaje"/>
                            <Tab label="Detalle del paquete" />
                        </Tabs>
                    <TabPanel value={this.state.activeTab} index={0}>
                        <div lang={"es"} style={{
                            marginTop: "4px",
                            padding: "5px",
                            borderRadius: "10px"
                        }}>
                            <Timeline items={this.props.data.bitacora ? this.props.data.bitacora.map(b => ({
                                ts: b.Fecha + "T" + b.Hora,
                                text: b.Descripcion
                            })) : []} format="hh:mm a"/>

                        </div>
                    </TabPanel>
                    <TabPanel value={this.state.activeTab} index={1}>
                        <PaquetesList paquetes={this.props.data.paquetes}/>
                    </TabPanel>
                </Grid>
            </Grid>
            </Grid>
        );
    }
}

TrackingEmail.propTypes = {};

export default TrackingEmail;

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
