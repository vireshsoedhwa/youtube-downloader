import React, { Fragment, useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgressWithLabel from './CircularStatic';
import DownloadIcon from '@mui/icons-material/Download';
import ErrorIcon from '@mui/icons-material/Error';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Tooltip from '@mui/material/Tooltip';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import FindReplaceIcon from '@mui/icons-material/FindReplace';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import CardActions from '@mui/material/CardActions';

import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Collapse from '@mui/material/Collapse';


const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(90deg)' : 'rotate(270deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

function TagsList(props) {
    const listoftags = props.tags
    if (listoftags == null) {
        return
    }
    const listItems = listoftags.map((tag, index) =>
        <div key={index}>
            <Chip label={tag} color="primary" variant="outlined" />
        </div>
    );

    return (
        <Stack spacing={0}>
            <Typography paragraph>Tags:</Typography>
            {listItems}
        </Stack>
    );
}

function CategoryList(props) {
    const listofcategories = props.tags
    if (listofcategories == null) {
        return
    }
    const listItems = listofcategories.map((tag, index) =>
        <div key={index}>
            <Chip label={tag} color="secondary" variant="outlined" />
        </div>
    );

    return (
        <Stack spacing={1}>
            <Typography paragraph>Categories:</Typography>
            {listItems}
        </Stack>
    );
}


export default function YoutubeMediadetail(props) {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const clickqueue = () => {
        if (props.data.status == "DONE" || props.data.status == "ARCHIVED" || props.data.status == "REVIEW") {
            onDownload(props.data.id)
        }
    }

    const retry = () => {
        if (props.data.status == "FAILED") {
            props.Submit_link(props.data.youtube_url)
        }
    }

    const onDownload = (id) => {
        const link = document.createElement("a");
        link.href = '/resource/' + id + '/download';
        link.click();
    };

    const MEDIADETAIL_STATES = {
        DONE: <DownloadIcon color="success" sx={{ height: 38, width: 38 }} />,
        REVIEW: <DownloadIcon color="success" sx={{ height: 38, width: 38 }} />,
        ARCHIVED: <DownloadIcon color="success" sx={{ height: 38, width: 38 }} />,
        QUEUED: <Tooltip title="In Queue"><HourglassTopIcon sx={{ height: 38, width: 38 }} /></Tooltip>,
        BUSY: <CircularProgressWithLabel sx={{ height: 38, width: 38 }} variant="determinate" value={parseInt(props.data.downloadprogress)} />,
        FAILED: <ErrorIcon color="error" sx={{ height: 38, width: 38 }} />,
    }

    return (
        <Card
            sx={{
                display: 'flex',
                backgroundColor: () =>
                    props.status == "NEW" ? '#e3f3fc' : '#FFF',
            }}
        >
            <CardMedia
                component="img"
                sx={{ width: 100 }}
                image={"//img.youtube.com/vi/" + props.data.youtube_id + "/sddefault.jpg"}
                alt="audio file"
            />
            {/* <Box sx={{ display: 'flex', flexDirection: 'column' }}> */}
            <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="div" variant="subtitle1">
                    {props.data.title}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" component="div">
                    {props.data.filename}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                    <IconButton onClick={clickqueue}>
                        {
                            MEDIADETAIL_STATES[props.data.status]
                        }
                    </IconButton>
                    {props.data.status == 'FAILED' ?
                        <Tooltip title="Retry">
                            <IconButton onClick={retry}>
                                <RestartAltIcon color="primary" sx={{ height: 38, width: 38 }} />
                            </IconButton>
                        </Tooltip>
                        :
                        <div>
                        </div>}
                    {(props.data.status == 'DONE' || props.data.status == 'ARCHIVED' || props.data.status == 'REVIEW') &&
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 3, pb: 0 }}>
                            <div>
                                <audio controls preload="none">
                                    <source src={'/resource/' + props.data.id + '/download'} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        </Box>
                    }
                    {props.data.is_music == true &&
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 3, pb: 0 }}>
                            <Stack direction="row" spacing={1}>
                                <Tooltip title="Music Track">
                                    <Chip icon={<AudiotrackIcon />} label={props.data.artist} variant="outlined" size="small" />
                                </Tooltip>
                            </Stack>
                        </Box>
                    }
                    {props.data.is_playlist == true &&
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, pb: 0 }}>
                            <Tooltip title="Playlist Detected">
                                <QueueMusicIcon />
                            </Tooltip>
                        </Box>
                    }
                    {props.data.status == 'ARCHIVED' &&
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, pb: 0 }}>
                            <Tooltip title="Archived">
                                <FolderSpecialIcon />
                            </Tooltip>
                        </Box>
                    }
                    {props.data.status == 'REVIEW' &&
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, pb: 0 }}>
                            <Tooltip title="needs review">
                                <FindReplaceIcon color="error" />
                            </Tooltip>
                        </Box>
                    }
                </Box>
                {/* </Box> */}
            </CardContent>
            <CardActions disableSpacing>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 0, pb: 0 }}>
                        <CategoryList tags={props.data.categories} />
                        <TagsList tags={props.data.tags} />
                    </Box>
                </CardContent>
            </Collapse>
        </Card >
    );
}
