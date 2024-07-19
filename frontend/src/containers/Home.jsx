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
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

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
            <List sx={{ bgcolor: 'background.paper' }}>
                {ResourceListData.map((item, index) => (
                    <React.Fragment key={index} >
                        <ListItem
                            disablePadding
                            alignItems="flex-start"
                            onClick={() => { navigate("/preview", { state: { item: item } }) }}
                        >
                            <ListItemButton>
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
                            </ListItemButton>
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
                // marginBottom: "1em",
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'space-evenly',
                flexDirection: 'column'
            }}
        >
            <Typography
                sx={{
                    justifyContent: "center"
                }}
                variant="h5" gutterBottom>
                Youtube Downloader
            </Typography>
            <Button variant="contained"
                onClick={() => navigate("/create")}>
                new
                <AddBoxIcon />
            </Button>
            {ResourceListIsSuccesful &&
                <>
                    {ResourceListIsLoading ?
                        <>
                            <Skeleton />
                        </>
                        :
                        <>
                            <Resourcelist />
                        </>
                    }
                </>
            }
        </Box>
    );
}