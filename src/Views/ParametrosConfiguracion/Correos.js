import React, {Component} from 'react';
import {Paper, Tab, Tabs} from "@mui/material";
import {TabContext, TabPanel} from "@mui/lab";
import {TOOLBAR_OPTIONS} from "../../Constants";
import { Editor } from 'react-draft-wysiwyg';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

class Correos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plantillaUltimaMilla: "",
            plantillaViajes: "",
            tabValue: "0",
            contentEditor: this.props.data[0],
        }
        this.onChangeTab = this.onChangeTab.bind(this)
        this.onContentStateChange = this.onContentStateChange.bind(this)
    }

    onChangeTab(event, newValue){
        event.preventDefault()
        this.setState({
            tabValue:newValue,
            contentEditor: this.props.data[parseInt(newValue)]
        })
    }

    onContentStateChange(contentState, variable) {
        this.props.modficarCorreo(contentState,variable )
    };

    render() {
        const {tabValue} = this.state
        return (
            <Paper elevation={1} >
                <div style={{display: 'flex',flexGrow: 1}}>
                <TabContext value={tabValue}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={tabValue}
                    style={{borderRight: `1px solid black`}}
                    onChange={this.onChangeTab}
                >
                    <Tab label="CFDI Traslada Intermedio" value="0" style={{fontSize: '1em'}}/>
                    <Tab label="CFDI Traslada Primera/Ultima Milla" value="1" style={{fontSize: '1em'}}/>

                </Tabs>
                <TabPanel value="0">
                    <Editor
                        wrapperClassName="wrapper-class"
                        editorClassName="editor-class"
                        toolbarClassName="toolbar-class"
                        placeholder=""
                        // initialContentState={state.content}
                        // onContentStateChange={onContentStateChange}
                        toolbar={TOOLBAR_OPTIONS}
                        editorState={this.props.data[0]}
                        onEditorStateChange={(e) => this.onContentStateChange(e,"correoFacturaViaje")}
                    />
                </TabPanel>
                <TabPanel value="1">
                    <Editor
                        wrapperClassName="wrapper-class"
                        editorClassName="editor-class"
                        toolbarClassName="toolbar-class"
                        placeholder=""
                        // initialContentState={state.content}
                        // onContentStateChange={onContentStateChange}
                        toolbar={TOOLBAR_OPTIONS}
                        editorState={this.props.data[1]}
                        onEditorStateChange={(e) => this.onContentStateChange(e,"correoFacturaUltimaMilla")}
                    />
                </TabPanel>
                </TabContext>
                </div>
                <div style={{width: "100%", padding: "5px"}} align={"center"}>
                    {this.props.children}
                </div>
            </Paper>
        );
    }
}

Correos.propTypes = {};

export default Correos;
