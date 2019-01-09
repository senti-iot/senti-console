import React, { Component } from 'react'

import { Card, IconButton, CardContent, withStyles, Button, Popover, Typography, CardActions } from '@material-ui/core';
// import Close from '@material-ui/icons/Close';
import withLocalization from 'components/Localization/T';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import { Close, DateRange, AccessTime, KeyboardArrowRight, KeyboardArrowLeft } from 'variables/icons';
import { shortDateFormat } from 'variables/functions';
import { TextF } from 'components';
import ItemG from 'components/Grid/ItemG';

const style = theme => ({
	header: {
		background: '#00897b',
		color: 'white',
		padding: 8
	},
	menu: {
		// width: 240,
		padding: 0,
		background: '#00897b'
	},
	content: {
		// maxWidth: 240,
		height: '100%'
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
		this.props.handleButton(`${this.props.title}: '${this.state.value}'`, this.state.value)
		this.setState({ value: '' })
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
						autoFocus
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
				return <TextF id={'filter-text'} autoFocus label={'Contains'} value={value} handleChange={e => this.handleInput(e.target.value)} onKeyPress={this.handleKeyPress} />
			default:
				break;
		}
	}
	render() {
		const { title, open, handleClose, classes, anchorEl, t } = this.props
		// const { value } = this.state
		return (
			<Popover
				anchorEl={anchorEl}
				open={open ? open : false}
				onClose={handleClose}
				PaperProps={{ classes: { root: classes.menu } }}
			>
				<Card>
					<ItemG container alignItems={'center'} className={classes.header}>
						<ItemG xs>
							<Typography variant={'h6'}>{title}</Typography>
						</ItemG>
						<ItemG>
							<IconButton onClick={handleClose}>
								<Close />
							</IconButton>
						</ItemG>
					</ItemG>
					<CardContent className={classes.content}>
						<ItemG container justify={'center'}>
							<ItemG xs={12}>
								{this.renderType()}
							</ItemG>
						</ItemG>
					</CardContent>
					<CardActions>
						<ItemG xs={12} container justify={'center'}>
							<Button onClick={this.handleButton}>
								{t('actions.addFilter')}
							</Button>
						</ItemG>
					</CardActions>
				</Card>
			</Popover>
		)
	}
}

export default withLocalization()(withStyles(style)(FilterCard))
