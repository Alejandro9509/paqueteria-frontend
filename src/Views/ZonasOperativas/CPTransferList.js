import React, {useEffect} from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { Paper, Typography} from "@mui/material";


function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

export default function CPTransferList({allItems = [],selectedItems = [],onChange, consult}) {
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState(allItems);
    const [right, setRight] = React.useState(selectedItems);
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    useEffect(value => {
        setLeft(allItems)
        setRight(selectedItems)
    }, [allItems, selectedItems])

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

    const handleAllRight = () => {
        let rightt = right.concat(left)
        let leftt = []
        setRight(rightt);
        setLeft(leftt);
        onChange(leftt, rightt)
    };

    const handleCheckedRight = () => {
        let rightt = right.concat(leftChecked)
        let leftt = not(left, leftChecked)
        setRight(rightt);
        setLeft(leftt);
        setChecked(not(checked, leftChecked));
        onChange(leftt, rightt)
    };

    const handleCheckedLeft = () => {
        let leftt = left.concat(rightChecked)
        let rightt = not(right, rightChecked)
        setLeft(leftt);
        setRight(rightt);
        setChecked(not(checked, rightChecked));
        onChange(leftt, rightt)
    };

    const handleAllLeft = () => {
        let leftt = left.concat(right)
        let rightt = []
        setLeft(leftt);
        setRight(rightt);
        onChange(leftt, rightt)
    };

    const customList = (items) => (
        <Paper style={{ width: '100%', height: 500, overflow: 'auto' }}>
            <List dense component="div" role="list">
                {items.map((value) => {
                    const labelId = `transfer-list-item-${value.m_nIdCP}-label`;

                    return (
                        <ListItem
                            key={value.m_nIdCP}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    disabled={consult}
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${value.m_sCP} - ${value.m_sColonia?value.m_sColonia: value.m_sLocalidad}`} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Paper>
    );

    return (
        <div align={'center'}>                
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                
                <Grid item xs={5}>
                    <Typography variant="h3" component="h2">
                        Códigos postales disponibles para relacionar
                    </Typography>
                    {customList(left)}
                </Grid>
                <Grid item xs={1}>
                    <Grid container direction="column" alignItems="center">
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleAllRight}
                            disabled={left.length === 0 || consult}
                            aria-label="move all right"
                        >
                            ≫
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0 || consult}
                            aria-label="move selected right"
                        >
                            &gt;
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0 || consult}
                            aria-label="move selected left"
                        >
                            &lt;
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleAllLeft}
                            disabled={right.length === 0 || consult}
                            aria-label="move all left"
                        >
                            ≪
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={5}>
                    <Typography variant="h3" component="h2">
                        Códigos postales ya relacionados a la zona
                    </Typography>
                    {customList(right)}
                </Grid>
            </Grid>
        </div>
    );
}
