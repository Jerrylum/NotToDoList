import { IconButton, Menu, MenuItem } from '@mui/material';
import React from 'react';
import './../App.css';

import firebaseConfig from "./../firebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth, User } from "firebase/auth";
import { doc, getFirestore, deleteDoc } from "firebase/firestore";

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const options = [
    'Delete',
    'Share'
];

const ITEM_HEIGHT = 48;

export default function LongMenu(props: { refreshToDoList: (u: User | null) => void, uuid: string }) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMain = () => {
        setAnchorEl(null);
    };
    const handleClose = (option: string) => {
        if (option === 'Delete') {
            console.log('Delete');
            deleteDoc(doc(db, "users", auth.currentUser!.uid, "todo", props.uuid));
        } else if (option === 'Share') {
            console.log('Share');
        }

        setAnchorEl(null);

        props.refreshToDoList(auth.currentUser);
    };

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMain}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                }}
            >
                {options.map((option) => (
                    <MenuItem key={option} selected={option === 'Delete'} onClick={() => handleClose(option)}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}
