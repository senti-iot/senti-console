import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ItemG } from 'components';
import { primaryColor } from 'assets/jss/material-dashboard-react';
import { withStyles } from '@material-ui/core';

const styles = {
	button: {
		color: primaryColor
	}
}
class NewContent extends React.Component {
	state = {
		open: false,
	};

	handleClickOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		window.location.reload()
	};

	render() {
		return (
			<div>
				<Dialog
					open={true}
					onClose={this.handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">Update Found</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							New Content is available! Please reload the page!
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<ItemG container justify={"center"} alignItems={'center'}>
							<Button onClick={this.handleClose} className={this.props.classes.button}>
								Reload
							</Button>
						</ItemG>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

export default withStyles(styles)(NewContent);