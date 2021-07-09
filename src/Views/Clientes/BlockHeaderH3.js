import React, {Component} from 'react'

export default class BlockHeaderH3 extends Component{
    render(){
        const {children} = this.props
        return(
            <div className="widget-header block-header margin-bottom-0 clearfix">
                <h3>{children}</h3>
            </div>
        )
    }
}