import React, {Component} from 'react';
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';
import {Divider, Grid} from "@material-ui/core"

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
                                <div align={"center"}>

                                </div>
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
