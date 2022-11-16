import React, { Fragment, useEffect, useState, useRef } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert';

export default function App() {
    const [values, setValues] = React.useState({
        username: '',
        password: '',
        showPassword: false,
        authFailed: false
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        const request = new Request('/accounts/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'X-CSRFTOKEN': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: new URLSearchParams({
                'csrfmiddlewaretoken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                'username': values.username,
                'password': values.password
            })
        });

        fetch(request)
            .then((response) => {
                console.log(response)
                if (response.redirected) {
                    window.location.href = response.url;
                }
                else {
                    setValues({
                        ...values,
                        authFailed: true,
                    });
                }
            })
            .catch((error) => console.error(error));
    }


    return (
        <div>
            <Grid container direction="column"
                justifyContent="center"
                alignItems="center"
                sx={{ p: 0 }}
            >
                <Grid item sx={{ paddingTop: 5 }}>
                    <form onSubmit={handleSubmit}>
                        <FormControl sx={{ marginTop: 2, width: '100%' }} variant="outlined" fullWidth>
                            <InputLabel>Username</InputLabel>
                            <OutlinedInput
                                onChange={handleChange('username')}
                                label="Username"
                            />
                        </FormControl>
                        <FormControl sx={{ marginTop: 2, width: '100%' }} variant="outlined" >
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={values.showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={handleChange('password')}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>
                        {values.authFailed &&
                            <Alert sx={{ marginTop: 2, p: 0, width: '100%' }} severity="error">Auth Failed</Alert>
                        }
                        <Button
                            sx={{ marginTop: 2, p: 2, width: '100%' }}
                            variant="contained"
                            color="primary"
                            fullWidth
                            type="submit">
                            Log in
                        </Button>
                    </form>
                </Grid>
            </Grid>
        </div >
    )
}