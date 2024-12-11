import React from "react";
import { styled } from '@mui/material/styles';
import { Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";


export default function ProgressBarCubicaje({value,children}) {

    const PREFIX = 'ProgressBarCubicaje';

    const classes = {
        root: `${PREFIX}-root`,
        colorPrimary: `${PREFIX}-colorPrimary`,
        bar: `${PREFIX}-bar`
    };

    const Root = styled('div')(({theme}) => ({
        [`& .${classes.root}`]: {
            height: 10,
            borderRadius: 5,
        },

        [`& .${classes.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 700],
        },

        [`& .${classes.bar}`]: {
            borderRadius: 5,
            backgroundColor: value > 90 ? value > 100 ? '#ec3f3f' : '#3bd331' : '#1a90ff',
        }
    }));

    const BorderLinearProgress = LinearProgress;

    return (
        <Root>
            <Typography variant={'h5'}>{children}</Typography>
            <br/>
            <BorderLinearProgress
                variant="determinate"
                value={value}
                classes={{
                    root: classes.root,
                    colorPrimary: classes.colorPrimary,
                    bar: classes.bar
                }} />
        </Root>
    );
}