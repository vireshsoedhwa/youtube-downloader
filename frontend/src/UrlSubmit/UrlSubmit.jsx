import React, { Fragment, useEffect, useState, useRef } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import ButtonBase from '@mui/material/ButtonBase';

import LinearProgressWithLabel from '../LinearWithLabel';
import CircularProgress from '@mui/material/CircularProgress';
import YoutubeMediadetail from '../YoutubeMediadetail';
import TempYoutubeMediadetail from './TempYoutubeMediaDetail';
import ProgressYoutubeMediadetail from './ProgressYoutubeMediaDetail';
import { getDisplayName } from '@mui/utils';

export default function UrlSubmit(props) {

    const [Textfieldhelperstate, setTextfieldhelperstate] = useState({ error: false, id: "outlined-error-helper-text" })
    const [InputErrorMsg, setInputErrorMsg] = useState('')
    const [Valid, setValid] = useState(false)
    const [Url, setUrl] = useState('')
    const [UrlId, setUrlId] = useState('')
    const [DownloadProgressInfo, setDownloadProgressInfo] = useState(null)
    const [Received, setReceived] = useState(false)
    const [Pollingdelay, setPollingdelay] = useState(null);

    useInterval(async () => {
        Submit_link()
    }, Pollingdelay);

    const ChangeURL = (value) => {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = value.target.value.match(regExp);
        if (match && match[2].length == 11) {
            setTextfieldhelperstate({ error: false, helperText: "" })
            setTextfieldhelperstate({ error: false })
            setInputErrorMsg("")
            setUrlId(match[2])
            setUrl(value.target.value)
            setValid(true)
        } else {
            setTextfieldhelperstate({ error: true })
            setInputErrorMsg("Incorrect URL")
            setValid(false)
        }
    }




    const Submit_link = () => {
        // console.log("submitted   nnoow")
        if (Valid) {
            const formData = new FormData();
            formData.append('youtube_id', Url);
            fetch('/submit', {
                method: 'post',
                body: formData,
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
                    throw response
                })
                .then(data => {
                    setDownloadProgressInfo(data)
                    setReceived(true)
                    if(data.status == "BUSY"){
                        setPollingdelay(5000)
                    }
                    else{
                        setPollingdelay(null)
                    }
                })
                .catch(error => {
                    console.error(error)
                })
        }
    }

    return (
        <Fragment>
            <CssBaseline />
            <Grid container direction="column"
                // justifyContent="center"
                // alignItems="stretch"
                rowSpacing={1}
            >
                <Grid item xs>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="outlined-adornment-amount">URL</InputLabel>
                        <OutlinedInput
                            // id="outlined-adornment-amount"
                            id="component-error"
                            // value=""
                            onChange={ChangeURL}
                            // error
                            {...Textfieldhelperstate}
                            startAdornment={<InputAdornment position="start"></InputAdornment>}
                            label="Amount"
                            aria-describedby="component-error-text"
                        />
                        <FormHelperText id="component-error-text">{InputErrorMsg}</FormHelperText>
                    </FormControl>
                </Grid>
                {/* ========================================== media detail ============================================= */}
                <Grid item>
                    {Valid ?
                        <div>
                            {Received ?
                                <ProgressYoutubeMediadetail data={DownloadProgressInfo}/>
                                :
                                <TempYoutubeMediadetail youtube_id={UrlId} submit_link={Submit_link}/>
                            }
                        </div>
                        :
                        <div>
                        </div>
                    }
                </Grid>
            </Grid>
        </Fragment >
    );
}





export function useInterval(callback, delay) {
    const savedCallback = useRef();
    //Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    //Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay != null) {
            const id = setInterval(tick, delay);
            return () => {
                clearInterval(id);
            };
        }
    }, [callback, delay]);
}