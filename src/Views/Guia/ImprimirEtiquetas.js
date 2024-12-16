import {
    Box,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Button,
    Slider,
    Checkbox,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, {useEffect} from 'react'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Table,
} from "@mui/material";
import PropTypes from 'prop-types';

const PREFIX = 'ImprimirEtiquetas';

const classes = {
    root: `${PREFIX}-root`,
    tabs: `${PREFIX}-tabs`,
    tab: `${PREFIX}-tab`,
    botonesImprimir: `${PREFIX}-botonesImprimir`
};

const Root = styled('div')((
    {
        theme
    }
) => ({
    [`&.${classes.root}`]: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 224,
        width: '100%'
    },

    [`& .${classes.tabs}`]: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },

    [`& .${classes.tab}`]: {
        width: '100%'
    },

    [`& .${classes.botonesImprimir}`]: {
        margin: '0 10px'
    }
}));

export default function ImprimirEtiquetas(props) {
    const [value, setValue] = React.useState(0);
    const [Paquetes, setPaquetes] = React.useState([])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleToggle = (value, event) => {
        const currentIndex = Paquetes.indexOf(value);
        let nuevoChecado = [...Paquetes];
        nuevoChecado[currentIndex].checked = event.target.checked
        setPaquetes(nuevoChecado);
    };

    const imprimirTodasEtiquetas = (value) => {
        let arrayAux = props.detallesPaquetesEtiquetas.map((paquetes) => {
            return {
                "m_nIdEmbarqueDetalle": paquetes.m_nIdEmbarqueDetalle,
                "m_nCantidad": paquetes.ctd,
                "m_nRango": [1, paquetes.ctd],
                "m_sEmbalaje": paquetes.m_sEmbalaje,
                "m_sDescripcion": paquetes.m_sDescripcion,
                "checked": true
            }
        })
        props.closeEtiquetas(arrayAux.filter((i) => i.checked))
    }

    useEffect(() => {
        // EN CUANTO SE ABRE EL DIALOGO, TOMA LOS PAQUETES DE PROPS PARA CREAR UN NUEVO ARREGLO CON MENOS VARIABLES
        let arrayAux = props.detallesPaquetesEtiquetas.map((paquetes) => {
            return {
                "m_nIdEmbarqueDetalle": paquetes.m_nIdEmbarqueDetalle,
                "m_nCantidad": paquetes.ctd,
                "m_nRango": [1, 1],
                "m_sEmbalaje": paquetes.m_sEmbalaje,
                "m_sDescripcion": paquetes.m_sDescripcion,
                "checked": false
            }
        })
        setPaquetes(arrayAux)
    }, [props.open])

    return (
        <form >
            <DialogTitle>
                <Box display="flex">
                    <Box width="90%"><Typography variant={"h1"}>Etiquetas</Typography>
                    </Box>
                    <Box width="10%">
                        <IconButton
                            aria-label="close"
                            onClick={() => props.closeEtiquetas(null)}
                            style={{position: 'absolute', right: '20px', top: '20px', padding: '5px'}}
                            size="large">
                            <CloseIcon style={{fontSize: '30px'}}/>
                        </IconButton>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Root className={classes.root}>
                    {/*------------------------------TABS--------------------------------------*/}
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        className={classes.tabs}
                    >
                        {Paquetes.map((paquete, index) => {
                            return (
                                <Tab label={paquete.m_sDescripcion} {...a11yProps(index)} />
                            );
                        })}
                    </Tabs>

                    {/*------------------------------TAB PANEL--------------------------------------*/}
                    {Paquetes.map((paquete, index, array) => {
                        return (
                            <TabPanel value={value} index={index} className={classes.tab}>
                                <Table>
                                    <TableHead>
                                        <TableRow key={index}>
                                            <TableCell align="right">Seleccionado&nbsp;</TableCell>
                                            <TableCell align="center">Identificador&nbsp;</TableCell>
                                            <TableCell align="center">Rango&nbsp;</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody id="rows">
                                        <TableRow key={index}>
                                            <TableCell padding="checkbox" align="center">
                                                <Checkbox
                                                    checked={paquete.checked}
                                                    onChange={event => {
                                                        handleToggle(paquete, event)
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">{paquete.m_nIdEmbarqueDetalle}</TableCell>
                                            <TableCell align="center">
                                                <Slider
                                                    value={paquete.m_nRango}
                                                    onChange={(event, newValue) => {
                                                        const currentIndex = Paquetes.indexOf(paquete);
                                                        let nuevoChecado = [...Paquetes];
                                                        nuevoChecado[currentIndex].m_nRango = newValue
                                                        setPaquetes(nuevoChecado);
                                                    }}
                                                    valueLabelDisplay="on"
                                                    aria-labelledby="range-slider"
                                                    min={1}
                                                    disabled={!paquete.checked}
                                                    max={paquete.m_nCantidad}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TabPanel>
                        );
                    })}
                </Root>
            </DialogContent>
            <DialogActions>
                <Box display="flex">
                    <Button size="medium" type={"submit"} variant={"contained"} color={"primary"}
                            onClick={(e) => {
                                imprimirTodasEtiquetas()
                                props.closeEtiquetas(null)
                            }}
                            className={classes.botonesImprimir}>Imprimir Todas</Button>
                    <Button size="medium" variant={"contained"} color={"primary"}
                            onClick={(e) => props.closeEtiquetas(Paquetes.filter((i) => i.checked))}
                            className={classes.botonesImprimir}
                            disabled={Paquetes.filter((i) => i.checked).length === 0}
                    >Imprimir</Button>
                </Box>
            </DialogActions>
        </form>
    );
}

function TabPanel(props) {
    const {children, value, index, ...other} = props;

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