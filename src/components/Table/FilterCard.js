import React, { Component } from 'react'

import { Card, IconButton, CardContent, withStyles, Button, Popover, Typography, CardActions, Checkbox } from '@material-ui/core';
// import Close from '@material-ui/icons/Close';
import withLocalization from 'components/Localization/T';
import { MuiPickersUtilsProvider,  DateTimePicker } from 'material-ui-pickers';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import { Close, DateRange, AccessTime, KeyboardArrowRight, KeyboardArrowLeft } from 'variables/icons';
import {  dateTimeFormatter } from 'variables/functions';
import { TextF, DSelect } from 'components';
import ItemG from 'components/Grid/ItemG';
import moment from 'moment'

const style = theme => ({
	headerText: {
		// background: '#00897b',
		color: 'white',
	},
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
			value: '',
			date: moment(),
			after: false,
			dropdown: {
				value: 0,
				label: ""
			}
			// endDate: moment()
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
		const { value, date, after, dropdown } = this.state
		const { type, handleButton, handleClose, title, t } = this.props
		if (type === 'dropDown')
			handleButton(`${title}: ${dropdown.label}`, dropdown.value, dropdown.icon)
		if (type === 'string')
			handleButton(`${title}: '${value}'`, value)
		if (type === 'date')
			handleButton(`${title} ${after ? t('filters.after') : t('filters.before')}: '${dateTimeFormatter(date)}'`, { date, after })
		this.setState({ value: '', date: moment(), endDate: moment() })
		handleClose()
	}
	handleInput = e => {
		this.setState({
			value: e
		})
	}
	handleCustomDate = (e, key) => {
		// console.log(e)
		// var newDate = shortDateFormat(e)
		this.setState({
			[key]: e
		})
	}
	handleChangeDropDown = (o) => e => {
		const { options } = this.props
		// console.log(options, options.findIndex(o => o.value === e.target.value))
		this.setState({
			[o]: {
				value: e.target.value,
				icon: options[options.findIndex(o => o.value === e.target.value)].icon,
				label: options[options.findIndex(o => o.value === e.target.value)].label
			}
		})
	}
	renderType = () => {
		const { t, classes, title, options } = this.props
		const { startDate, value, after, dropdown } = this.state
		switch (this.props.type) {
			case 'dropDown': 
				return 	<DSelect 
					label={title}
					value={dropdown.value}
					onChange={this.handleChangeDropDown('dropdown')}
					menuItems={
						options.map(o => ({ value: o.value, label: o.label, icon: o.icon } 
						))
					} />
			case 'date':
				return <ItemG container>  
					<ItemG xs={12} container alignItems={'center'}>
						<Checkbox checked={after} onClick={() => this.setState({ after: !after })} />
						<Typography>{t('filters.afterDate')}</Typography>
					</ItemG>
					<ItemG>
						<MuiPickersUtilsProvider utils={MomentUtils}>
							<DateTimePicker
								id={'date'}
								autoOk
								// label={t('filters.startDate')}
								clearable
								ampm={false}
								format='LL'
								value={startDate}
								autoFocus
								onChange={val => this.handleCustomDate(val, 'date')}
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
					</ItemG>
				</ItemG>
			case 'string': 
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
							<Typography className={classes.headerText} variant={'h6'}>{title}</Typography>
						</ItemG>
						<ItemG>
							<IconButton onClick={handleClose}>
								<Close className={classes.headerText}/>
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
