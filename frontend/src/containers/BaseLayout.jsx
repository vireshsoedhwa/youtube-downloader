import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Outlet } from 'react-router-dom'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

export default function BaseLayout(props) {

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    alignContent: "center",
                    marginBottom: "1em"
                }}
            >
                <Link href="/home">Home</Link>
                <Link href="create">Create</Link>
            </Box>
            <Outlet />
        </Container>
    )
}