import React from 'react';
import './../App.css';

import { Card, CardContent, Checkbox, Grid, Stack, Typography } from '@mui/material';

import ITodo from './ITodo';

import firebaseConfig from "./../firebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth, User } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import CardMenu from './CardMenu';

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export default (props: { refreshToDoList: (u: User | null) => void, thedata: ITodo }) => {
    const [done, setDone] = React.useState<boolean>(props.thedata.done);
  
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDone(e.target.checked);
  
      const send = { info: props.thedata.info, done: e.target.checked };
      setDoc(doc(db, "users", auth.currentUser!.uid, "todo", props.thedata.uuid), send);

      props.refreshToDoList(auth.currentUser);
    };
  
    return (
      <Card sx={{ minWidth: 275, pb: 0, mt: 3 }}>
        <CardContent style={{ paddingBottom: "1rem" }}>
          <Grid container justifyContent="space-between" spacing={2}>
            <Grid item>
              <Stack direction="row" spacing={2}>
                <Checkbox defaultChecked={props.thedata.done} onChange={onChange} />
                <Stack direction="column" justifyContent="center">
                  <Typography style={{ textDecoration: done ? 'line-through' : 'none' }}>
                    {props.thedata.info}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
  
            <Grid item>
  
              <CardMenu refreshToDoList={props.refreshToDoList} uuid={props.thedata.uuid}></CardMenu>
            </Grid>
  
          </Grid>
  
        </CardContent>
      </Card>
    );
  };