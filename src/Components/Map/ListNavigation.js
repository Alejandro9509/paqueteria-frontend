import React from 'react';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StarIcon from '@mui/icons-material/Star';
import "../../App.css"
import { ReactComponent as KeepLeftArrow } from '../../iconos/Mapa/svg/001-left arrow.svg';
import { ReactComponent as ChangeArrow } from '../../iconos/Mapa/svg/012-change.svg';
import { ReactComponent as TurnLeftArrow } from '../../iconos/Mapa/svg/008-left turn.svg';
import { ReactComponent as UpArrow } from '../../iconos/Mapa/svg/011-up arrow.svg';
import { ReactComponent as TurnRightArrow } from '../../iconos/Mapa/svg/003-right arrow.svg';
import { ReactComponent as RoundaboutArrow } from '../../iconos/Mapa/svg/007-roundabout.svg';
import { ReactComponent as TurnUArrow } from '../../iconos/Mapa/svg/004-u turn.svg';

import SvgIcon from '@mui/icons-material/Star';

const PREFIX = 'ListNavigation';

const classes = {
    root: `${PREFIX}-root`
};

const StyledList = styled(List)((
    {
        theme
    }
) => ({
    [`&.${classes.root}`]: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        height: "450px",
        overflow: 'auto',
    }
}));

export default function NavigationList(props) {


    return (
        <StyledList component="nav" className={classes.root} aria-label="navication">
            {

props.indications && props.indications.map(i => {
                    return (
                        <ListItem >
                            <ListItemIcon>
                                {
                                    (i.maneuverType == "KEEP_LEFT" || i.maneuverType == "ENTER_LEFT" || i.maneuverType == "EXIT_LEFT") &&
                                    <SvgIcon
                                        style={{ width: "50px", height: "50px", padding: "10px" }}
                                        component={KeepLeftArrow}
                                        viewBox="0 0 50 50"
                                    />

                                }
                                {
                                    (i.maneuverType == "CHANGE" || i.maneuverType == "CHANGE_LEFT" || i.maneuverType == "CHANGE_RIGHT") &&
                                    <SvgIcon
                                        style={{ width: "50px", height: "50px", padding: "10px" }}
                                        component={ChangeArrow}
                                        viewBox="0 0 60 60"
                                    />

                                }
                                {
                                    (i.maneuverType == "TURN_LEFT" || i.maneuverType == "TURN_SHARP_LEFT" || i.maneuverType == "START_LEFT" || i.maneuverType == "TURN_HALF_LEFT") &&
                                    <SvgIcon
                                        style={{ width: "50px", height: "50px", padding: "10px" }}
                                        component={TurnLeftArrow}
                                        viewBox="0 0 60 60"
                                    />
                                }

                                {
                                    (i.maneuverType == "CONTINUE" || i.maneuverType == "KEEP_STRAIGHT" || i.maneuverType == "START" || i.maneuverType == "ENTER" || i.maneuverType == "EXIT") &&
                                    <SvgIcon
                                        style={{ width: "50px", height: "50px", padding: "10px" }}
                                        component={UpArrow}
                                        viewBox="0 0 60 60"
                                    />

                                }

                                {
                                    (i.maneuverType == "TURN_RIGHT" || i.maneuverType == "TURN_SHARP_RIGHT" || i.maneuverType == "START_RIGHT" || i.maneuverType == "KEEP_RIGHT" || i.maneuverType == "ENTER_RIGHT" || i.maneuverType == "EXIT_RIGHT" || i.maneuverType == "TURN_HALF_RIGHT") &&
                                    <SvgIcon
                                        style={{ width: "50px", height: "50px", padding: "10px" }}
                                        component={TurnRightArrow}
                                        viewBox="0 0 60 60"
                                    />

                                }

                                {
                                    (i.maneuverType == "TAKE_ROUNDABOUT_LEFT" || i.maneuverType == "TAKE_ROUNDABOUT_RIGHT") &&
                                    <SvgIcon
                                        style={{ width: "50px", height: "50px", padding: "10px" }}
                                        component={RoundaboutArrow}
                                        viewBox="0 0 60 60"
                                    />

                                }
                                {
                                    (i.maneuverType == "MAKE_U_TURN") &&
                                    <SvgIcon
                                        style={{ width: "50px", height: "50px", padding: "10px" }}
                                        component={TurnUArrow}
                                        viewBox="0 0 60 60"
                                    />

                                }

                            </ListItemIcon>
                            <ListItemText primary={i.directionDescription} />
                        </ListItem>
                    )
                })
            }

        </StyledList>
    );
}