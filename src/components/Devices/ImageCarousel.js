import { Button, MobileStepper, Paper, withStyles } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from 'variables/icons';
import imagecarouselStyles from 'assets/jss/components/image/imagecarouselStyles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Caption from 'components';

const ImageCarousel = props => {
	const [activeStep, setActiveStep] = useState(0)
	// state = {
	// 	activeStep: 0,
	// };

	const handleNext = () => {
		setActiveStep(prevStep => prevStep + 1)
		// this.setState(prevState => ({
		// 	activeStep: prevState.activeStep + 1,
		// }));
	};

	const handleBack = () => {
		setActiveStep(prevStep => prevStep - 1)
		// this.setState(prevState => ({
		// 	activeStep: prevState.activeStep - 1,
		// }));
	};

	const { classes, theme, images, t } = props;

	const maxSteps = images.length;
	let blob = URL.createObjectURL(images[activeStep])
	return (
		<div className={classes.root}>
			{props.label ? <Paper square elevation={0} className={classes.header}>
				<Caption>{props.label}</Caption>
			</Paper> : null}
			<img
				className={classes.img}
				src={blob}
				alt={''}
			/>
			<MobileStepper
				steps={maxSteps}
				position='static'
				activeStep={activeStep}
				className={classes.mobileStepper}
				nextButton={
					<Button size='small' onClick={handleNext} disabled={activeStep === maxSteps - 1}>
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

ImageCarousel.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	images: PropTypes.array.isRequired
};

export default withStyles(imagecarouselStyles, { withTheme: true })(ImageCarousel);