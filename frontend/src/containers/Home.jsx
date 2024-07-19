import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AddBoxIcon from '@mui/icons-material/AddBox';
import Button from '@mui/material/Button';
import useResourceList from '../hooks/useResourceList'
import Box from '@mui/material/Box';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

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

    const Resourcelist = () => {

        return (
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {ResourceListData.map((item, index) => (
                    <React.Fragment key={index} >
                        <ListItem alignItems="flex-start"
                            onClick={() => { console.log("clicked") }}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    variant="rounded"
                                    alt={item.title}
                                    src={"https://img.youtube.com/vi/" +
                                        item.youtube_id +
                                        "/sddefault.jpg"}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={item.title}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {item.url}
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List>
        );
    }

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
            <Button variant="contained"
                onClick={() => navigate("/create")}>
                new
                <AddBoxIcon />
            </Button>
            {ResourceListIsSuccesful &&
                <Resourcelist />
            }
        </Box>
    );
}