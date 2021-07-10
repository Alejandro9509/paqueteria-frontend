import React, {Component} from 'react';
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';
import {
    Box,
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
    TableRow, Typography
} from "@material-ui/core"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import DateRangeIcon from "@material-ui/icons/DateRange";
import moment from "moment";
import {ReactComponent as CalendarioIcono} from "../../iconos/Mapa/iconoCalendario.svg";

class Cronograma extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openDetail: false
        }
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
                {
                    !this.state.openDetail &&
                    <Chip
                        icon={<CalendarioIcono style={{fill: "white", paddingTop:"5px", paddingBottom:"5px"}}/>}
                        style={{
                            color:"white",
                            backgroundColor: "#F9A03E",
                            bottom: "10px",
                            left: "10px",
                            position: "fixed",
                            zIndex: 3000,
                            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                        }}
                        label={"Cronograma"}

                        onClick={() => this.setState({openDetail: true})}
                        variant="outlined"
                    />
                }

                {
                    this.state.openDetail &&
                    <SwipeableBottomSheet overflowHeight={window.innerHeight / 4}
                                          style={{
                                              zIndex: 30000,
                                              padding: "10px",
                                              cornerRadius: "200px",
                                              backgroundColor: "transparent"
                                          }}>

                        <div style={{
                            height: window.innerHeight - 200,
                            backgroundColor: "transparent",
                            borderRadius: "20px",
                        }}>
                            <div style={{
                                transform: "translate(0px, 6px)",
                                width: "200px",
                                height: "40px",
                                textAlign: "center",
                                backgroundColor: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "10px",
                                boxShadow: "rgb(0 0 0 / 16%) 0px -6px 5px",
                                cursor: "pointer"
                            }}
                                 onClick={() => this.setState({openDetail: false})}
                            >
                                <DateRangeIcon color={"primary"} fontSize={"large"}/> Cronograma
                            </div>
                            <div style={{
                                height: "100%",
                                backgroundColor: "white",
                                boxShadow: "rgb(0 0 0 / 16%) 0px -6px 5px"
                            }}>

                                <Grid container direction={"row"} justify={"center"} alignItems="baseline">
                                    <div align={"center"}
                                         style={{
                                             width: "216px",
                                             height: "5px",
                                             backgroundColor: "#868686",
                                             margin: "5px",
                                             borderRadius: "5px"
                                         }}>
                                    </div>
                                    <Grid item md={12}>
                                        <TableContainer style={{height: "100%", padding: "10px"}}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell style={{borderBottom: "none"}}
                                                                   align="left"></TableCell>
                                                        <TableCell style={{borderBottom: "none"}} align="left"><Box
                                                            fontWeight="fontWeightBold">Repartidor</Box></TableCell>
                                                        <TableCell style={{borderBottom: "none"}} align="left"><Box
                                                            fontWeight="fontWeightBold">Unidad</Box></TableCell>
                                                        <TableCell style={{borderBottom: "none"}} align="left"><Box
                                                            fontWeight="fontWeightBold">Capacidad</Box></TableCell>
                                                        <TableCell style={{borderBottom: "none"}} align="center"><Box
                                                            fontWeight="fontWeightBold">Tiempo</Box></TableCell>
                                                        <TableCell style={{borderBottom: "none"}} align="center"><Box
                                                            fontWeight="fontWeightBold">Estatus de entrega</Box>
                                                        </TableCell>
                                                        <TableCell style={{borderBottom: "none"}} align="center"><Box
                                                            fontWeight="fontWeightBold">Parada</Box> </TableCell>
                                                        <TableCell style={{borderBottom: "none"}}
                                                                   align="left"></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        this.props.tour.unidades.map(u => {
                                                            var tour = this.props.tour.tour.tours.find( t => t.vehicleId === ("vehicle" + u.m_nIdUnidad))
                                                            var color = tour.color
                                                            var ms = this.props.tour.tour.tourReports.find(t => t.vehicleId === ("vehicle" + u.m_nIdUnidad)).costReport.travelTime,
                                                                min = Math.floor((ms/ 60) << 0),
                                                                sec = Math.floor((ms) % 60);
                                                            return (
                                                                <TableRow>
                                                                    <TableCell style={{borderBottom: "none"}}
                                                                               align="left">
                                                                        <div style={{
                                                                            backgroundColor: color,
                                                                            width: "20px",
                                                                            height: "20px",
                                                                            borderRadius: "5px"
                                                                        }}></div>
                                                                    </TableCell>
                                                                    <TableCell style={{borderBottom: "none"}}
                                                                               align="left">{u.m_sNombreOperador}</TableCell>
                                                                    <TableCell style={{borderBottom: "none"}}
                                                                               align="left">{u.m_sPlacas}</TableCell>
                                                                    <TableCell style={{borderBottom: "none"}}
                                                                               align="left">Capacidad</TableCell>
                                                                    <TableCell style={{borderBottom: "none"}}
                                                                               align="center">
                                                                        {
                                                                            min + ':' + sec
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell style={{borderBottom: "none"}}
                                                                               align="center">
                                                                        <div style={{backgroundColor:"#F9A03E", borderRadius:"10px"}}>En camino</div>
                                                                    </TableCell>
                                                                    <TableCell style={{borderBottom: "none"}}
                                                                               align="center">
                                                                        <Chip
                                                                            label={this.props.tour.tour.tours[0].trips[0].stops.length}
                                                                            color={"default"}
                                                                            variant="default"
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell style={{borderBottom: "none"}}
                                                                               width={"50%"}>
                                                                        <Stepper>
                                                                            {
                                                                                tour.trips[0].stops.map((s, index) => (
                                                                                    <Step key={index}
                                                                                          color={this.props.tour.tour.tours[0].color}>
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
                            </div>
                        </div>
                    </SwipeableBottomSheet>
                }

            </div>
        );
    }
}

Cronograma.propTypes = {};

export default Cronograma;
