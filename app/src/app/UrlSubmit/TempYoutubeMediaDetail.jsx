import React, { Fragment, useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import CircularProgress from '@mui/material/CircularProgress';

export default function TempYoutubeMediadetail(props) {
    const [Submitclicked, setSubmitclicked] = useState(false);
    const submitClicked = () => {
        props.Submit_link(props.Youtube_url)
        setSubmitclicked(true)
    }
    const SUBMISSION_STATES = {
        READY: <Typography variant="overline" sx={{ alignItems: 'center', pl: 2 }}>
            Add to Queue
        </Typography>,
        FAILED: <Typography variant="overline" display="block" gutterBottom sx={{ alignItems: 'center', pl: 2 }}>
            Submission Failed
        </Typography>,
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
                image={"//img.youtube.com/vi/" + props.youtube_id + "/sddefault.jpg"}
                alt="audio file"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h6">
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                    </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                    {
                        Submitclicked ?
                            <>
                                <CircularProgress />
                            </>
                            :
                            <IconButton onClick={submitClicked}>
                                <AddToQueueIcon color="primary" sx={{ height: 38, width: 38 }} />
                            </IconButton>
                    }
                    {
                        SUBMISSION_STATES[props.Submission_state]
                    }
                </Box>
            </Box>
        </Card >
    );
}
