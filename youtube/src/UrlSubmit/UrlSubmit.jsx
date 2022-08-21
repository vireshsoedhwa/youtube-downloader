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

import YoutubeMediadetail from '../YoutubeMediadetail';
import TempYoutubeMediadetail from './TempYoutubeMediaDetail';

export default function UrlSubmit(props) {

    const [Textfieldhelperstate, setTextfieldhelperstate] = useState({ error: false, id: "outlined-error-helper-text" })
    const [InputErrorMsg, setInputErrorMsg] = useState('')

    const ChangeURL = (value) => {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = value.target.value.match(regExp);
        if (match && match[2].length == 11) {
            setTextfieldhelperstate({ error: false })
            setInputErrorMsg("")
            props.setUrlId(match[2])
        } else {
            setTextfieldhelperstate({ error: true })
            setInputErrorMsg("Incorrect URL")
            props.setUrlId(null)
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
                    {props.UrlId ?
                        <div>
                            {props.SubmittedItembyUser ?
                                <YoutubeMediadetail data={props.SubmittedItembyUser} submit_link={props.submit_link} listupdate={props.listupdate}/>
                                :
                                <TempYoutubeMediadetail youtube_id={props.UrlId} submit_link={props.submit_link} />
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