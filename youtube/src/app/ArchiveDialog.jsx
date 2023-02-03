import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import ArchiveIcon from '@mui/icons-material/Archive';
import IconButton from '@mui/material/IconButton';
export default function ArchiveDialog(props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseDelete = () => {
        props.archive(props.id)
        setOpen(false);
    };

    return (
        <div>
            {/* <Button variant="outlined" onClick={handleClickOpen}>
                Open alert dialog
            </Button> */}
            <IconButton onClick={handleClickOpen}>
                <ArchiveIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Archive File?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {props.title}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>Cancel</Button>
                    <Button onClick={handleCloseDelete}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}