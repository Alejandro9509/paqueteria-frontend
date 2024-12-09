import React, {useEffect, useState} from "react";
import { styled } from '@mui/material/styles';
import {
    Button,
    Card,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
} from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";

const PREFIX = 'DialogTransferList';

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
    [`& .${classes.root}`]: {
        margin: 'auto',
    },

    [`& .${classes.cardHeader}`]: {
        padding: theme.spacing(1, 2),
    },

    [`& .${classes.list}`]: {
        height: '500px',
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
    },

    [`& .${classes.button}`]: {
        margin: theme.spacing(0.5, 0),
    }
}));

export default function DialogTransferList(props) {
    /** Props
     * handleShowDialog() - Controla si se abre o cierra el dialogo.
     * handleOnConfirmSelection() - Retorna al padre los items seleccionados.
     * openDialog Boolean - Controla si se abre o cierra el dialogo
     * selection array - Lista de item seleccionados del datagrid
     * rows - lista de registros a mostrar en la tabla
     * columns - columnas que se veran en la tabla
     * */
    const [state, setState] = useState({
        height: window.innerHeight,
    })
    const [search, setSearch] = useState("")
    const [dataFiltered, setDataFiltered] = useState(props.rows)

    const [selection, setSelection] = useState(props.selection || [])

    const handleShowDialog = () => {
        props.handleShowDialog(false)
    }

    const handleConfirmSelection = () => {
        props.handleOnConfirmSelection(selection)
    }

    const handleOnSelectionChange = (newSelection) => {
        setSelection(newSelection)
    }

    const handleOnChangeSearch = (event) => {
        setSearch(event.target.value)
    }

    const handleSearch = () => {
        if (search.length === 0 ){
            setDataFiltered(props.rows)
        }else{
            setDataFiltered(props.rows.filter(i => i.numeroDescripcion.toUpperCase().includes(search.toUpperCase())))
        }
    }


    return (
        <Dialog
            fullWidth={true}
            maxWidth={'l'}
            open={props.openDialog}
            onClose={handleShowDialog}
            aria-labelledby="max-width-dialog-title"
        >
            <DialogContent>
                <StyledGrid container spacing={1}>
                    <Grid item xs={11}>
                        <TextField variant="outlined" margin="dense"
                                   onChange={handleOnChangeSearch}
                                   label="Buscar"
                                   value={search}
                                   name="search"
                                   size={"small"}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <Button onClick={handleSearch} color="primary" variant={"contained"} fullWidth style={{fontSize: '.9em'}}>
                            Buscar
                        </Button>
                    </Grid>
                </StyledGrid>
                <TransferList
                    onSelectionChange={handleOnSelectionChange}
                    leftList={dataFiltered.filter((value) => !selection.some(s => value.m_nIdProducto === s.m_nIdProducto))}
                    rightList={selection}
                    disabled={props.disabled}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleShowDialog} color="primary" style={{fontSize: '.9em'}}>
                    Cancelar
                </Button>
                <Button onClick={handleConfirmSelection} color="primary" autoFocus disabled={props.disabled} style={{fontSize: '.9em'}}>
                    Aceptar
                </Button>

            </DialogActions>
        </Dialog>
    );

}

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

function TransferList(props) {

    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState(props.leftList);
    const [right, setRight] = React.useState(props.rightList);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

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
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    useEffect(value => {
        props.onSelectionChange(right)
    }, [right])

    useEffect(value => {
        setLeft(not(props.leftList, props.rightList));
    }, [props.leftList])
//height: '30vw'
    const customList = (title, items) => (
        <Card style={{display: 'block', height: '30vw', overflow: 'auto'}} fullHeight={true}>
            <CardHeader
                className={classes.cardHeader}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                        disabled={items.length === 0 || props.disabled}
                        inputProps={{ 'aria-label': 'all items selected' }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />
            <List className={classes.list} dense component="div" role="list">
                {items.map((value) => {
                    const labelId = `transfer-list-all-item-${value}-label`;

                    return (
                        <ListItem key={value.m_nIdProducto} role="listitem" button onClick={handleToggle(value)} disabled={props.disabled}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                    disabled={props.disabled}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${value.m_nIdProducto}.- ${value.m_sDescripcion}`} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Card>
    );

    return (
        <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            className={classes.root}
        >
            <Grid item xs={5}>{customList('No seleccionados', left)}</Grid>
            <Grid item xs={2}>
                <Grid container direction="column" alignItems="center">
                    <Button
                        fullWidth
                        variant="outlined"
                        className={classes.button}
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0 || props.disabled}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        className={classes.button}
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0  || props.disabled}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={5}>{customList('Seleccionados', right)}</Grid>
        </Grid>
    );
}