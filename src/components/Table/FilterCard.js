import React, { Component, Fragment } from 'react'

import { Card, IconButton, CardContent, withStyles, Button, Popover, Typography, CardActions, Checkbox } from '@material-ui/core';
// import Close from '@material-ui/icons/Close';
import withLocalization from 'components/Localization/T';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import { Close, DateRange, AccessTime, KeyboardArrowRight, KeyboardArrowLeft } from 'variables/icons';
import { dateTimeFormatter } from 'variables/functions';
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
			diff: {
				value: 0,
				label: ""
			},
			dropdown: {
				value: 0,
				label: ""
			}
			// endDate: moment()
		}
	}
	componentDidMount = () => {
		window.addEventListener('keypress', this.handleKeyPress, false)

	}
	componentWillUnmount = () => {
	  window.removeEventListener('keypress', this.handleKeyPress, false)
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
		const { value, date, after, dropdown, diff } = this.state
		const { type, handleButton, handleClose, title, t, options } = this.props
		if (type === 'dropDown')
			handleButton(`${title}: ${dropdown.label}`, dropdown.value, dropdown.icon)
		if (type === 'string')
			handleButton(`${title}: '${value}'`, value)
		if (type === 'date')
			handleButton(`${title} ${after ? t('filters.after') : t('filters.before')}: '${dateTimeFormatter(date)}'`, { date, after })
		if (type === 'diff')
			handleButton(`${title}: ${diff.label}`, { diff: diff.value, values: options.values })
		this.setState({
			value: '',
			date: moment(),
			endDate: moment(),
			diff: {
				value: 0,
				label: ""
			},
			dropdown: {
				value: 0,
				label: ""
			}
		})
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
	handleChangeDiff = e => {
		const { options } = this.props
		this.setState({
			diff: {
				value: e.target.value,
				icon: options.dropdown[options.dropdown.findIndex(o => o.value === e.target.value)].icon,
				label: options.dropdown[options.dropdown.findIndex(o => o.value === e.target.value)].label
			}
		})
	}
	renderType = () => {
		const { t, classes, title, options } = this.props
		const { date, value, after, dropdown, diff } = this.state
		switch (this.props.type) {
			case 'diff':
				return <DSelect
					label={title}
					value={diff.value}
					onChange={this.handleChangeDiff}
					menuItems={
						options.dropdown.map(o => ({ value: o.value, label: o.label, icon: o.icon }))
					} />
			case 'dropDown':
				return <DSelect
					label={title}
					value={dropdown.value}
					onChange={this.handleChangeDropDown('dropdown')}
					menuItems={
						options.map(o => ({ value: o.value, label: o.label, icon: o.icon }
						))
					} />
			case 'date':
				return <Fragment>
					<ItemG xs={12} container alignItems={'center'}>
						<Checkbox checked={after} onClick={() => this.setState({ after: !after })} style={{ padding: "12px 12px 12px 0px" }} />
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
								value={date}
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
				</Fragment>
			case 'string':
				return <TextF id={'filter-text'} autoFocus label={t('filters.contains')} value={value} handleChange={e => this.handleInput(e.target.value)} />
			default:
				break;
		}
	}
	render() {
		const { title, open, handleClose, classes, anchorEl, t } = this.props
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
								<Close className={classes.headerText} />
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
