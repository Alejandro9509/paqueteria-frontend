import React from "react";
import {Typography, withStyles} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";

export default function ProgressBarCubicaje({value,children}) {
    const BorderLinearProgress = withStyles((theme) => ({
        root: {
            height: 10,
            borderRadius: 5,
        },
        colorPrimary: {
            backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
        },
        bar: {
            borderRadius: 5,
            backgroundColor: '#1a90ff',
        },
    }))(LinearProgress);
    return (
        <div>
            <Typography variant={'h5'}>{children}</Typography>
            <br/>
            <BorderLinearProgress variant="determinate" value={value} />
        </div>
    )
}