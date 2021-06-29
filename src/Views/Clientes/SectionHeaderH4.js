import React, {Component} from 'react'

const styles = {
    subHeader: {
        fontWeight: 'bold'
    }
}
export default class SectionHeaderH4 extends Component{
    render() {
        const {children} = this.props
        return(
            <div className="w-section-header">
                <h4 style={styles.subHeader}>{children}</h4>
            </div>
        )
    }
}