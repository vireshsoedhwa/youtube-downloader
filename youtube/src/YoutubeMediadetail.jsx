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

export default function YoutubeMediadetail(props) {

    const clickqueue = () => {
        if (props.data.status == "NEW") {
            console.log("NEW clicked")
        }
        if (props.data.status == "DONE") {
            console.log("DONE CLICKED")
            Download(props.data.youtube_id)
        }
        if (props.data.status == "FAILED") {
            console.log("FAILED CLICKED")
        }
    }

    const Download = (youtube_id) => {
        let url = '/youtube/download/' + youtube_id
        let filename = ''
        fetch(url, {
            method: 'get',
            mode: 'no-cors',
            credentials: 'omit',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            redirect: 'follow'
        })
            .then(response => {
                if (response.ok) {
                    filename = response.headers.get('content-disposition')
                        .split(';')
                        .find(n => n.includes('filename='))
                        .replace('filename=', '')
                        .trim();

                    return response.blob();
                }
                else {
                    console.log("download failed")
                }
                throw response
            })
            .then(data => {
                var a = document.createElement("a");
                a.href = window.URL.createObjectURL(data);
                a.download = filename;
                a.click();
                a.remove();
            })
            .catch(error => {
                console.error(error)
            })
    }

    const MEDIADETAIL_STATES = {
        // NEW: <AddToQueueIcon sx={{ height: 38, width: 38 }} />,
        DONE: <DownloadIcon color="success" sx={{ height: 38, width: 38 }} />,
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
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h6">
                        {props.data.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        {/* {props.data.audiofile} */}
                    </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                    <IconButton onClick={clickqueue}>
                        {
                            MEDIADETAIL_STATES[props.data.status]
                        }
                    </IconButton>
                </Box>
            </Box>
        </Card >
    );
}
