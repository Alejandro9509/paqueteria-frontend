import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import theme from '../../Assets/themes/default'

const styles = {
    attribute: {
        marginRight: 10,
        title:{
            fontWeight: 'bold'
        }
    },
    id: {
        color: '#F9A03E',
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    divider: {
        maginTop: 8,
        height: '3px',
        backgroundColor: '#F9A03E'
    }
}

const useStyles = makeStyles(styles);

export default function InformacionPaquete(props){
    console.log(props.package);
    const classes = useStyles();
    const packId = props.package.id;
    const weight = props.package.weight;
    const large = props.package.large;
    const width = props.package.width;
    const height = props.package.height;
    const type = props.package.type;
    const value = props.package.value;
    const description = props.package.description;
    const observation = props.package.observation;
    const quantity = props.package.quantity;

    return(
        <div>
            <h4 className={classes.id}>Paquete {packId}</h4>
            <div>
                <div className={classes.attribute} style={{display: 'inline-block'}}>
                    <h5 style={styles.attribute.title}>Peso</h5>
                    <span>{weight} kg</span>
                </div>
                <div className={classes.attribute} style={{display: 'inline-block'}}>
                    <h5 style={styles.attribute.title}>Largo</h5>
                    <span>{large} mts</span>
                </div >
                <div className={classes.attribute} style={{display: 'inline-block'}}>
                    <h5 style={styles.attribute.title}>Ancho</h5>
                    <span>{width} mts</span>
                </div>
                <div className={classes.attribute} style={{display: 'inline-block'}}>
                    <h5 style={styles.attribute.title}>Alto</h5>
                    <span>{height} mts</span>
                </div>
                <div className={classes.attribute} style={{display: 'inline-block'}}>
                    <h5 style={styles.attribute.title}>Tipo de Embalaje</h5>
                    <span>{type}</span>
                </div>
            </div>
            <div>
                <div className={classes.attribute} style={{display: 'inline-block'}}>
                    <h5 style={styles.attribute.title}>Valor</h5>
                    <span>{value}</span>
                </div>
                <div className={classes.attribute} style={{display: 'inline-block'}}>
                    <h5 style={styles.attribute.title}>Descripción</h5>
                    <span>{description}</span>
                </div>
            </div>
            <div>
                <div className={classes.attribute} style={{display: 'inline-block'}}>
                    <h5 style={styles.attribute.title}>Observación</h5>
                    <span>{observation}</span>
                </div>
                <div className={classes.attribute} style={{display: 'inline-block'}}>
                    <h5 style={styles.attribute.title}>Ctd.</h5>
                    <span>{quantity}</span>
                </div>
            </div>
            <div style={styles.divider}></div>
        </div>
    )
}