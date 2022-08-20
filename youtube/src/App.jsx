import React, { Fragment, useEffect, useState, useRef } from 'react';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid'
import UrlSubmit from './UrlSubmit/UrlSubmit';
import YoutubeMediadetail from './YoutubeMediadetail';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

import { useInterval } from './helper';

function MediaList(props) {
    const listofmedia = props.listofmedia
    if (listofmedia == null) {
        return
    }
    const listItems = listofmedia.map((media, index) =>
        <div key={media.id}>
            {props.filter != media.youtube_id ?
                <YoutubeMediadetail data={media} />
                :
                <div></div>
            }
        </div>
    );
    return (
        <Stack spacing={1}>{listItems}</Stack>
    );
}

export default function App() {
    const [RecentList, setRecentList] = useState(null)
    const [SubmittedItembyUser, setSubmittedItembyUser] = useState(null)
    const [UrlId, setUrlId] = useState('')
    const [Pollingdelay, setPollingdelay] = useState(null)
    const [Connected, setConnected] = useState(true)

    useEffect(() => {
        setSubmittedItembyUser(null)
    }, [UrlId])


    useEffect(() => {
        listupdate()
    }, [])

    useInterval(async () => {
        listupdate()
    }, Pollingdelay);

    const listupdate = () => {

        fetch('/youtube/recent', {
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
                    setConnected(true)
                    setPollingdelay(5000)
                    return response.json()
                }
                else {
                    setPollingdelay(null)
                }
                // throw response
            })
            .then(data => {
                setRecentList(data)

                data.forEach((element, index) => {
                    if (element.youtube_id == UrlId) {
                        setSubmittedItembyUser(element)
                    }
                })
            })
            .catch(error => {
                // console.error(error)
                setPollingdelay(null)
            })
    }

    const Submit_link = () => {
        let url = '/youtube/submit/' + UrlId
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
                    return response.json()
                }
                else {
                    console.log("submit failed")
                }
                throw response
            })
            .then(data => {
                setSubmittedItembyUser(data)
            })
            .catch(error => {
                console.error(error)
            })
    }

    return (
        <Fragment>
            <Grid container direction="column"
                // justifyContent="space-around"
                // alignItems="stretch"
                sx={{ p: 2 }}
            >
                {Connected ?
                    <>
                        {/* <Grid item xs>
                            <Chooser setmode={setMode} />
                        </Grid> */}
                        <Grid item xs>
                            <UrlSubmit SubmittedItembyUser={SubmittedItembyUser} submit_link={Submit_link} setUrlId={setUrlId} UrlId={UrlId} />
                        </Grid>
                        <Grid item sx={{ paddingTop: 5 }}>

                            <Typography variant="h6" gutterBottom component="div">
                                Recently added
                            </Typography>
                            <MediaList listofmedia={RecentList} filter={UrlId} />
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