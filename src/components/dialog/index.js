import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({
    open = false, 
    handleClose, 
    title, 
    content,
    handleActionFirst,
    handleActionSecond 
}) {
  return (
    <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
    {title}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
       {content}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
    <Button onClick={handleActionSecond} autoFocus  color="error">
        Agree
      </Button>
      <Button onClick={handleActionFirst}>Disagree</Button>
    </DialogActions>
    {/* <DialogActions>
    <Button onClick={handleActionSecond} autoFocus  variant="contained" color="error">
        Delete
      </Button>
      <Button onClick={handleActionFirst}  variant="outlined"  color="secondary">Cancel</Button>
    </DialogActions> */}
  </Dialog>
  );
}
