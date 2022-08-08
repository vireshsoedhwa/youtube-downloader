import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DownloadIcon from '@mui/icons-material/Download';
import CircularProgress from '@mui/material/CircularProgress';

export default function ProgressYoutubeMediadetail(props) {


    const MEDIADETAIL_STATES = {
        DONE: <IconButton><DownloadIcon sx={{ height: 38, width: 38 }} /></IconButton>,
        BUSY: <CircularProgress sx={{ height: 38, width: 38 }} variant="determinate" value={parseInt(props.data.downloadprogress)} />,
    }

    return (
        <Card
            sx={{
                display: 'flex',
                backgroundColor: '#e3f3fc'
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
                        {props.data.status == "DONE" ?
                            <></> : <>In Progress</>}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                    </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                    {/* <IconButton onClick={props.submit_link}> */}
                    {
                        MEDIADETAIL_STATES[props.data.status]
                    }
                    {/* </IconButton> */}
                </Box>
            </Box>
        </Card >
    );
}
