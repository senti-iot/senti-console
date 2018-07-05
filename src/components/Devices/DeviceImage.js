import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
// import Paper from '@material-ui/core/Paper';
// import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { Grid } from '@material-ui/core';
import Caption from '../Typography/Caption';
import ExifOrientationImg from 'react-exif-orientation-img'
import SwipeableViews from 'react-swipeable-views';
import classNames from 'classnames'
const styles = theme => ({
	root: {
		flexGrow: 1,
		[theme.breakpoints.up('sm')]: {
			maxWidth: 'auto',
			
		},
		[theme.breakpoints.down("md")]: {
			maxWidth: 400
		},
	},
	header: {
		display: 'flex',
		alignItems: 'center',
		height: 50,
		paddingLeft: theme.spacing.unit * 4,
		marginBottom: 20,
		backgroundColor: theme.palette.background.default,
	},
	img: {
		maxWidth: '100%',
		height: 0,
		transition: "height 300ms ease"
	},
	activeImage: {
		height: "100%",
		[theme.breakpoints.up('sm')]: {
			maxWidth: 'auto',
			// maxHeight: "700"
			// height: 255 * 2,
			// maxHeight: 600
		},
		[theme.breakpoints.down("md")]: {
			height: 255,
			// maxWidth: 400
		},
		overflow: 'hidden',
		width: '100%',
	},
});

class DeviceImage extends React.Component {
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
		const { classes, theme, images } = this.props;
		const { activeStep } = this.state;
		
		const maxSteps = images.length ? images.length : 0;
		// let blob = URL.createObjectURL(images[activeStep])
		return (
			<div className={classes.root}>
				<Grid container justify={'center'} >
					{images.length > 0 ? <SwipeableViews
						axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
						index={this.state.activeStep}
						onChangeIndex={this.handleStepChange}
						enableMouseEvents
					>
						{images.map((step, i) => (
							<div className={classNames(classes.img, {
								[classes.activeImage]: this.state.activeStep === i ? true : false
							})} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
								<ExifOrientationImg key={i} className={classes.activeImage}/*  className={classNames(classes.img, {
									[classes.activeImage]: this.state.activeStep === i ? true : false
								})} */ src={step} alt={'Senti Device'} />
							</div>
						))}
					</SwipeableViews> :
						<Caption>There are no pictures uploaded</Caption>
					}
				</Grid>
				<MobileStepper
					steps={maxSteps}
					position="static"
					activeStep={activeStep}
					className={classes.mobileStepper}
					nextButton={
						<Button size="small" onClick={this.handleNext} disabled={activeStep === maxSteps - 1 || maxSteps === 0}>
							Next
							{theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
						</Button>
					}
					backButton={
						<Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
							{theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
							Back
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
	images: PropTypes.array.isRequired
};

export default withStyles(styles, { withTheme: true })(DeviceImage);