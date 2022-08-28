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
                <YoutubeMediadetail data={media} listupdate={props.listupdate} />
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
    const [Submission_state, setSubmission_state] = useState('READY')
    const [UrlId, setUrlId] = useState('')
    const [Youtube_url, setYoutube_url] = useState('')
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
        fetch('/resource/', {
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
                throw response
            })
            .then(data => {
                setRecentList(data)
                const found = data.find(element => element.youtube_id == UrlId);
                if (typeof found !== 'undefined') {
                    setSubmittedItembyUser(found)
                } else {
                    setSubmittedItembyUser(null)
                    setSubmission_state("READY")
                }
            })
            .catch(error => {
                console.error(error)
                setPollingdelay(null)
            })
    }

    const Submit_link = (youtube_url) => {
        let url = '/resource/'
        var formcontent = {
            'youtube_url': youtube_url,
        };

        const formBody = Object.keys(formcontent).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(formcontent[key])).join('&');

        fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            credentials: 'omit',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                else {
                    setSubmission_state("FAILED")
                    console.log("submit failed")
                }
                throw response
            })
            .then(data => {
                setSubmission_state("SUCCES")
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
                            <UrlSubmit Submission_state={Submission_state}
                                SubmittedItembyUser={SubmittedItembyUser}
                                Submit_link={Submit_link}
                                setUrlId={setUrlId}
                                setYoutube_url={setYoutube_url}
                                UrlId={UrlId}
                                Youtube_url={Youtube_url}
                                listupdate={listupdate} />
                        </Grid>
                        <Grid item sx={{ paddingTop: 5 }}>

                            <Typography variant="h6" gutterBottom component="div">
                                Recently added
                            </Typography>
                            <MediaList listofmedia={RecentList}
                                filter={UrlId}
                                listupdate={listupdate} />
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