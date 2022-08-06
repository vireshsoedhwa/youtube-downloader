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

export default function MediaControlCard(props) {
    const theme = useTheme();

    return (
        <Card sx={{ display: 'flex' }}>
            <CardMedia
                component="img"
                sx={{ width: 100 }}
                // image="/static/images/cards/live-from-space.jpg"
                image={"//img.youtube.com/vi/" + props.url + "/sddefault.jpg"}
                alt="Live from space album cover"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h6">
                        {props.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        {props.filename}
                    </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                    {/* <IconButton aria-label="previous">
            {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
          </IconButton> */}
                    {/* <IconButton aria-label="play/pause">
            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
          </IconButton> */}

                    <IconButton>
                        {
                            props.new ?
                                <div>
                                    <AddToQueueIcon sx={{ height: 38, width: 38 }} />
                                </div>
                                :

                                props.progress == "100" ?
                                    <div>
                                        <DownloadIcon sx={{ height: 38, width: 38 }} />
                                    </div>
                                    :
                                    <div>
                                        <CircularProgress variant="determinate" value={parseInt(props.progress)} sx={{ height: 38, width: 38 }} />
                                    </div>

                        }


                    </IconButton>

                    {/* <CircularProgress variant="determinate" value={props.progress} /> */}
                    {/* <SkipNextIcon /> */}
                    {/* <IconButton aria-label="next">
            {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
          </IconButton> */}
                </Box>
            </Box>
            {/* <Img sx={{ width: '100%', height: 128, objectFit: 'contain' }} alt="youtube" src={"//img.youtube.com/vi/" + Url + "/sddefault.jpg"} /> */}
        </Card >
    );
}
