import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import Warning from '@material-ui/icons/Warning'
import { amber } from '@material-ui/core/colors';

const styles = {
	icon: {
		fontSize: 16,
		opacity: 0.9,
		marginRight: 8,
	},
	snackbar: {
		// backgroundColor: teal[500]
		background: amber[700],

	},
	button: {
		color: '#fff',
		// color: teal[500],
		background: amber[700],
		'&:hover': {
			color: '#fff',
			background: amber[500]
		}
	},
	message: {
		display: 'flex',
		alignItems: 'center',
	},
}
class NewContent extends React.Component {
	handleClose = () => {
		window.location.reload()
	};
	render() {
		const { classes } = this.props
		return (
			<div>
				<Snackbar
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					open={true}
					ContentProps={{
						'aria-describedby': 'message-id',
						className: classes.snackbar
					}}
					message={<span className={classes.message} id="message-id"><Warning className={classes.icon} />{this.props.installing ? 'Caching application ...' : 'Update Available'} </span>}
					action={!this.props.installing ? [
						<Button key="undo" className={classes.button} size="small" onClick={this.handleClose}>
							REFRESH
						</Button>,
					] : null} />
				{/* <Dialog
					open={true}
					onClose={this.handleClose}
					aria-labelledby='alert-dialog-title'
					aria-describedby='alert-dialog-description'
				>
					<DialogTitle id='alert-dialog-title'>Senti.Cloud Update Found</DialogTitle>
					<DialogContent>
						<Typography id='alert-dialog-description'>
							Update is available! {this.props.installing ? `Updating...` : `Please reload the page to access updates!`}
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
				</Dialog> */}
			</div>
		);
	}
}

export default withStyles(styles)(NewContent);