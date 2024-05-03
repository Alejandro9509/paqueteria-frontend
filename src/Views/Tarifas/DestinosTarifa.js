import React, {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
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

const PREFIX = 'DestinosTarifa';

const classes = {
    root: `${PREFIX}-root`,
    cardHeader: `${PREFIX}-cardHeader`,
    list: `${PREFIX}-list`,
    button: `${PREFIX}-button`
};

const StyledGrid = styled(Grid)((
    {
        theme
    }
) => ({
    [`&.${classes.root}`]: {
        margin: 'auto',
    },

    [`& .${classes.cardHeader}`]: {
        padding: theme.spacing(1, 2),
    },

    [`& .${classes.list}`]: {
        width: 400,
        height: 200,
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

export default function DestinosTarifa({destinos = [], destinosSeleccionados = [], actualizarDestinos, disabled}){

    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState(destinos);
    const [right, setRight] = React.useState(destinosSeleccionados);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    useEffect(value => {
        setLeft(destinos)
        setRight(destinosSeleccionados)
    }, [destinos], [destinosSeleccionados])

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
        actualizarDestinos(leftArray, rightArray)
    };

    const handleCheckedLeft = () => {
        const leftArray= left.concat(rightChecked)
        const rightArray= not(right, rightChecked)
        setLeft(leftArray);
        setRight(rightArray);
        setChecked(not(checked, rightChecked));
        actualizarDestinos(leftArray, rightArray)
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
                        disabled={items.length === 0 || disabled}
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
                        <ListItem key={value.m_nIdCiudad} role="listitem" button onClick={handleToggle(value)} disabled={disabled}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    disabled={disabled}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={value.m_sCiudad} />
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
            justifyContent="space-between"
            alignItems="center"
            className={classes.root}
        >
            <Grid item xs={5}>{customList('Destinos (Bodegas)', left)}</Grid>
            <Grid item xs={2}>
                <Grid container direction="column" alignItems="center">
                    <Button
                        variant="outlined"
                        size="large"
                        className={classes.button}
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                        fullWidth
                    >
                        &gt;
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        className={classes.button}
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={5}>{customList('Destinos de tarifa', right)}</Grid>
        </StyledGrid>
    );
}
