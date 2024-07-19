import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Outlet } from 'react-router-dom'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

export default function BaseLayout(props) {

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    // alignContent: "center",
                    paddingTop: "1em",
                    margin: "1em",
                    // display: 'flex',
                    // justifyContent: 'space-evenly'
                }}
            >
                {/* <Link href="/home"> Home</Link>
                <Link href="/create">Create</Link> */}
                <Outlet />
            </Box>
        </Container>
    )
}