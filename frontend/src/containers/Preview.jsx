import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AddBoxIcon from '@mui/icons-material/AddBox';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import TimerIcon from '@mui/icons-material/Timer';
import PercentIcon from '@mui/icons-material/Percent';

import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/system/Stack';

import usePreviewResource from '../hooks/usePreviewResource';
import Avatar from '@mui/material/Avatar';

import { useInterval } from '../hooks/useInterval';

export default function Preview() {
    const navigate = useNavigate();
    let location = useLocation();
    const [previewid, setPreviewId] = useState(null);

    const { PreviewResourceData,
        PreviewResourceIsSuccesful,
        PreviewResourceIsLoading,
        PreviewResourceIsSubmitted,
        PreviewResourceError,
        PreviewResource } = usePreviewResource()

    useInterval(async () => {
        PreviewResource(previewid)
        console.log(PreviewResourceData)
    }, 5000);

    useEffect(() => {
        if (location.state) {
            setPreviewId(location.state.item.id)
            PreviewResource(location.state.item.id)
        }
        else {
            navigate("/")
        }
    }, [location]);

    return (
        <Box
            sx={{
                alignContent: "center",
                marginBottom: "1em",
                display: 'flex',
                justifyContent: 'space-evenly',
                flexDirection: 'column',
                textAlign: 'center'
            }}
        >
            <Typography variant="h5" gutterBottom>
                Preview
            </Typography>
            <Button variant="outlined"
                onClick={() => navigate("/")}>
                <ArrowBackIcon />
            </Button>

            <Stack
                sx={{
                    marginTop: "2em"
                }}
                direction="row"
            >
                <Avatar
                    sx={{
                        width: "3em",
                        height: "3em",
                        objectFit: "contain",
                        // objectPosition: "50% 50%",
                        alignSelf: "center",
                        // justifySelf: "center",
                        // marginLeft: "1em",
                        marginRight: "1em",

                    }}
                    variant="rounded"
                    alt={PreviewResourceData.title}
                    src={"https://img.youtube.com/vi/" +
                        PreviewResourceData.youtube_id +
                        "/sddefault.jpg"}
                />

                {PreviewResourceData.status == "DONE" ?
                    <Stack spacing={2} direction="column" >
                        <Button href={"/api/resource/" + PreviewResourceData.id + "/getvideo"} variant="contained">
                            Download Video
                        </Button>
                        <Button href={"/api/resource/" + PreviewResourceData.id + "/getaudio"} variant="contained">
                            Download Audio
                        </Button>
                    </Stack>
                    :
                    <List>
                        <ListItem disablePadding>
                            <ListItemIcon>
                                <TimerIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Estimated Time"
                                secondary={PreviewResourceData.eta + " seconds"}
                            />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemIcon>
                                <TimelapseIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Progress"
                                secondary={PreviewResourceData.progress + " %"}
                            />
                        </ListItem>
                    </List>
                }

            </Stack>
        </Box>
    );
}