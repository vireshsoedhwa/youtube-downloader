import React, { Fragment, useEffect, useState, useRef } from 'react';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid'
import UrlSubmit from './UrlSubmit/UrlSubmit';
import YoutubeMediadetail from './YoutubeMediadetail';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

import { useInterval } from './helper';

function MediaList(props) {
    const listofmedia = props.listofmedia
    if (listofmedia == null) {
        return
    }
    const listItems = listofmedia.map((media, index) =>
        <div key={media.id}>
            {props.filter != media.youtube_id ?
                <YoutubeMediadetail data={media} listupdate={props.listupdate} delete_item = {props.delete_item}/>
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
        setSubmission_state("READY")
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
            mode: 'same-origin',
            credentials: 'same-origin',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'X-CSRFTOKEN': document.querySelector('[name=csrfmiddlewaretoken]').value
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
            mode: 'same-origin',
            credentials: 'same-origin',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFTOKEN': document.querySelector('[name=csrfmiddlewaretoken]').value
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

    const delete_item = (item) => {
        let url = '/resource/' + item + '/'
        fetch(url, {
            method: 'DELETE',
            mode: 'same-origin',
            credentials: 'same-origin',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFTOKEN': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                else {

                    console.log("deleted")
                }
                throw response
            })
            .then(data => {
                console.log(data)
            })
            .catch(error => {
                console.error(error)
            })
    }

    return (
        <Fragment>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            
                        </Typography>
                        <Button href="/accounts/logout/" color="inherit">Logout</Button>
                    </Toolbar>
                </AppBar>
            </Box>
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
                                listupdate={listupdate} 
                                delete_item={delete_item}/>
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