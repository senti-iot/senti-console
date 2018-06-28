import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
// import Paper from '@material-ui/core/Paper';
// import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const styles = theme => ({
	root: {
		flexGrow: 1,
		[theme.breakpoints.up('md')]: {
			maxWidth: 800,
		},
		[theme.breakpoints.down("lg")]: {
			maxWidth: 400
		}
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
		[theme.breakpoints.up('md')]: {
			maxWidth: 800,
			height: 255 * 2
		},
		[theme.breakpoints.down("lg")]: {
			height: 255,
			maxWidth: 400
		},
		overflow: 'hidden',
		width: '100%',
	},
});

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
		const { classes, theme, images } = this.props;
		const { activeStep } = this.state;

		const maxSteps = images.length;
		let blob = URL.createObjectURL(images[activeStep])
		return (
			<div className={classes.root}>
				{/* <Paper square elevation={0} className={classes.header}>
					<Typography>{tutorialSteps[activeStep].label}</Typography>
				</Paper> */}
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

ImageCarousel.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	images: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(ImageCarousel);