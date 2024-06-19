import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Outlet } from 'react-router-dom'
import Container from '@mui/material/Container';

export default function BaseLayout(props) {

    return (
        <Container maxWidth="sm">
            hello
            <Outlet />
        </Container>
    )
}