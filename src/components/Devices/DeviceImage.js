import { Button, Grid, MobileStepper, withStyles } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from 'variables/icons';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ExifOrientationImg from 'react-exif-orientation-img';
import SwipeableViews from 'react-swipeable-views';
import { Caption, ItemGrid } from 'components';
import imagecarouselStyles from 'assets/jss/components/image/imagecarouselStyles';

class DeviceImage extends React.Component {
	state = {
		activeStep: 0,
	};
	handleCallBack = () => {
		return this.props.handleStep ? this.props.handleStep(this.state.activeStep) : null
	}
	handleNext = () => {
		this.setState(prevState => ({
			activeStep: prevState.activeStep + 1,
		}), this.handleCallBack);
	};

	handleBack = () => {
		this.setState(prevState => ({
			activeStep: prevState.activeStep - 1,
		}), this.handleCallBack);
	};

	handleStepChange = activeStep => {
		this.setState({ activeStep }, this.handleCallBack);
	};
	getRef = e => {
		this.swipeHeight = e
	}
	fixHeight = () => {
		this.swipeHeight.updateHeight()
		if (this.swipeHeight)
			this.swipeHeight.updateHeight()
	}
	render() {
		const { classes, theme, images, t } = this.props;
		const { activeStep } = this.state;
		
		const maxSteps = images ? images.length ? images.length : 0 : 0;
		// let blob = URL.createObjectURL(images[activeStep])
		return (
			<div className={classes.root}>
				{images ? <Grid container justify={'center'} >
					{images.length > 0 ? <SwipeableViews
						axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
						index={this.state.activeStep}
						onChangeIndex={this.handleStepChange}
						enableMouseEvents
						animateHeight={true}
						action={this.getRef}>
						{images.map((step, i) => {
							let blob = step
							if (typeof step === 'object') { blob = URL.createObjectURL(step) }
							return <ItemGrid key={i} zeroMargin noPadding container justify={'center'}>
								<ExifOrientationImg className={classNames(classes.deviceImg, {
									[classes.activeImage]: this.state.activeStep === i ? false : true
								})} src={blob} alt={'Senti Device'} onLoad={this.fixHeight} />
							</ItemGrid>
						})}
					</SwipeableViews> :
						<Caption>{t("devices.noImages")}</Caption>
					}
				</Grid> : null}
				<MobileStepper
					steps={maxSteps}
					position="static"
					activeStep={activeStep}
					className={classes.mobileStepper}
					nextButton={
						<Button size="small" onClick={this.handleNext} disabled={activeStep === maxSteps - 1 || maxSteps === 0}>
							{t("actions.next")}
							{theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
						</Button>
					}
					backButton={
						<Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
							{theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
							{t("actions.back")}
						</Button>
					}
				/>
			</div>
		);
	}
}

DeviceImage.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	images: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.number,
	]).isRequired,
};

export default withStyles(imagecarouselStyles, { withTheme: true })(DeviceImage);