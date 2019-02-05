import React, { Component, Fragment } from 'react'

import { Card, IconButton, CardContent, withStyles, Button, Popover, Typography, CardActions, Checkbox } from '@material-ui/core';
import withLocalization from 'components/Localization/T';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import { Close, DateRange, AccessTime, KeyboardArrowRight, KeyboardArrowLeft } from 'variables/icons';
import { dateTimeFormatter } from 'variables/functions';
import { TextF, DSelect } from 'components';
import ItemG from 'components/Grid/ItemG';
import moment from 'moment'
import cx from 'classnames'

const style = theme => ({
	error: {
		animation: "shake 0.82s cubic-bezier(.36,.07,.19,.97) both",
		transform: "translate3d(0, 0, 0)",
		backfaceVisibility: "hidden",
		perspective: 1000,
	},
	"@keyframes shake": {
		"10%, 90%": {
			transform: "translate3d(-1px, 0, 0)",
		},

		"20%, 80%": {
			transform: "translate3d(2px, 0, 0)",
		},

		"30%, 50%, 70%": {
			transform: "translate3d(-4px, 0, 0)",
		},

		"40%, 60%": {
			transform: "translate3d(4px, 0, 0)",
		}
	},

	headerText: {
		color: 'white',
	},
	header: {
		background: '#00897b',
		color: 'white',
		padding: 8
	},
	menu: {
		padding: 0,
		background: '#00897b'
	},
	content: {
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
				icon: '',
				label: ''
			},
			dropdown: {
				value: 0,
				icon: '',
				label: ''
			}
		}
	}
	componentDidUpdate = (prevProps, prevState) => {
		const { type, options } = this.props
		if (this.props.open && prevProps.open !== this.props.open) {
			let obj = null
			if (type === 'diff') {
				obj = options.dropdown[options.dropdown.findIndex(d => d.value === 0 || d.value === false)]
			}
			if (type === 'dropdown') { 
				obj = options[options.findIndex(d => d.value === 0 || d.value === false)]
			}
			this.setState({
				diff: {
					value: 0,
					icon: type === 'diff' ? obj ? obj.icon ? obj.icon : null : null : null, 
					label: type === 'diff' ? obj ? obj.label ? obj.label : null : null : null
				},
				dropdown: {
					value: 0,
					icon: type === 'dropDown' ? obj ? obj.icon ? obj.icon : null : null : null,
					label: type === 'dropDown' ? obj ? obj.label ? obj.label : null : null : null
				}
			})
		}
	}

	componentDidMount = (prevProps, prevState) => {
		const { edit, type, value } = this.props
		if (edit)
			switch (type) {
				case 'dropDown':
					this.setState({
						dropdown: {
							value: value
						}
					})
					break;
				case 'diff':
					this.setState({
						diff: { value: value }
					})
					break;
				case 'date':
					this.setState({
						date: moment(value)
					})
					break;
				case 'string':
				case undefined:
				case '':
				case null:
					this.setState({
						value: value,
					})
					break;
				default:
					break;
			}
	}

	handleKeyDown = (key) => {
		if (this.props.open)
			switch (key.keyCode) {
				case 13:
					this.handleButton()
					break;

				default:
					break;
			}
	}
	handleKeyPress = (key) => {
		if (this.props.open)
			switch (key.keyCode) {
				case 13:
					this.handleButton()
					break;

				default:
					break;
			}
	}
	handleButton = () => {
		const { value, date, after, dropdown, diff } = this.state
		const { type, handleButton, title, t, options } = this.props
		if (type === 'dropDown') {
			handleButton(`${title}: ${dropdown.label}`, dropdown.value, dropdown.icon)
		}
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
	}
	handleInput = e => {
		this.setState({
			value: e,
		}, () => this.props.error ? this.props.resetError() : {})
	}
	handleCustomDate = (e, key) => {
		this.setState({
			[key]: e
		})
	}
	handleChangeDropDown = (o) => e => {
		const { options } = this.props
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
					onKeyDown={this.handleKeyDown}
					menuItems={
						options.dropdown.map(o => ({ value: o.value, label: o.label, icon: o.icon }))
					} />
			case 'dropDown':
				return <DSelect
					label={title}
					value={dropdown.value}
					onKeyDown={this.handleKeyDown}
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
								clearable
								ampm={false}
								format='LL'
								value={date}
								autoFocus
								onChange={val => this.handleCustomDate(val, 'date')}
								animateYearScrolling={false}
								color='primary'
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
				return <TextF id={'filter-text'} autoFocus onKeyDown={this.handleKeyDown} label={t('filters.contains')} value={value} handleChange={e => this.handleInput(e.target.value)} />
			default:
				break;
		}
	}
	render() {
		const { title, open, handleClose, classes, anchorEl, t, edit, error } = this.props
		const errorClassname = cx({
			[classes.error]: error
		})
		return (
			<Popover
				anchorEl={anchorEl}
				open={open ? open : false}
				onClose={handleClose}
				PaperProps={{ classes: { root: classes.menu } }}
			>
				<Card classes={{ root: errorClassname }}>
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
							<Button onClick={this.handleButton} onKeyPress={this.handleKeyPress}>
								{!edit ? t('actions.addFilter') : t('actions.editFilter')}
							</Button>
						</ItemG>
					</CardActions>
				</Card>
			</Popover>
		)
	}
}

export default withLocalization()(withStyles(style)(FilterCard))
