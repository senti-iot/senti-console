import { Grid, Button, Modal, withStyles, Typography, } from '@material-ui/core';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ItemGrid } from 'components';
import moment from 'moment'
import { OpenInBrowser, Timer, Done, Restore } from 'variables/icons'
import countermodalStyles from 'assets/jss/components/devices/countermodalStyles';
import { connect } from 'react-redux'


class TimeCounterModal extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			count: 0,
			open: false,
			timer: props.tcount ? props.tcount : 600,
			timestamp: null,
			timestampFinish: null,
			started: false,
			finished: false
		}
		let canPlayMP3 = new Audio().canPlayType('audio/mp3');
		if (!canPlayMP3 || canPlayMP3 === 'no') {
			let msg = props.t('no.audioSupported')
			alert(msg);
			this.noSound = true
		}
		this.mp3File = new Audio('/assets/sound/pop.mp3')
		this.timeCounter = null
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.tcount !== this.props.tcount)
			this.setState({
				timer: this.props.tcount
			})
	}
	timer = () => {
		this.setState({ timer: this.state.timer - 1 }, () => {
			if (this.state.timer === 0) {
				clearInterval(this.timeCounter)
				this.timeCounter = null
				this.setState({ timestampFinish: moment().format('YYYY-MM-DD HH:mm:ss'), finished: true, started: false })
			}
		})
	}
	handleStart = () => {
		if (this.timeCounter === null) {
			this.setState({ timestamp: moment().format('YYYY-MM-DD HH:mm:ss'), started: true })
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
			timer: this.props.tcount ? this.props.tcount : 600,
			count: 0,
			timestamp: null,
			started: false,
			finished: false
		})
	}
	handleCount = async () => {
		if (this.noSound)
		{	this.setState({ count: this.state.count + 1 })}
		else {
			await this.mp3File.play().then(
				() => {
					this.setState({ count: this.state.count + 1 })
				}
			)
		}
	}
	handleClose = () => {
		this.setState({ open: false });
	};
	timeFormat = (time) => {
		// Hours, minutes and seconds
		var hrs = ~~(time / 3600);
		var mins = ~~((time % 3600) / 60);
		var secs = time % 60;

		// Output like '1:01' or '4:03:59' or '123:03:59'
		var ret = '';

		if (hrs > 0) {
			ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
		}

		ret += '' + mins + ':' + (secs < 10 ? '0' : '');
		ret += '' + secs;
		return ret;
	}
	handleFinish = () => {
		this.props.handleFinish({
			count: this.props.count,
			timestamp: this.state.timestamp,
			timestampFinish: this.state.timestampFinish,
			timer: this.props.tcount
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
			<Fragment>
				<Button variant='contained' color={'primary'} onClick={this.handleOpen} styles={{ marginTop: 16 }}>
					<OpenInBrowser className={classes.iconButton} /> {t('actions.openCounter')}
				</Button>
				<Modal
					aria-labelledby='simple-modal-title'
					aria-describedby='simple-modal-description'
					open={this.state.open}
					onClose={this.timeCounter ? null : this.handleClose}
				>
					<Grid
						container justify='space-between' className={classes.paper + ' ' + classes.modalWrapper}>
						<ItemGrid xs={12}>

							<Typography variant='h6' id='modal-title' className={classes.text}>
								{this.timeFormat(this.state.timer)}
							</Typography>
						</ItemGrid>
						<ItemGrid xs={12} container justify={'center'}>
							<div className={classes.wrapper}>
								<Button
									color={'primary'}
									variant='fab'
									disableRipple
									classes={{
										root: classes.counterButton
									}}
									onClick={this.handleCount}
									disabled={!started || finished}
								>
									{this.state.count.toString()}
								</Button>
							</div>
						</ItemGrid>
						<ItemGrid xs={12}>
							<div style={{ display: 'flex' }}>

								<ItemGrid>
									<Button
										disabled={started}//change
										color={'primary'}
										variant='contained'
										onClick={this.state.timer === 0 ? this.handleFinish : this.handleStart}>
										{this.state.timer === 0 ? <Fragment>
											<Done className={classes.iconButton} />{t('actions.finish')}
										</Fragment> : <Fragment>
											<Timer className={classes.iconButton} /> {t('actions.start')}
										</Fragment>}
									</Button>
								</ItemGrid>
								<ItemGrid>
									<Button
										color={'primary'}
										variant='contained'
										disabled={this.resetButtonDisabled()}
										onClick={this.handleReset}>
										<Restore className={classes.iconButton} />{t('actions.reset')}
									</Button>
								</ItemGrid>
							</div>
						</ItemGrid>
						{/* <SimpleModalWrapped /> */}
					</Grid>
				</Modal>
			</Fragment>
		);
	}

}

TimeCounterModal.propTypes = {
	classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	tcount: state.settings.tcount
})

const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(countermodalStyles)(TimeCounterModal));