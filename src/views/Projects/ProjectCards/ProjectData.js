import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types'
import { Grid, IconButton, Menu, MenuItem, withStyles, /* Typography, */ Select, FormControl, FormHelperText, Divider, Dialog, DialogTitle, DialogContent, /* DialogContentText, */ Button, DialogActions, ListItem, ListItemIcon, ListItemText, Collapse, List, Hidden } from '@material-ui/core';
import {
	AccessTime, AssignmentTurnedIn, MoreVert,
	DateRange, KeyboardArrowRight as KeyArrRight, KeyboardArrowLeft as KeyArrLeft,
	DonutLargeRounded, PieChartRounded, BarChart, ExpandMore, Visibility
} from "@material-ui/icons"
// import { dateFormatter } from 'variables/functions';
import { ItemGrid, CircularLoader, Caption, Info, /* , Caption, Info */ } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import deviceStyles from 'assets/jss/views/deviceStyles';
import { Doughnut, Bar, Pie } from 'react-chartjs-2';
import { getWifiSummary } from 'variables/dataDevices';
import { getRandomColor } from 'variables/colors';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import classNames from 'classnames';
var moment = require('moment');


class ProjectData extends Component {
	constructor(props) {
		super(props)

		this.state = {
			from: moment().startOf('day'),
			to: moment().endOf('day'),
			barDataSets: null,
			roundDataSets: null,
			actionAnchor: null,
			loading: true,
			dateFilterInputID: 0,
			openCustomDate: false,
			display: 2,
			visibility: false
		}
	}
	legendOpts = {
		display: this.props.theme.breakpoints.width("md") < window.innerWidth ? true : false,
		position: 'bottom',
		fullWidth: true,
		reverse: false,
		labels: {
			padding: 10
		}
	}
	barOpts = {
		display: false,
		position: 'bottom',
		fullWidth: true,
		reverse: false,
		labels: {
			padding: 10
		}
	}
	getWifiSum = async () => {
		const { project } = this.props
		const { from, to } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)

		let dataArr = []
		await Promise.all(project.devices.map(async d => {
			let dataSet = null
			await getWifiSummary(d.device_id, startDate, endDate).then(rs => dataSet = { nr: d.device_id, id: d.device_name + "(" + d.device_id + ")", data: rs })
			return dataArr.push(dataSet)
		}))
		dataArr.sort((a, b) => a.nr - b.nr )
		this.setState({
			loading: false,
			roundDataSets: {
				labels: dataArr.map(da => da.id),
				datasets: [{
					label: "",
					borderColor: "#FFF",
					borderWidth: 1,
					data: dataArr.map(d => parseInt(d.data, 10)),
					backgroundColor: dataArr.map(() => getRandomColor())
				}]
			},
			barDataSets: {
				labels: dataArr.map(d => d.nr),
				datasets: [{
					borderColor: "#FFF",
					borderWidth: 1,
					data: dataArr.map(d => d.data),
					backgroundColor: dataArr.map(() => getRandomColor())
				}]
				
			}
		})
	}
	componentDidMount = async () => {
		this._isMounted = 1
		// console.log(this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : 1000)
		if (this._isMounted) {
			this.getWifiSum()
		}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}

	handleOpenActionsDetails = event => {
		this.setState({ actionAnchor: event.currentTarget });
	};
	handleCloseActionsDetails = () => {
		this.setState({ actionAnchor: null });
	};
	format = "YYYY-MM-DD+HH:mm"
	handleSetDate = (id) => {
		let to = null
		let from = null
		switch (id) {
			case 0: // Today
				from = moment().startOf('day')
				to = moment().endOf('day')
				break;
			case 1: // Last 7 days
				from = moment().subtract(7, 'd').startOf('day')
				to = moment().endOf('day')
				break;
			case 2: // last 30 days
				from = moment().subtract(30, 'd').startOf('day')
				to = moment().endOf('day')
				break;
			case 3: // last 90 days
				from = moment().subtract(90, 'd').startOf('day')
				to = moment().endOf('day')
				break;
			default:
				break;
		}
		this.setState({
			dateFilterInputID: id,
			to: to,
			from: from,
			loading: true,
			roundDataSets: null,
			barDataSets: null
		}, this.getWifiSum)
	}
	handleVisibility = (event) => {
		let id = event.target.value
		this.setState({ display: id })
	}
	handleDateFilter = (event) => {
		let id = event.target.value
		if (id !== 4) {
			this.handleSetDate(id)
		}
		else { 
			this.setState({ loading: true,  openCustomDate: true, dateFilterInputID: id })
		}
	}
	handleCustomDate = date => e => {
		this.setState({
			[date]: e
		})
	}
	options = [
		{ id: 0, label: "Today" },
		{ id: 1, label: "Last 7 days" },
		{ id: 2, label: "Last 30 days" },
		{ id: 3, label: "Last 90 days" },
		{ id: 4, label: "Custom Interval" },

	]
	visibilityOptions = [
		{ id: 0, icon: <PieChartRounded/>, label: "Pie Chart" },
		{ id: 1, icon: <DonutLargeRounded/>, label: "Donut Chart" },
		{ id: 2, icon: <BarChart />, label: "Bar Chart" },
	]
	handleCloseDialog = () => {
		this.setState({ openCustomDate: false })
		this.getWifiSum()
	}
	renderCustomDateDialog = () => {
		console.log(this.props.t)
		const { classes } = this.props
		return <MuiPickersUtilsProvider utils={MomentUtils}>
		 <Dialog
				open={this.state.openCustomDate}
				onClose={this.handleCloseUnassign}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title">Custom Date</DialogTitle>
				<DialogContent>
					<ItemGrid>
						<DateTimePicker
							autoOk
							label="Start Date"
							clearable
							format="DD.MM.YYYY+HH:mm"
							value={this.state.from}
							onChange={this.handleCustomDate('from')}
							animateYearScrolling={false}
							color="primary"
							disableFuture
							dateRangeIcon={<DateRange />}
							timeIcon={<AccessTime/>}
							rightArrowIcon={<KeyArrRight />}
							leftArrowIcon={<KeyArrLeft />}
							InputLabelProps={{ FormLabelClasses: { root: classes.label, focused: classes.focused } }}
							InputProps={{ classes: { underline: classes.underline } }}
						/>
					</ItemGrid>
					<ItemGrid>
						<DateTimePicker
							autoOk
							disableFuture
							label="End Date"
							clearable
							format="DD.MM.YYYY+HH:mm"
							value={this.state.to}
							onChange={this.handleCustomDate('to')}
							animateYearScrolling={false}
							dateRangeIcon={<DateRange />}
							timeIcon={<AccessTime />}
							color="primary"
							rightArrowIcon={<KeyArrRight />}
							leftArrowIcon={<KeyArrLeft />}
							InputLabelProps={{ FormLabelClasses: { root: classes.label, focused: classes.focused } }}
							InputProps={{ classes: { underline: classes.underline } }}
						/>
					</ItemGrid>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => { this.setState({ loading: false, openCustomDate: false })}} color="primary">
						No
					</Button>
					<Button onClick={this.handleCloseDialog} color="primary" autoFocus>
						Apply
					</Button>
				</DialogActions>
			</Dialog>
		</MuiPickersUtilsProvider>

	}
	renderType = () => {
		const { display } = this.state
		switch (display) {
			case 0:
				return this.state.roundDataSets ?
					<Pie
						height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : window.innerHeight - 200}
						legend={this.legendOpts}
						data={this.state.roundDataSets}
						options={{
							maintainAspectRatio: false,
						}}
					/> : null

			case 1:
				return this.state.roundDataSets ?
					<Doughnut
						height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : window.innerHeight - 200}
						legend={this.legendOpts}
						options={{
							maintainAspectRatio: false,
						}}
						data={this.state.roundDataSets}
					/> : null
			case 2:
				return this.state.barDataSets ? <Bar
					data={this.state.barDataSets}
					legend={this.barOpts}
					height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 700 : window.innerHeight - 200}
					options={{
						maintainAspectRatio: false,
					}}
				/> : null
			default:
				break;
		}
	}
	renderDateFilter = () => {
		const { classes } = this.props
		const { dateFilterInputID, to, from } = this.state
		let displayTo = moment(to).format(this.format)
		let displayFrom = moment(from).format(this.format)
		return (
			<div className={classes.root}>
				<Hidden smDown>
					<DateRange className={classes.leftIcon} />
				</Hidden>
				<FormControl className={classes.formControl}>
					<Select
						value={this.state.dateFilterInputID}
						onChange={this.handleDateFilter}
						inputProps={{
							name: 'data-dateFilter',
							id: 'data-dateFilterInput',
						}}
					>
						<ItemGrid >
							<Caption>{this.options[this.options.findIndex(d => d.id === dateFilterInputID ? true : false)].label}</Caption>
							{/* <Info>{`${from.substr(0, 10)} - ${to.substr(0, 10)}`}</Info> */}
							<Info>{`${displayFrom} - ${displayTo}`}</Info>
						</ItemGrid>
						<Divider />
						<MenuItem value={0}>Today</MenuItem>
						<MenuItem value={1}>Last 7 days</MenuItem>
						<MenuItem value={2}>Last 30 days</MenuItem>
						<MenuItem value={3}>Last 90 days </MenuItem>
						<Divider />
						<MenuItem value={4}>Custom Range</MenuItem>
					</Select>
					<FormHelperText>{`${displayFrom} - ${displayTo}`}</FormHelperText>
				</FormControl>
			</div>
		)
	}
	renderMenu = () => {
		const { actionAnchor } = this.state
		const { classes } = this.props
		return <ItemGrid container noMargin noPadding>
			<Hidden smDown>
				{this.renderDateFilter()}
			</Hidden>
			<IconButton
				aria-label="More"
				aria-owns={actionAnchor ? 'long-menu' : null}
				aria-haspopup="true"
				onClick={this.handleOpenActionsDetails}>
				<MoreVert />
			</IconButton>
			<Menu
				id="long-menu"
				anchorEl={actionAnchor}
				open={Boolean(actionAnchor)}
				onClose={this.handleCloseActionsDetails}
				onChange={this.handleVisibility}
				PaperProps={{
					style: {
						maxHeight: 300,
						minWidth: 250
					}
				}}>
				<div>
					<Hidden smUp>
						<ListItem>
							{this.renderDateFilter()}
						</ListItem>
					</Hidden>
				</div>
				<ListItem button onClick={() => { this.setState({ visibility: !this.state.visibility }) }}>
					<ListItemIcon>
						<Visibility />
					</ListItemIcon>
					<ListItemText inset primary="Graph Type" />
					<ExpandMore className={classNames({
						[classes.expandOpen]: this.state.visibility,
					}, classes.expand)} />
				</ListItem>
				<Collapse in={this.state.visibility} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						{this.visibilityOptions.map(op => {
							return <ListItem key={op.id} button className={classes.nested} onClick={() => this.setState({ display: op.id })}>
								<ListItemIcon>
									{op.icon}
								</ListItemIcon>
								<ListItemText inset primary={op.label} />
							</ListItem>
						})}
					</List>
				</Collapse>
				))}
			</Menu>
		</ItemGrid>
	}
	render() {
		console.log(this.props.t)
		const {  loading } = this.state
		return (
			<InfoCard
				title={"Data"} avatar={<AssignmentTurnedIn />}
				noExpand
				topAction={this.renderMenu()}
				content={
					<Grid container>
						{this.renderCustomDateDialog()}
						{loading ? <CircularLoader notCentered /> :
							<Fragment>
								<ItemGrid xs={12} container noPadding>
									{this.renderType()}
								</ItemGrid>
							</Fragment>}
					</Grid>}
			/>
		);
	}
}
ProjectData.propTypes = {
	// history: PropTypes.any.isRequired,
	// match: PropTypes.any.isRequired,
	project: PropTypes.object.isRequired,
}
export default withStyles(deviceStyles, { withTheme: true })(ProjectData);