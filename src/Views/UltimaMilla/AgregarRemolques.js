import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Dialog} from "@material-ui/core";

class MyComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            remolque1:null,
            remolque2: null,
            dolly: null
        }
    }




    componentDidMount() {

    }

    render() {
        return (
            <Dialog open={this.props.open} onClose={() => this.props.close}>

            </Dialog>
        );
    }
}

MyComponent.propTypes = {};

export default MyComponent;
