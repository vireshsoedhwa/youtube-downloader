import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AddBoxIcon from '@mui/icons-material/AddBox';
import Button from '@mui/material/Button';
import useResourceList from '../hooks/useResourceList'

export default function Home() {
    const navigate = useNavigate();

    const { ResourceListData,
        ResourceListIsSuccesful,
        ResourceListIsLoading,
        ResourceListIsSubmitted,
        ResourceListError,
        ResourceList } = useResourceList()

    useEffect(() => {
        ResourceList()
    }, []);

    return (
        <>
            <Button variant="contained"
                onClick={() => navigate("/create")}>
                new
                <AddBoxIcon />
            </Button>
        </>
    );
}