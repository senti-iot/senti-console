import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
// import Button from '@material-ui/core/Button';
import { Grid, Button } from '@material-ui/core';
import ItemGrid from '../Grid/ItemGrid';


const styles = theme => ({
	modalWrapper: {
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)"
	},
	paper: {
		position: 'absolute',
		width: theme.spacing.unit * 50,
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 4,
	},
	text: {
		textAlign: "center"
	},
	button: {
		display: "flex"
	},
});

class CounterModal extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			count: 0,
			open: false,
			timer: 120,
			timestamp: null
		}
	}
	timer = () => {
		this.setState({ timer: this.state.timer - 1 }, () => {
			if (this.state.timer === 0) {
				clearInterval(this.timeCounter)
				this.timeCounter = null
			}
		})
	}
	handleStart = () => {
		this.setState({ timestamp: new Date() })
		this.timeCounter = setInterval(() => this.timer(), 1000)
		console.log(this.timeCounter)
		// console.log(this.timeCounter)
	}

	handleOpen = () => {
		this.setState({ open: true });
	};
	handleReset = () => {
		clearInterval(this.timeCounter)
		this.timeCounter = null
		this.setState({
			timer: 0,
			count: 0,
			timestamp: null
		})
	}
	handleCount = () => {
		this.setState({ count: this.state.count + 1 })
	}
	handleClose = () => {
		this.setState({ open: false });
	};

	render() {
		const { classes } = this.props;

		return (
			<div>
				{/* <Typography gutterBottom>Click to get the full Modal experience!</Typography> */}
				<Button onClick={this.handleOpen}>Open Counting Window</Button>
				<Modal
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
					open={this.state.open}
					onClose={this.timeCounter ? null : this.handleClose}
				>
					<Grid 	
						container justify="space-between" className={classes.paper + " " + classes.modalWrapper}>
						<ItemGrid xs={12}>

							<Typography variant="display4" id="modal-title" className={classes.text}>
								{this.state.timer}
							</Typography>
						</ItemGrid>
						<ItemGrid xs={12} container justify={"center"} classes={{
							root: classes.counter
						}}>
							<Button
								color={"primary"}
								variant="fab"
								size={"large"}
								onClick={this.handleCount}
								disabled={this.state.timer !== 120 ? false : true}
							>
								{this.state.count}
							</Button>
						</ItemGrid>
						<ItemGrid xs={12} container justify={"space-evenly"}>
							<ItemGrid>
								<Button
									disabled={this.state.timer !== 120 ? true : false }
									color={"primary"}
									variant="contained"
									onClick={this.handleStart}>
								Start
								</Button>
							</ItemGrid>
							<ItemGrid>
								<Button
									color={"primary"}
									variant="contained"
									disabled={this.state.timer !== 120 ? false : true}
									onClick={this.handleReset}>
								Reset
								</Button>
							</ItemGrid>
						</ItemGrid>
						{/* <SimpleModalWrapped /> */}
					</Grid>
				</Modal>
			</div>
		);
	}

}

CounterModal.propTypes = {
	classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
// const CounterModal = withStyles(styles)(CounterModal);

export default withStyles(styles)(CounterModal);