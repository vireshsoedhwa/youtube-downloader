import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AddBoxIcon from '@mui/icons-material/AddBox';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';

export default function Preview() {
    const navigate = useNavigate();
    let location = useLocation();
    const [previewobject, setPreviewObject] = useState(null);

    useEffect(() => {
        if (location.state) {
            setPreviewObject(location.state.item.id)
        }
        else {
            navigate("/")
        }
    }, [location]);

    return (
        <Box
            sx={{
                alignContent: "center",
                marginBottom: "1em",
                display: 'flex',
                justifyContent: 'space-evenly',
                flexDirection: 'column'
            }}
        >
            <Typography variant="h5" gutterBottom>
                Preview
            </Typography>
            <Button variant="outlined"
                onClick={() => navigate("/")}>
                <ArrowBackIcon />
            </Button>
            {previewobject}

            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Inbox" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
}