import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Navigate } from "react-router-dom";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import LinkIcon from '@mui/icons-material/Link';
import useCreateResource from '../hooks/useCreateResource'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";

export default function Create() {
    const navigate = useNavigate();

    const { createResourceIsSuccesful,
        createResourceIsLoading,
        createResourceIsSubmitted,
        createResourceError,
        createResource } = useCreateResource()

    useEffect(() => {
        if(createResourceIsSuccesful){
            navigate("/home")
        }
    }, [createResourceIsSuccesful]);

    return (
        <Box
            component="form"
            onSubmit={createResource}
            sx={{
            }}
        >
            <FormControl fullWidth>
                <Stack spacing={2} direction="column">
                    <TextField
                        type="url"
                        id="url"
                        label="URL"
                        name="url"
                        variant="outlined"
                    />
                    <Stack spacing={2} direction="row">
                        <Button variant="outlined"
                            onClick={() => navigate("/home")}>
                            <ArrowBackIcon />
                        </Button>
                        {createResourceError &&
                            <>
                                Error
                            </>
                        }
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={!createResourceIsSubmitted}
                        >
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </FormControl>
        </Box>
    );
}