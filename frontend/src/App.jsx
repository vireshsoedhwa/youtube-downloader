import React, { Fragment, useEffect, useState, useRef } from 'react';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid'
import Chooser from './Chooser';
import FileSubmit from './FileSubmit';
import UrlSubmit from './UrlSubmit';


export default function App() {
    const [Mode, setMode] = useState(0)

    // const [Pollingdelay, setPollingdelay] = useState(null);
    /*
        status list:
        idle, valid, rejected , downloading , download_finished, finished, converting
    */
    // const ws = useRef(null);

    // useInterval(async () => {
    //     console.log("polling")
    //     if (!Connect) {
    //         makeConnection();
    //         console.log("retrying connection");
    //     }
    //     // setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    // }, Pollingdelay);

    // const PostUrl = () => {
    //     const data = { url: Url };
    //     const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
    //     // console.log(csrftoken)
    //     let filename = "download.mp3";
    //     fetch('/api/submitlink', {
    //         method: 'POST', // or 'PUT'
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Access-Control-Allow-Origin': '*',
    //             'X-CSRFTOKEN': csrftoken
    //         },
    //         body: JSON.stringify(data),
    //     })
    //         .then(response => {
    //             filename = response.headers.get('Content-Disposition').split('=')[1].slice(1, -1);
    //             return response.blob()
    //         })
    //         .then((blob) => {
    //             var a = document.createElement('a');
    //             a.href = window.URL.createObjectURL(blob);
    //             var attr = document.createAttribute("download");
    //             a.setAttributeNode(attr);
    //             a.style.display = 'none';
    //             a.download = filename;
    //             document.body.appendChild(a);
    //             a.click();
    //             a.remove();
    //         })
    //         .catch((error) => {
    //             console.error('Error:', error);
    //         });
    // }

    return (
        <Fragment>
                <Stack spacing={2}>
                <Grid item xs container direction="column"
                    justifyContent="space-around"
                    alignItems="stretch"
                >
                    <Grid item xs>
                        <Chooser setmode={setMode} />
                    </Grid>
                    <Grid item>
                        {Mode == 1 ?
                            <FileSubmit></FileSubmit>
                            :
                            <UrlSubmit />
                        }
                    </Grid>
                    <Grid item xs>

                    </Grid>
                </Grid>
                </Stack>                
        </Fragment>
    );
}

// export function useInterval(callback, delay) {
//     const savedCallback = useRef();
//     //Remember the latest callback.
//     useEffect(() => {
//         savedCallback.current = callback;
//     }, [callback]);

//     //Set up the interval.
//     useEffect(() => {
//         function tick() {
//             savedCallback.current();
//         }
//         if (delay != null) {
//             const id = setInterval(tick, delay);
//             return () => {
//                 clearInterval(id);
//             };
//         }
//     }, [callback, delay]);
// }