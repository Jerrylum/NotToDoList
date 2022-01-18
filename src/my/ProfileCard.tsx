import React from 'react';
import './../App.css';

import { Avatar, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';

import firebaseConfig from "./../firebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth, User  } from "firebase/auth";

initializeApp(firebaseConfig);

export default (props: { refreshToDoList: (u: User | null) => void, userProfile: User, setUserProfile: React.Dispatch<React.SetStateAction<User | undefined>> }) => {
    return (
        <Card style={{ backgroundColor: '#FAFAFA' }} >
            <CardContent style={{ paddingBottom: "1rem" }}>
                <Grid container justifyContent="space-between" spacing={2}>
                    <Grid item>
                        <Stack direction="row" spacing={2}>
                            <Avatar alt={props.userProfile.displayName || ''} src={props.userProfile.photoURL || ''} />
                            <Stack direction="column" justifyContent="center">
                                <Typography variant="h5" component="h5"> {props.userProfile.displayName || ''} </Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={() => {
                            getAuth().signOut();
                            props.setUserProfile(undefined);
                            props.refreshToDoList(null);
                        }}>Logout</Button>
                    </Grid>

                </Grid>
            </CardContent>
        </Card>
    );
};