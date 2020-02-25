/* eslint-disable indent */
import { Grid, Button, Modal, Typography, Fab, } from '@material-ui/core';
import React, { Fragment, useState, useEffect, useRef } from 'react';
// import PropTypes from 'prop-types';
import { ItemGrid } from 'components';
import moment from 'moment'
import { OpenInBrowser, Timer, Done, Restore } from 'variables/icons'
import countermodalStyles from 'assets/jss/components/devices/countermodalStyles';
import { useSelector } from 'react-redux'
import { useLocalization } from 'hooks';

// const mapStateToProps = (state) => ({
// 	count: state.settings.count
// })
/**
 * Deprecation - Unused
 */

const CounterModal = props => {
	const classes = countermodalStyles()
	const t = useLocalization()
	const count = useSelector(state => state.settings.count)

	const [stateCount, setStateCount] = useState(count)
	const [open, setOpen] = useState(false)
	const [timer, setTimer] = useState(0)
	const [timestamp, setTimestamp] = useState(null)
	const [timestampFinish, setTimestampFinish] = useState(null)
	const [started, setStarted] = useState(false)
	const [finished, setFinished] = useState(false)

	let noSound
	let mp3File
	let timeCounter = useRef(null)
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		count: props.count,
	// 		open: false,
	// 		timer: 0,
	// 		timestamp: null,
	// 		timestampFinish: null,
	// 		started: false,
	// 		finished: false
	// 	}
	let canPlayMP3 = new Audio().canPlayType('audio/mp3');
	if (!canPlayMP3 || canPlayMP3 === 'no') {
		let msg = t('no.audioSupported')
		noSound = true
		alert(msg);
	}
	mp3File = new Audio('/assets/sound/pop.mp3')
	timeCounter.current = null

	useEffect(() => {
		setStateCount(count)

		if (stateCount === 0) {
			clearInterval(timeCounter)
			timeCounter.current = null
			setTimestampFinish(moment().format('YYYY-MM-DD HH:mm:ss'))
			setFinished(true)
		}
	}, [count, stateCount])
	// componentDidUpdate = (prevProps, prevState) => {
	// 	if (prevProps.count !== this.props.count)
	// 	  this.setState({
	// 		  count: this.props.count
	// 	  })
	// }

	const timerFunc = () => {
		setTimer(timer + 1)
		// this.setState({ timer: this.state.timer + 1 }, () => {
		// 	if (this.state.count === 0) {
		// 		clearInterval(this.timeCounter)
		// 		this.timeCounter = null
		// 		this.setState({ timestampFinish: moment().format('YYYY-MM-DD HH:mm:ss'), finished: true })
		// 	}
		// })
	}
	const handleStart = () => {
		if (timeCounter.current === null) {
			setTimestamp(moment().format('YYYY-MM-DD HH:mm:ss'))
			setStarted(true)
			// this.setState({ timestamp: moment().format('YYYY-MM-DD HH:mm:ss'), started: true })
			timeCounter.current = setInterval(() => timerFunc(), 1000)
		}
	}

	const handleOpen = () => {
		setOpen(true)
		// this.setState({ open: true });
	};
	const handleReset = () => {
		clearInterval(timeCounter.current)
		timeCounter.current = null
		setTimer(0)
		setStateCount(count)
		setTimestamp(null)
		setStarted(false)
		setFinished(false)
		// this.setState({
		// 	timer: 0,
		// 	count: this.props.count,
		// 	timestamp: null,
		// 	started: false,
		// 	finished: false
		// })
	}
	const handleCount = async () => {
		if (noSound) {
			if (stateCount === 1) {
				setStateCount(stateCount - 1)
				setFinished(true)
				setStarted(false)
			}
			// this.setState({ count: this.state.count - 1, finished: true, started: false })
			else {
				setStateCount(stateCount - 1)
				// this.setState({ count: this.state.count - 1 })
			}
		}
		else {
			await mp3File.play().then(
				() => {
					if (stateCount === 1) {
						setStateCount(stateCount - 1)
						setFinished(true)
						setStarted(false)
						// this.setState({ count: this.state.count - 1, finished: true, started: false })
					} else {
						setStateCount(stateCount - 1)
						// this.setState({ count: this.state.count - 1 })
					}
				}

			)
		}
	}
	const handleClose = () => {
		setOpen(false)
		// this.setState({ open: false });
	};
	const fancyTimeFormat = (time) => {
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
			timer
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

	// const { classes } = props;
	// const { started, finished } = this.state
	return (
		<Fragment>
			<Button variant={'outlined'} color={'primary'} onClick={handleOpen} style={{ marginTop: 16, marginLeft: 8 }}>
				<OpenInBrowser className={classes.iconButton} /> {t('actions.openCounter')}
			</Button>
			<Modal
				aria-labelledby='simple-modal-title'
				aria-describedby='simple-modal-description'
				open={open}
				onClose={timeCounter ? null : handleClose}
			>
				<Grid
					container justify='space-between' className={classes.paper + ' ' + classes.modalWrapper}>
					<ItemGrid xs={12}>

						<Typography variant='h6' id='modal-title' className={classes.text}>
							{fancyTimeFormat(timer)}
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
								{stateCount.toString()}
							</Fab>
						</div>
					</ItemGrid>
					<ItemGrid xs={12}>
						<div style={{ display: 'flex' }}>

							<ItemGrid>
								<Button
									disabled={started}
									color={'primary'}
									variant='outlined'
									onClick={stateCount === 0 ? handleFinish : handleStart}>
									{stateCount === 0 ? <Fragment>
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
				</Grid>
			</Modal>
		</Fragment>
	);
}

// CounterModal.propTypes = {
// 	classes: PropTypes.object.isRequired,
// };

export default CounterModal