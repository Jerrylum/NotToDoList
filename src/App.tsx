import React, { Component } from 'react';
import './App.css';

import Button from '@mui/material/Button';
import { Backdrop, Card, CardContent, Container, Paper, TextField, Typography } from '@mui/material';

import ITodo from './my/ITodo';
import ToDoCard from './my/ToDoCard';
import ProfileCard from './my/ProfileCard';

import firebaseConfig from "./firebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { collection, getFirestore, getDocs, addDoc } from "firebase/firestore";

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');


function App() {

  const [userProfile, setUserProfile] = React.useState<User | undefined>(undefined);

  const [todoData, setTodoData] = React.useState<ITodo[]>([]);

  const [addInput, setAddInput] = React.useState<string>("");


  function startLogin() {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUserProfile(result.user);
        refreshToDoList(result.user);
      }).catch((error) => { });
  }

  async function refreshToDoList(user: User | null) {
    if (user == undefined) {
      setTodoData([]);
      return;
    }

    var cache: ITodo[] = [];

    const querySnapshot = await getDocs(collection(db, "users", user.uid, "todo"));
    querySnapshot.forEach((doc: { id: string; data: () => any; }) => {
      cache.push({ ...doc.data(), uuid: doc.id });
    });

    setTodoData(cache);
  }

  function addToDoList() {
    addDoc(collection(db, "users", userProfile!.uid, "todo"), {
      info: addInput,
      done: false
    });

    setAddInput("");

    refreshToDoList(userProfile!);
  }


  return (
    <div>
      <Container maxWidth="sm">
        <h1>To Do List</h1>
        {userProfile ? <ProfileCard userProfile={userProfile} setUserProfile={setUserProfile} refreshToDoList={refreshToDoList}></ProfileCard> : null}
        {todoData.map((todo: ITodo) => <ToDoCard key={todo.uuid} thedata={todo} refreshToDoList={refreshToDoList}></ToDoCard>)}
        <Card sx={{ minWidth: 275, pb: 0, mt: 3 }}>
          <CardContent style={{ paddingBottom: "1rem" }}>
            <Typography>Add to list</Typography>
            <TextField id="standard-basic" fullWidth variant="standard" sx={{ mb: 2 }} value={addInput} onChange={(e) => setAddInput(e.target.value)} />
            <Button variant="contained" color="primary" onClick={addToDoList}>Add</Button>
          </CardContent>
        </Card>
      </Container>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={userProfile == null}
      >
        <Paper>
          <Button onClick={startLogin}>Login</Button>
        </Paper>
      </Backdrop>
    </div>
  );
}

export default App;
