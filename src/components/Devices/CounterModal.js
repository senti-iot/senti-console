import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
// import Button from '@material-ui/core/Button';
import { Grid, Button } from '@material-ui/core';
import ItemGrid from '../Grid/ItemGrid';
import moment from 'moment'

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
	wrapper: {
		minHeight: 200,
		display: 'flex',
		alignItems: 'center'
	},
	counterButton: {
		minHeight: 100,
		minWidth: 100
	}
});

class CounterModal extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			count: 200,
			open: true,
			timer: 0,
			timestamp: null,
			timestampFinish: null
		}
		this.canPlayMP3 = new Audio("/assets/sound/pop.mp3");
		if (!this.canPlayMP3.canPlayType('audio/mp3') || this.canPlayMP3 === 'no') {
			let msg = 'This website only works with browsers that can play mp3s. Try using Google Chrome.';
			alert(msg);
			throw new Error(msg);
		}
	}
	timer = () => {
		this.setState({ timer: this.state.timer + 1 }, () => {
			if (this.state.count === 0) {
				clearInterval(this.timeCounter)
				this.timeCounter = null
				this.setState({ timestampFinish: moment().format("YYYY-MM-DD HH:mm:ss") })
			}
		})
	}
	handleStart = () => {
		this.setState({ timestamp: moment().format("YYYY-MM-DD HH:mm:ss") })
		this.timeCounter = setInterval(() => this.timer(), 1000)
	}

	handleOpen = () => {
		this.setState({ open: true });
	};
	handleReset = () => {
		clearInterval(this.timeCounter)
		this.timeCounter = null
		this.setState({
			timer: 0,
			count: 200,
			timestamp: null
		})
	}
	handleCount = () => {
		this.canPlayMP3.play()
		this.setState({ count: this.state.count - 1 })
	}
	handleClose = () => {
		this.setState({ open: false });
	};
	fancyTimeFormat = (time) => {
		// Hours, minutes and seconds
		var hrs = ~~(time / 3600);
		var mins = ~~((time % 3600) / 60);
		var secs = time % 60;

		// Output like "1:01" or "4:03:59" or "123:03:59"
		var ret = "";

		if (hrs > 0) {
			ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
		}

		ret += "" + mins + ":" + (secs < 10 ? "0" : "");
		ret += "" + secs;
		return ret;
	}
	handleFinish = () => {
		this.props.handleFinish({
			count: 200,
			timestamp: this.state.timestamp,
			timestampFinish: this.state.timestampFinish,
			timer: this.state.timer
		})
		this.handleReset()
		this.handleClose()
	}
	render() {
		const { classes } = this.props;

		return (
			<div >
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

							<Typography variant="title" id="modal-title" className={classes.text}>
								{this.fancyTimeFormat(this.state.timer)}
							</Typography>
						</ItemGrid>
						<ItemGrid xs={12} container justify={"center"}>
							<div className={classes.wrapper}>
								<Button
									color={"primary"}
									variant="fab"
									classes={{
										root: classes.counterButton
									}}
									onClick={this.handleCount}
									disabled={this.state.timer !== 0 ? this.state.count !== 0 ? false : true : true}
								>
									{this.state.count}
								</Button>
							</div>
						</ItemGrid>
						<ItemGrid xs={12} container>
							<ItemGrid>
								<Button
									disabled={ this.state.count === 0 ? false : this.state.count < 200 ? true : false}
									color={"primary"}
									variant="contained"
									onClick={this.state.count === 0 ? this.handleFinish : this.handleStart}>
									{this.state.count === 0 ? "Finish" : "Start"}
								</Button>
							</ItemGrid>
							<ItemGrid>
								<Button
									color={"primary"}
									variant="contained"
									disabled={this.state.timer !== 0 ? false : true}
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