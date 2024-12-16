import React, {useEffect} from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

const PREFIX = 'ProductosTarifa';

const classes = {
    root: `${PREFIX}-root`,
    cardHeader: `${PREFIX}-cardHeader`,
    list: `${PREFIX}-list`,
    button: `${PREFIX}-button`
};

const StyledGrid = styled(Grid)(({theme}) => ({
    [`&.${classes.root}`]: {
        margin: 'auto',
    },

    [`& .${classes.cardHeader}`]: {
        padding: theme.spacing(1, 2),
    },

    [`& .${classes.list}`]: {
        width: 400,
        height: 400,
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
    },

    [`& .${classes.button}`]: {
        margin: theme.spacing(0.5, 0),
    }
}));

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

export default function ProductosTarifa({productos = [], productosSeleccionados = [], actualizarProductos, consult}){

    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState(productos);
    const [right, setRight] = React.useState(productosSeleccionados);
    // const [localConsult, setConsult] = useState(consult)
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    useEffect(value => {
        setLeft(productos)
        setRight(productosSeleccionados)
    }, [productos], [productosSeleccionados])

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        const leftArray= not(left, leftChecked)
        const rightArray= right.concat(leftChecked)
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
        actualizarProductos(leftArray, rightArray)
    };

    const handleCheckedLeft = () => {
        const leftArray= left.concat(rightChecked)
        const rightArray= not(right, rightChecked)
        setLeft(leftArray);
        setRight(rightArray);
        setChecked(not(checked, rightChecked));
        actualizarProductos(leftArray, rightArray)
    };

    const customList = (title, items) => (
        <Card>
            <CardHeader
                className={classes.cardHeader}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                        disabled={items.length === 0 || consult}
                        inputProps={{ 'aria-label': 'all items selected' }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} seleccionados`}
            />
            <Divider />
            <List className={classes.list} dense component="div" role="list">
                {items.map((value) => {
                    const labelId = `transfer-list-all-item-${value}-label`;
                    return (
                        <ListItem key={value.m_nIdProducto} role="listitem" button
                                  onClick={handleToggle(value)} disabled={consult}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    disabled={consult}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={value.m_nNoProducto+' - '+value.m_sDescripcion} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Card>
    );

    return (
        <StyledGrid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            className={classes.root}
        >
            <Grid item>{customList('Productos', left)}</Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid item>{customList('Productos en  tarifa', right)}</Grid>
        </StyledGrid>
    );
}
