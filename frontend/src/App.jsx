import React, { Fragment, useEffect, useState, useRef } from 'react';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid'
import Chooser from './Chooser';
import FileSubmit from './FileSubmit';
import UrlSubmit from './UrlSubmit/UrlSubmit';
import YoutubeMediadetail from './YoutubeMediadetail';
import MediaDetail from './Mediadetail';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

function MediaList(props) {
    const listofmedia = props.listofmedia
    if (listofmedia == null) {
        return
    }
    const listItems = listofmedia.map((media, index) =>
        <div key={index}>
            {media.youtube_data ?
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

    useEffect(() => {
        fetch('/recent', {
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
                throw response
            })
            .then(data => {
                setRecentList(data)
            })
            .catch(error => {
                console.error(error)
            })
    }, [])
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
            {/* <Stack spacing={2}> */}
            <Grid container direction="column"
                // justifyContent="space-around"
                // alignItems="stretch"
                sx={{ p: 1 }}
            >
                <Grid item xs>
                    <Chooser setmode={setMode} />
                </Grid>
                <Grid item xs>
                    {Mode == 1 ?
                        <FileSubmit />
                        :
                        <UrlSubmit />
                    }
                </Grid>
                <Grid item sx={{ paddingTop: 5 }}>
                    <Typography variant="h6" gutterBottom component="div">
                        Recently added
                    </Typography>
                    <MediaList listofmedia={RecentList} />
                </Grid>
            </Grid>
            {/* </Stack> */}
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