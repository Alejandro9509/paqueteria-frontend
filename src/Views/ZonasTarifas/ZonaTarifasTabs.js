import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CodigosPostalesZonas from "../ZonasOperativas/CodigosPostalesZonas";

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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function ZonaTarifasTabs({selec, handleDataCodigosPostalesChange,consult}) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Códigos Postales" {...a11yProps(0)} />
                    <Tab label="Recoleccion" {...a11yProps(1)} />
                    <Tab label="Entrega" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <div className={'row'}>
                    <div className="widget-container">
                        <div className="widget-content">
                            <CodigosPostalesZonas
                                seleccion={selec}
                                onChange={handleDataCodigosPostalesChange}
                                consult={consult}/>
                        </div>
                    </div>
                </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <div className="widget-container">
                    <div className="widget-content">

                    </div>
                </div>
                Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
                <div className="widget-container">
                    <div className="widget-content">

                    </div>
                </div>
            </TabPanel>
        </Box>
    );
}
