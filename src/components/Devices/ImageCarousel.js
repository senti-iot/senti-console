import { Button, MobileStepper, Paper, withStyles } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from 'variables/icons';
import imagecarouselStyles from 'assets/jss/components/image/imagecarouselStyles';
import PropTypes from 'prop-types';
import React from 'react';
import Caption from '..';

class ImageCarousel extends React.Component {
	state = {
		activeStep: 0,
	};

	handleNext = () => {
		this.setState(prevState => ({
			activeStep: prevState.activeStep + 1,
		}));
	};

	handleBack = () => {
		this.setState(prevState => ({
			activeStep: prevState.activeStep - 1,
		}));
	};

	render() {
		const { classes, theme, images, t } = this.props;
		const { activeStep } = this.state;

		const maxSteps = images.length;
		let blob = URL.createObjectURL(images[activeStep])
		return (
			<div className={classes.root}>
				{this.props.label ? <Paper square elevation={0} className={classes.header}>
					<Caption>{this.props.label}</Caption>
				</Paper> : null}
				<img
					className={classes.img}
					src={blob}
					alt={''}
				/>
				<MobileStepper
					steps={maxSteps}
					position="static"
					activeStep={activeStep}
					className={classes.mobileStepper}
					nextButton={
						<Button size="small" onClick={this.handleNext} disabled={activeStep === maxSteps - 1}>
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

ImageCarousel.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	images: PropTypes.array.isRequired
};

export default withStyles(imagecarouselStyles, { withTheme: true })(ImageCarousel);