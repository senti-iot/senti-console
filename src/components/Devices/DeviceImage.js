import { Button, MobileStepper } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from 'variables/icons';
// import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState, useEffect, /* useRef */ } from 'react';
// import ExifOrientationImg from 'react-exif-orientation-img';
// import SwipeableViews from 'react-swipeable-views';
// import { Caption } from 'components';
import imagecarouselStyles from 'assets/jss/components/image/imagecarouselStyles';
// import ItemG from 'components/Grid/ItemG';
import { useLocalization } from 'hooks';

const DeviceImage = props => {
	const classes = imagecarouselStyles()
	const t = useLocalization()
	// const swipeHeight = useRef(null)
	const [activeStep, setActiveStep] = useState(0)
	// state = {
	// 	activeStep: 0,
	// };
	const handleCallBack = () => {
		return props.handleStep ? props.handleStep(activeStep) : null
	}

	useEffect(() => {
		handleCallBack()
	})
	const handleNext = () => {
		setActiveStep(prevStep => prevStep + 1)
		// this.setState(prevState => ({
		// 	activeStep: prevState.activeStep + 1,
		// }), this.handleCallBack);
	};

	const handleBack = () => {
		setActiveStep(prevStep => prevStep - 1)
		// this.setState(prevState => ({
		// 	activeStep: prevState.activeStep - 1,
		// }), this.handleCallBack);
	};

	// const handleStepChange = newActiveStep => {
	// 	setActiveStep(newActiveStep)
	// 	// this.setState({ activeStep }, this.handleCallBack);
	// };
	// const getRef = e => {
	// 	swipeHeight.current = e
	// 	// this.swipeHeight = e
	// }
	// const fixHeight = () => {
	// 	if (swipeHeight) {
	// 		swipeHeight.current.updateHeight()
	// 	}
	// }

	const { theme, images } = props;
	// const { activeStep } = this.state;

	const maxSteps = images ? images.length ? images.length : 0 : 0;
	return (
		<div className={classes.root}>
			{/* {images ? <ItemG container justify={'center'} >
				{images.length > 0 ? <SwipeableViews
					axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
					index={activeStep}
					onChangeIndex={handleStepChange}
					enableMouseEvents
					animateHeight={true}
					action={getRef}>
					{images.map((step, i) => {
						let blob = step
						if (typeof step === 'object') { blob = URL.createObjectURL(step) }
						return <ExifOrientationImg className={classNames(classes.deviceImg, {
							[classes.activeImage]: activeStep === i ? false : true
						})} src={blob} alt={'Senti Device'} onLoad={fixHeight} />
					})}
				</SwipeableViews> :
					<Caption>{t('devices.noImages')}</Caption>
				}
			</ItemG> : null} */}
			<MobileStepper
				steps={maxSteps}
				position='static'
				activeStep={activeStep}
				className={classes.mobileStepper}
				nextButton={
					<Button size='small' onClick={handleNext} disabled={activeStep === maxSteps - 1 || maxSteps === 0}>
						{t('actions.next')}
						{theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
					</Button>
				}
				backButton={
					<Button size='small' onClick={handleBack} disabled={activeStep === 0}>
						{theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
						{t('actions.back')}
					</Button>
				}
			/>
		</div>
	);
}

DeviceImage.propTypes = {
	// classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	images: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.number,
	]).isRequired,
};

export default DeviceImage