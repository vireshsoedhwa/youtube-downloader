import React, { Fragment, useEffect, useState, useRef } from 'react';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid'
import UrlSubmit from './UrlSubmit/UrlSubmit';
import YoutubeMediadetail from './YoutubeMediadetail';
import MediaDetail from './MediaDetail';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

import { useInterval } from './helper';

function MediaList(props) {
    const listofmedia = props.listofmedia
    if (listofmedia == null) {
        return
    }
    const listItems = listofmedia.map((media, index) =>
        <div key={index}>
            {media.youtubedata ?
                <YoutubeMediadetail data={media} />
                :
                <MediaDetail data={media} />
            }
        </div>
    );
    return (
        <Stack spacing={1}>{listItems}</Stack>
    );
}

export default function App() {
    const [Mode, setMode] = useState(0)
    const [RecentList, setRecentList] = useState(null)
    const [Pollingdelay, setPollingdelay] = useState(null)
    const [Connected, setConnected] = useState(true)

    // useEffect(() => {
    //     listupdate()
    // }, [])

    // useInterval(async () => {
    //     listupdate()
    // }, Pollingdelay);

    // const listupdate = () => {

    //     fetch('/recent', {
    //         method: 'get',
    //         mode: 'no-cors',
    //         credentials: 'omit',
    //         headers: {
    //             'Access-Control-Allow-Origin': '*',
    //             'Content-Type': 'application/json'
    //         },
    //         redirect: 'follow'
    //     })
    //         .then(response => {
    //             if (response.ok) {
    //                 setConnected(true)
    //                 return response.json()
    //             }
    //             else {
    //                 setPollingdelay(null)
    //             }
    //             // throw response
    //         })
    //         .then(data => {
    //             setRecentList(data)
    //             setPollingdelay(null)
    //         })
    //         .catch(error => {
    //             // console.error(error)
    //         })
    // }


    return (
        <Fragment>
            <Grid container direction="column"
                // justifyContent="space-around"
                // alignItems="stretch"
                sx={{ p: 10 }}
            >
                {Connected ?
                    <>
                        {/* <Grid item xs>
                            <Chooser setmode={setMode} />
                        </Grid> */}
                        <Grid item xs>
                            <UrlSubmit />
                        </Grid>
                        <Grid item sx={{ paddingTop: 5 }}>

                            <Typography variant="h6" gutterBottom component="div">
                                Recently added
                            </Typography>
                            <MediaList listofmedia={RecentList} />
                        </Grid>
                    </>
                    :
                    <Grid item sx={{ paddingTop: 5 }}>
                        <Alert severity="error">Service Unreachable</Alert>
                    </Grid>
                }
            </Grid>
        </Fragment>
    );
}