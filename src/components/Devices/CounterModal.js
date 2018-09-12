import { Grid, Button, Modal, withStyles, Typography, } from '@material-ui/core';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ItemGrid } from '..';
import moment from 'moment'
import { OpenInBrowser, Timer, Done, Restore } from '@material-ui/icons'
import countermodalStyles from 'assets/jss/components/devices/countermodalStyles';
import { connect } from 'react-redux'


class CounterModal extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			count: props.count,
			open: false,
			timer: 0,
			timestamp: null,
			timestampFinish: null,
			started: false,
			finished: false
		}
		let canPlayMP3 = new Audio().canPlayType('audio/mp3');
		if (!canPlayMP3 || canPlayMP3 === 'no') {
			let msg = props.t("devices.calibration.noAudioSupported")
			// let msg = 'Your browser doesn\'t support audio files! There will be no sound feedback! Try using Google Chrome.';
			alert(msg);
		}
		this.mp3File = new Audio("/assets/sound/pop.mp3").load()
		this.timeCounter = null
	}
	timer = () => {
		this.setState({ timer: this.state.timer + 1 }, () => {
			if (this.state.count === 0) {
				clearInterval(this.timeCounter)
				this.timeCounter = null
				this.setState({ timestampFinish: moment().format("YYYY-MM-DD HH:mm:ss"), finished: true })
			}
		})
	}
	handleStart = () => {
		if (this.timeCounter === null) {
			this.setState({ timestamp: moment().format("YYYY-MM-DD HH:mm:ss"), started: true })
			this.timeCounter = setInterval(() => this.timer(), 1000)
		}
	}

	handleOpen = () => {
		this.setState({ open: true });
	};
	handleReset = () => {
		clearInterval(this.timeCounter)
		this.timeCounter = null
		this.setState({
			timer: 0,
			count: this.props.count, 
			timestamp: null,
			started: false,
			finished: false
		})
	}
	handleCount = async () => {
		let playSound = new Audio("/assets/sound/pop.mp3");
		await playSound.play().then(
			() => {
				if (this.state.count === 1)
					this.setState({ count: this.state.count - 1, finished: true, started: false })
				else
					this.setState({ count: this.state.count - 1 })
			}
			
		)
		playSound = null
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
	resetButtonDisabled = () => { 
		const { started, finished } = this.state
		if (started)
			return false
		if (finished)
			return false
		return true
	}
	render() {
		const { classes, t } = this.props;
		const { started, finished } = this.state
		return (
			<div >
				{/* <Typography gutterBottom>Click to get the full Modal experience!</Typography> */}
				<Button variant={"outlined"} color={"primary"} onClick={this.handleOpen}>
					<OpenInBrowser className={classes.iconButton} /> {t("actions.openCounter")}
				</Button>
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
									disableRipple
									classes={{
										root: classes.counterButton
									}}
									onClick={this.handleCount}
									disabled={!started || finished}
								>
									{this.state.count}
								</Button>
							</div>
						</ItemGrid>
						<ItemGrid xs={12}>
							<div style={{ display: 'flex' }}>

								<ItemGrid>
									<Button
										disabled={started}//change
										color={"primary"}
										variant="contained"
										onClick={this.state.count === 0 ? this.handleFinish : this.handleStart}>
										{this.state.count === 0 ? <Fragment>
											<Done className={classes.iconButton} />{t("actions.finish")}
										</Fragment> : <Fragment>
											<Timer className={classes.iconButton} /> {t("actions.start")}
										</Fragment>}
									</Button>
								</ItemGrid>
								<ItemGrid>
									<Button
										color={"primary"}
										variant="contained"
										disabled={this.resetButtonDisabled()}
										onClick={this.handleReset}>
										<Restore className={classes.iconButton} />{t("actions.reset")}
									</Button>
								</ItemGrid>
							</div>
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

const mapStateToProps = (state) => ({
	count: state.settings.count
})

const mapDispatchToProps = (dispatch) => {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(countermodalStyles)(CounterModal));