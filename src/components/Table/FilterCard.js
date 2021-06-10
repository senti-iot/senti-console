import React, { Fragment, useState } from 'react'

import { Card, IconButton, CardContent, Button, Popover, Typography, CardActions, Checkbox, makeStyles } from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import { Close, DateRange, AccessTime, KeyboardArrowRight, KeyboardArrowLeft } from 'variables/icons';
import { dateTimeFormatter } from 'variables/functions';
import { TextF, DSelect } from 'components';
import ItemG from 'components/Grid/ItemG';
import moment from 'moment'
import cx from 'classnames'
import { useLocalization, usePrevious } from 'hooks'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

const styles = makeStyles(theme => ({
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
}))
const FilterCard = (props) => {
	const [value, setValue] = useState()
	const [filterType, setFilterType] = useState('AND')
	const [date, setDate] = useState(moment())
	const [after, setAfter] = useState(false)
	const [diff, setDiff] = useState({ value: -1, icon: '', label: '' })
	const [dropdown, setDropdown] = useState({ value: -1, icon: '', label: '' })
	const { open, type, options, edit, pValue, pFilterType, handleButton, title, hidden, error, resetError, handleClose, anchorEl } = props
	const t = useLocalization()
	const prevOpen = usePrevious(open)
	const color = useSelector(s => s.settings.colorTheme)
	const classes = styles({ color })

	useEffect(() => {
		if (open && prevOpen !== open) {
			let obj = null
			if (type === 'diff') {
				obj = options.dropdown[options.dropdown.findIndex(d => d.value === 0 || d.value === false)]
				if (obj)
					setDiff({
						value: obj.value !== undefined || null ? obj.value : null,
						icon: obj.icon ? obj.icon : null,
						label: obj.label ? obj.label : null
					})
				else {
					setDiff({
						value: -1,
						icon: '',
						label: ''
					})
				}
			}
			if (type === 'dropDown') {
				obj = options[options.findIndex(d => d.value === 0 || d.value === false)]
				if (obj)
					setDropdown({
						value: obj.value !== undefined || null ? obj.value : null,
						icon: obj.icon ? obj.icon : null,
						label: obj.label ? obj.label : null
					})
				else {
					setDropdown({
						value: -1,
						icon: '',
						label: ''
					})
				}
			}

		}
	}, [open, options, prevOpen, type])

	useEffect(() => {
		if (edit) {
			switch (type) {
				case 'dropDown':
					setDropdown({ value: pValue })
					break
				case 'diff':
					setDiff({ value: pValue })
					break
				case 'date':
					setDate({ date: moment(pValue.date, 'lll') })
					setAfter(pValue.after)
					break
				case 'string':
				case undefined:
				case '':
				case null:
					setValue(pValue)
					setFilterType(pFilterType)
					break
				default:
					break
			}
		}
	}, [edit, pFilterType, pValue, type])

	const handleKeyDown = (key) => {
		if (open)
			switch (key.keyCode) {
				case 13:
					_handleButton()
					break
				default:
					break
			}
	}
	const handleKeyPress = (key) => {
		if (open)
			switch (key.keyCode) {
				case 13:
					_handleButton()
					break

				default:
					break
			}
	}
	const _handleButton = () => {
		if (type === 'dropDown') {
			handleButton(`${title}: ${dropdown.label}`, dropdown.value, dropdown.icon, filterType)
		}
		if (type === 'string') {
			if (hidden) {
				handleButton(`${value}`, value, null, filterType)
			}
			else {
				handleButton(`${title}: '${value}'`, value, null, filterType)
			}
		}
		if (type === 'date')
			handleButton(`${title} ${after ? t('filters.after') : t('filters.before')}: '${dateTimeFormatter(date)}'`, { date, after }, filterType)
		if (type === 'diff')
			handleButton(`${title}: ${diff.label}`, { diff: diff.value, values: options.values }, null, filterType)

		setValue('')
		setDate(moment())
		setDiff({ value: -1, label: '', icon: '' })
		setDropdown({ value: -1, label: '', icon: '' })
		// this.setState({
		// 	value: '',
		// 	date: moment(),
		// 	endDate: moment(),
		// 	diff: {
		// 		value: 0,
		// 		label: ""
		// 	},
		// 	dropdown: {
		// 		value: 0,
		// 		label: ""
		// 	}
		// })
	}
	const handleInput = e => {
		setValue(e.target.value)
		if (error) {
			resetError()
		}
		// this.setState({
		// 	value: e,
		// }, () => this.props.error ? this.props.resetError() : {})
	}
	const handleCustomDate = (e) => {

		setDate(e)

		// this.setState({
		// 	[key]: e
		// })
	}
	const handleChangeDropDown = e => {
		setDropdown({
			value: e.target.value,
			icon: options[options.findIndex(o => o.value === e.target.value)].icon,
			label: options[options.findIndex(o => o.value === e.target.value)].label
		})
	}
	const handleChangeDiff = e => {
		setDiff({
			value: e.target.value,
			icon: options.dropdown[options.dropdown.findIndex(o => o.value === e.target.value)].icon,
			label: options.dropdown[options.dropdown.findIndex(o => o.value === e.target.value)].label
		})
	}
	const renderType = () => {
		// const { t, classes, title, options } = this.props
		// const { date, value, after, dropdown, diff } = this.state
		switch (type) {
			case 'diff':
				return <DSelect
					fullWidth
					label={title}
					value={diff.value}
					onChange={handleChangeDiff}
					onKeyDown={handleKeyDown}
					menuItems={
						options.dropdown.map(o => ({ value: o.value, label: o.label, icon: o.icon }))
					} />
			case 'dropDown':
				return <DSelect
					fullWidth
					label={title}
					value={dropdown.value}
					onKeyDown={handleKeyDown}
					onChange={handleChangeDropDown}
					menuItems={
						options.map(o => ({ value: o.value, label: o.label, icon: o.icon }
						))
					} />
			case 'date':
				return <Fragment>
					<ItemG xs={12} container alignItems={'center'}>
						<Checkbox checked={after} onClick={() => setAfter(!after)} style={{ padding: "12px 12px 12px 0px" }} />
						<Typography>{t('filters.afterDate')}</Typography>
					</ItemG>
					<ItemG>
						{/* <MuiPickersUtilsProvider utils={MomentUtils}> */}
						<DateTimePicker
							id={'date'}
							autoOk
							fullWidth
							clearable
							disableFuture
							ampm={false}
							format='LLL'
							value={date}
							autoFocus
							onChange={handleCustomDate}
							animateYearScrolling={false}
							color='primary'
							dateRangeIcon={<DateRange />}
							timeIcon={<AccessTime />}
							rightArrowIcon={<KeyboardArrowRight />}
							leftArrowIcon={<KeyboardArrowLeft />}
							InputLabelProps={{/*  FormLabelClasses: { root: classes.label, focused: classes.focused } */ }}
							InputProps={{ classes: { underline: classes.underline } }}
						/>
						{/* </MuiPickersUtilsProvider> */}
					</ItemG>
				</Fragment>
			case 'string':
				return <TextF
					fullWidth
					id={'filter-text'}
					autoFocus
					onKeyDown={handleKeyDown}
					label={t('filters.contains')}
					value={value ? value : ""}
					onChange={handleInput} />
			default:
				break
		}
	}

	const errorClassname = cx({
		[classes.error]: error
	})
	const filterTypeOptions = [{
		value: "OR",
		label: "OR",
	}, {
		value: "AND",
		label: "AND"
	}]
	const handleChangeFilterType = (e) => {
		setFilterType(e.target.value)

	}
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
							{renderType()}
						</ItemG>
						<ItemG xs={12}>
							<DSelect
								margin={'normal'}
								fullWidth
								// label={title}
								value={filterType}
								onChange={handleChangeFilterType}
								menuItems={filterTypeOptions}
							/>
						</ItemG>
					</ItemG>
				</CardContent>
				<CardActions>
					<ItemG xs={12} container justify={'center'}>
						<Button onClick={_handleButton} onKeyPress={handleKeyPress}>
							{!edit ? t('actions.addFilter') : t('actions.editFilter')}
						</Button>
					</ItemG>
				</CardActions>
			</Card>
		</Popover>
	)
}


export default FilterCard
