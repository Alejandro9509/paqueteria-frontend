import React, {Component} from 'react';
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';
import {
    Chip,
    Divider,
    Grid,
    Step,
    StepLabel, Stepper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

class Cronograma extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }


    render() {
        return (
            <div>


                <SwipeableBottomSheet overflowHeight={window.innerHeight / 4}
                                      style={{zIndex: 30000, padding: "10px", cornerRadius: "100px"}}>
                    <div style={{height: window.innerHeight - 200}}>
                        <Grid container>
                            <Grid item md={12}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">Repartidor</TableCell>
                                                <TableCell align="left">Unidad</TableCell>
                                                <TableCell align="left">Capacidad</TableCell>
                                                <TableCell align="left">Tiempo</TableCell>
                                                <TableCell align="left">Estatus de entrega</TableCell>
                                                <TableCell align="center">Parada</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                this.props.tour.unidades.map(u => {
                                                    var ms = this.props.tour.tour.tourReports.find(t => t.vehicleId === ("vehicle" + u.m_nIdUnidad)).costReport.drivingTime,
                                                        min = Math.floor((ms / 1000 / 60) << 0),
                                                        sec = Math.floor((ms / 1000) % 60);
                                                    return (
                                                        <TableRow>
                                                            <TableCell align="left">{u.m_sNombreOperador}</TableCell>
                                                            <TableCell align="left">{u.m_sPlacas}</TableCell>
                                                            <TableCell align="left">Capacidad</TableCell>
                                                            <TableCell align="left">
                                                                {
                                                                    min + ':' + sec
                                                                }
                                                            </TableCell>
                                                            <TableCell align="left"> </TableCell>
                                                            <TableCell align="center">
                                                                <Chip
                                                                    label={this.props.tour.tour.tours[0].trips[0].stops.length}
                                                                    color={"default"}
                                                                    variant="default"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Stepper>
                                                                    {
                                                                        this.props.tour.tour.tours[0].trips[0].stops.map((s, index) => (
                                                                            <Step key={index}>
                                                                                <StepLabel> </StepLabel>
                                                                            </Step>
                                                                        ))
                                                                    }
                                                                </Stepper>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                        <Divider/>
                    </div>
                </SwipeableBottomSheet>
            </div>
        );
    }
}

Cronograma.propTypes = {};

export default Cronograma;
