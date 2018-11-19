import React, { Component } from 'react'
import { Card, CardHeader, IconButton, CardContent, withStyles, Button, Popover, Grid, TextField } from '@material-ui/core';
// import Close from '@material-ui/icons/Close';
import withLocalization from 'components/Localization/T';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import { Close, DateRange, AccessTime, KeyboardArrowRight, KeyboardArrowLeft } from 'variables/icons';
import { shortDateFormat } from 'variables/functions';

const style = theme => ({
	header: {
		background: '#00897b',
		color: 'white'
	},
	menu: {
		width: 240,
		padding: 0,
		background: '#00897b'
	},
	content: {
		maxWidth: 240
	}
})
class FilterCard extends Component {
	constructor(props) {
		super(props)

		this.state = {
			value: ''
		}
	}
	handleKeyPress = (key) => {
		if (this.props.open)
			switch (key.key) {
				case 'Enter':
					this.handleButton()
					break;

				default:
					break;
			}
	}
	handleButton = () => {
		this.props.handleButton(`${this.props.title}: '${this.state.value}'`)
		this.props.handleClose()
	}
	handleInput = e => {
		this.setState({
			value: e
		})
	}
	handleCustomDate = e => {
		var newDate = shortDateFormat(e)
		this.setState({
			value: newDate
		})
	}

	renderType = () => {
		const { t, classes } = this.props
		const { value } = this.state
		switch (this.props.type) {
			case 'date':
				return <MuiPickersUtilsProvider utils={MomentUtils}>
					<DatePicker
						autoOk
						label={t('filters.startDate')}
						clearable
						ampm={false}
						format='LL'
						value={value}
						onChange={this.handleCustomDate}
						animateYearScrolling={false}
						color='primary'
						// disableFuture
						dateRangeIcon={<DateRange />}
						timeIcon={<AccessTime />}
						rightArrowIcon={<KeyboardArrowRight />}
						leftArrowIcon={<KeyboardArrowLeft />}
						InputLabelProps={{ FormLabelClasses: { root: classes.label, focused: classes.focused } }}
						InputProps={{ classes: { underline: classes.underline } }}
					/>
				</MuiPickersUtilsProvider>
			case 'text': 
				return <TextField label={'Contains'} value={value} onChange={e => this.handleInput(e.target.value)} onKeyPress={this.handleKeyPress} />
			default:
				break;
		}
	}
	render() {
		const { title, open, handleClose, classes, anchorEl } = this.props
		// const { value } = this.state
		return (
			<Popover
				anchorEl={anchorEl}
				open={open ? open : false}
				onClose={handleClose}
				PaperProps={{ classes: { root: classes.menu } }}
			>
				<Card>
					<CardHeader
						classes={{
							root: classes.header,
							title: classes.header
						}}
						title={title}
						action={<IconButton onClick={handleClose}>
							<Close />
						</IconButton>}
					/>
					<CardContent className={classes.content}>
						<Grid container justify={'center'} zeroMinWidth>
							<Grid item>
								{this.renderType()}
								{/* {content ? content : <TextField label={'Contains'} value={value} onChange={this.handleInput} onKeyPress={this.handleKeyPress} />} */}
							</Grid>
							<Grid item xs={12} container justify={'center'}>
								<Button onClick={this.handleButton}>
									Add Filter
								</Button>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</Popover>
		)
	}
}

export default withLocalization()(withStyles(style)(FilterCard))
