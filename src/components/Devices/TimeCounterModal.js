/* eslint-disable indent */
import { Grid, Button, Modal, withStyles, Typography, Fab, } from '@material-ui/core';
import React, { Fragment, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { ItemGrid } from 'components';
import moment from 'moment'
import { OpenInBrowser, Timer, Done, Restore } from 'variables/icons'
import countermodalStyles from 'assets/jss/components/devices/countermodalStyles';
import { useSelector } from 'react-redux'
import { useLocalization } from 'hooks';

// const mapStateToProps = (state) => ({
// 	tcount: state.settings.tcount
// })
/**
 * Unused
 */

const TimeCounterModal = props => {
	const t = useLocalization()
	const timeCounter = useRef(null)
	const tcount = useSelector(state => state.settings.tcount)
	let noSound
	let mp3File

	const [count, setCount] = useState(0)
	const [open, setOpen] = useState(false)
	const [timer, setTimer] = useState(tcount ? tcount : 600)
	const [timestamp, setTimestamp] = useState(null)
	const [timestampFinish, setTimestampFinish] = useState(null)
	const [started, setStarted] = useState(false)
	const [finished, setFinished] = useState(false)

	let canPlayMP3 = new Audio().canPlayType('audio/mp3');
	if (!canPlayMP3 || canPlayMP3 === 'no') {
		let msg = t('no.audioSupported')
		alert(msg);
		noSound = true
	}
	mp3File = new Audio('/assets/sound/pop.mp3')
	timeCounter.current = null

	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		count: 0,
	// 		open: false,
	// 		timer: props.tcount ? props.tcount : 600,
	// 		timestamp: null,
	// 		timestampFinish: null,
	// 		started: false,
	// 		finished: false
	// 	}
	// 	let canPlayMP3 = new Audio().canPlayType('audio/mp3');
	// 	if (!canPlayMP3 || canPlayMP3 === 'no') {
	// 		let msg = props.t('no.audioSupported')
	// 		alert(msg);
	// 		this.noSound = true
	// 	}
	// 	this.mp3File = new Audio('/assets/sound/pop.mp3')
	// 	this.timeCounter = null
	// }

	useEffect(() => {
		setTimer(tcount)

		if (timer === 0) {
			clearInterval(timeCounter.current)
			timeCounter.current = null
			setTimestampFinish(moment().format('YYYY-MM-DD HH:mm:ss'))
			setFinished(true)
			setStarted(false)
		}
	}, [tcount, timer])
	// componentDidUpdate = (prevProps, prevState) => {
	// 	if (prevProps.tcount !== this.props.tcount)
	// 		this.setState({
	// 			timer: this.props.tcount
	// 		})
	// }
	const timerFunc = () => {
		setTimer(timer - 1)
		// this.setState({ timer: this.state.timer - 1 }, () => {
		// 	if (this.state.timer === 0) {
		// 		clearInterval(this.timeCounter)
		// 		this.timeCounter = null
		// 		this.setState({ timestampFinish: moment().format('YYYY-MM-DD HH:mm:ss'), finished: true, started: false })
		// 	}
		// })
	}
	const handleStart = () => {
		if (timeCounter.current === null) {
			setTimestamp(moment().format('YYYY-MM-DD HH:mm:ss'))
			setStarted(true)
			// this.setState({ timestamp: moment().format('YYYY-MM-DD HH:mm:ss'), started: true })
			timeCounter.current = setInterval(() => timerFunc(), 1000)
			// this.timeCounter = setInterval(() => this.timer(), 1000)
		}
	}

	const handleOpen = () => {
		setOpen(true)
		// this.setState({ open: true });
	};
	const handleReset = () => {
		clearInterval(timeCounter.current)
		timeCounter.current = null
		setTimer(tcount ? tcount : 600)
		setCount(0)
		setTimestamp(null)
		setStarted(false)
		setFinished(false)
		// this.setState({
		// 	timer: this.props.tcount ? this.props.tcount : 600,
		// 	count: 0,
		// 	timestamp: null,
		// 	started: false,
		// 	finished: false
		// })
	}
	const handleCount = async () => {
		if (noSound) {
			setCount(count + 1)
		} else {
			await mp3File.play().then(() => setCount(count + 1))
		}
		// {	this.setState({ count: this.state.count + 1 })}
		// else {
		// 	await this.mp3File.play().then(
		// 		() => {
		// 			this.setState({ count: this.state.count + 1 })
		// 		}
		// 	)
		// }
	}
	const handleClose = () => {
		setOpen(false)
		// this.setState({ open: false });
	};
	const timeFormat = (time) => {
		var hrs = ~~(time / 3600);
		var mins = ~~((time % 3600) / 60);
		var secs = time % 60;
		var ret = '';

		if (hrs > 0) {
			ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
		}

		ret += '' + mins + ':' + (secs < 10 ? '0' : '');
		ret += '' + secs;
		return ret;
	}
	const handleFinish = () => {
		props.handleFinish({
			count,
			timestamp,
			timestampFinish,
			tcount
		})
		handleReset()
		handleClose()
	}
	const resetButtonDisabled = () => {
		// const { started, finished } = this.state
		if (started)
			return false
		if (finished)
			return false
		return true
	}

	const { classes } = props;
	// const { started, finished } = this.state
	return (
		<Fragment>
			<Button variant='outlined' color={'primary'} onClick={handleOpen} style={{ marginLeft: 8, marginTop: 16 }}>
				<OpenInBrowser className={classes.iconButton} /> {t('actions.openCounter')}
			</Button>
			<Modal
				aria-labelledby='simple-modal-title'
				aria-describedby='simple-modal-description'
				open={open}
				onClose={timeCounter.current ? null : handleClose}
			>
				<Grid
					container justify='space-between' className={classes.paper + ' ' + classes.modalWrapper}>
					<ItemGrid xs={12}>

						<Typography variant='h6' id='modal-title' className={classes.text}>
							{timeFormat(timer)}
						</Typography>
					</ItemGrid>
					<ItemGrid xs={12} container justify={'center'}>
						<div className={classes.wrapper}>
							<Fab
								color={'primary'}
								disableRipple
								classes={{
									root: classes.counterButton
								}}
								onClick={handleCount}
								disabled={!started || finished}
							>
								{count.toString()}
							</Fab>
						</div>
					</ItemGrid>
					<ItemGrid xs={12}>
						<div style={{ display: 'flex' }}>

							<ItemGrid>
								<Button
									disabled={started}//change
									color={'primary'}
									variant='outlined'
									onClick={timer === 0 ? handleFinish : handleStart}>
									{timer === 0 ? <Fragment>
										<Done className={classes.iconButton} />{t('actions.finish')}
									</Fragment> : <Fragment>
											<Timer className={classes.iconButton} /> {t('actions.start')}
										</Fragment>}
								</Button>
							</ItemGrid>
							<ItemGrid>
								<Button
									color={'primary'}
									variant='outlined'
									disabled={resetButtonDisabled()}
									onClick={handleReset}>
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

TimeCounterModal.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(countermodalStyles)(TimeCounterModal)