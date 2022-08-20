import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
// import CircularProgress from '@mui/material/CircularProgress';
import CircularProgressWithLabel from './CircularStatic';
import DownloadIcon from '@mui/icons-material/Download';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import ErrorIcon from '@mui/icons-material/Error';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Tooltip from '@mui/material/Tooltip';

export default function YoutubeMediadetail(props) {

    const clickqueue = () => {
        if (props.data.status == "NEW") {
        }
        if (props.data.status == "DONE") {
            onDownload(props.data.youtube_id)
        }
    }

    const retry = () => {
        if (props.data.status == "FAILED") {
            retry_link()
        }
    }

    const onDownload = (youtube_id) => {
        const link = document.createElement("a");
        link.href = '/youtube/download/' + youtube_id;
        link.click();
    };

    const MEDIADETAIL_STATES = {
        DONE: <DownloadIcon color="success" sx={{ height: 38, width: 38 }} />,
        BUSY: <CircularProgressWithLabel sx={{ height: 38, width: 38 }} variant="determinate" value={parseInt(props.data.downloadprogress)} />,
        FAILED: <ErrorIcon color="error" sx={{ height: 38, width: 38 }} />,
    }

    const retry_link = () => {
        let url = '/youtube/retry/' + props.data.youtube_id
        fetch(url, {
            method: 'get'
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                else {
                    console.log("submit failed")
                }
                throw response
            })
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
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h6">
                        {props.data.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        {props.data.filename}
                    </Typography>
                </CardContent>
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
                </Box>
            </Box>
        </Card >
    );
}
