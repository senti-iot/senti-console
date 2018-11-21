import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ItemG, /* CircularLoader */ } from 'components';
import { primaryColor } from 'assets/jss/material-dashboard-react';
import { withStyles, CircularProgress, Typography } from '@material-ui/core';

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
					aria-labelledby='alert-dialog-title'
					aria-describedby='alert-dialog-description'
				>
					<DialogTitle id='alert-dialog-title'>Update Found</DialogTitle>
					<DialogContent>
						<Typography id='alert-dialog-description'>
							New Content is available! {this.props.installing ? `Updating...` : `Please reload the page!`}
						</Typography>
					</DialogContent>
					<DialogActions>
						<ItemG container justify={'center'} alignItems={'center'}>
							
							<Button
								disabled={this.props.installing}
								classes={{
									label: this.props.classes.button,
									root: this.props.classes.button,
									disabled: this.props.classes.button
								}}
								onClick={this.handleClose} className={this.props.classes.button}>
								{this.props.installing ? <CircularProgress  color={'inherit'}/> : 'Reload'}
							</Button>
						
						</ItemG>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

export default withStyles(styles)(NewContent);