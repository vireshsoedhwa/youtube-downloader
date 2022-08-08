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
import CircularProgress from '@mui/material/CircularProgress';
import DownloadIcon from '@mui/icons-material/Download';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';

export default function YoutubeMediadetail(props) {

    const clickqueue = () => {
        if (props.status == "NEW") {
            console.log("NEW clicked")
        }
        if (props.status == "DONE") {
            console.log("DONE CLICKED")
        }
    }

    const MEDIADETAIL_STATES = {
        // NEW: <AddToQueueIcon sx={{ height: 38, width: 38 }} />,
        DONE: <DownloadIcon sx={{ height: 38, width: 38 }} />,
        BUSY: <CircularProgress sx={{ height: 38, width: 38 }} variant="determinate" value={parseInt(props.data.youtube_data.downloadprogress)} />,
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
                image={props.data.youtube_data ?
                    "//img.youtube.com/vi/" + props.data.youtube_data.youtube_id + "/sddefault.jpg"
                    :
                    "//img.youtube.com/vi/" + props.data.youtube_id + "/sddefault.jpg"
                }
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
                            MEDIADETAIL_STATES[props.data.youtube_data.status]
                        }
                    </IconButton>
                </Box>
            </Box>
        </Card >
    );
}
