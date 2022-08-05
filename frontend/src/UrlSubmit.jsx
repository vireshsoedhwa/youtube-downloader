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

import LinearProgressWithLabel from './LinearWithLabel';
import CircularProgress from '@mui/material/CircularProgress';
import MediaControlCard from './Mediadetail';

// function RecentList() {
//     return(<p></p>)
// }

export default function UrlSubmit(props) {

    const [Textfieldhelperstate, setTextfieldhelperstate] = useState({ error: false, id: "outlined-error-helper-text" })
    const [DisableDownload, setDisableDownload] = useState(true)
    const [InputErrorMsg, setInputErrorMsg] = useState('')
    const [Valid, setValid] = useState(false)
    const [Url, setUrl] = useState('')
    const [Progress, setProgress] = useState(100)
    const [RecentList, setRecentList] = useState(null)

    useEffect(() => {
        console.log("ulrsubmit loaded")

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
                console.log("reponse")
                if (response.ok) {
                    return response.json()
                }
                throw response
            })
            .then(data => {
                console.log("data")
                console.log(data)
                setRecentList(data)
            })
            .catch(error => {
                console.error(error)
            })
    }, [])

    const ChangeURL = (value) => {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = value.target.value.match(regExp);
        if (match && match[2].length == 11) {
            setTextfieldhelperstate({ error: false, helperText: "" })
            setTextfieldhelperstate({ error: false })
            setDisableDownload(false)
            setInputErrorMsg("")
            setUrl(match[2])
            setValid(true)
        } else {
            // setTextfieldhelperstate({ error: true, helperText: "Incorrect URL" })
            setTextfieldhelperstate({ error: true })
            setInputErrorMsg("Incorrect URL")
            setValid(false)
            setDisableDownload(true)
        }
    }

    return (
        <Fragment>
            <CssBaseline />
            <Paper
                sx={{
                    p: 1,
                    margin: 'auto',
                    maxWidth: '100%',
                    flexGrow: 1,
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                }}
            >

                <Grid container rowSpacing={3} columnSpacing={{ xs: 3, sm: 2, md: 3 }}>

                    <Grid item xs={12}>
                        <Grid item xs container direction="column"
                            justifyContent="center"
                            alignItems="stretch"
                            rowSpacing={3}
                        >

                            <Grid item xs>
                                <FormControl fullWidth sx={{ m: 0 }}>
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
                            <Grid item xs>
                                {Valid ?
                                    <div>
                                        <MediaControlCard url={Url} progress={Progress} />
                                    </div>
                                    :
                                    // <ButtonBase sx={{ width: '100%', height: 128 }}>
                                    //     <Box sx={{ p: 2 }}>
                                    //     </Box>
                                    // </ButtonBase>
                                    <div>
                                        {/* <MediaControlCard url={null} progress={0} /> */}
                                    </div>
                                }
                            </Grid>

                            {/* ========================================= last 5 recent ============================================== */}

                            {/* <Grid item xs>
                                <div>
                                    <MediaControlCard url={Url} progress={Progress} title={null} />
                                </div>
                            </Grid>

                            <Grid item xs>
                                <div>
                                    <MediaControlCard url={Url} progress={Progress} title={null} />
                                </div>
                            </Grid> */}

                            {/* <RecentList /> */}


                        </Grid>
                    </Grid>




                </Grid>
            </Paper>
        </Fragment >
    );
}





