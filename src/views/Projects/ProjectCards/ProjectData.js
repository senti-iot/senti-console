import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types'
import { Grid, IconButton, Menu, MenuItem, withStyles, /* Typography, */ Select, FormControl, FormHelperText, Divider, Dialog, DialogTitle, DialogContent, /* DialogContentText, */ Button, DialogActions } from '@material-ui/core';
import { AccessTime, AssignmentTurnedIn, MoreVert, DateRange, KeyboardArrowRight as KeyArrRight, KeyboardArrowLeft as KeyArrLeft } from "@material-ui/icons"
// import { dateFormatter } from 'variables/functions';
import { ItemGrid, CircularLoader, Caption, Info, /* , Caption, Info */ } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import deviceStyles from 'assets/jss/views/deviceStyles';
import { Doughnut, Bar, Pie } from 'react-chartjs-2';
import { getWifiSummary } from 'variables/dataDevices';
import { getRandomColor } from 'variables/colors';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
var moment = require('moment');


const legendOpts = {
	display: true,
	position: 'bottom',
	fullWidth: true,
	reverse: false,
};

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
			display: 0
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
			await getWifiSummary(d.device_id, startDate, endDate).then(rs => dataSet = { id: d.device_name + "(" + d.device_id + ")", data: rs })
			return dataArr.push(dataSet)
		}))

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
				datasets: dataArr.map(d => ({
					label: [d.id],
					borderColor: "#FFF",
					borderWidth: 1,
					data: [parseInt(d.data, 10)],
					backgroundColor: getRandomColor()
				})
				)
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
		// e.preventDefault()
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
	handleCloseDialog = () => {
		this.setState({ openCustomDate: false })
		this.getWifiSum()
	}
	renderCustomDateDialog = () => {
		const { classes } = this.props
		return <MuiPickersUtilsProvider utils={MomentUtils}>
		 <Dialog
				open={this.state.openCustomDate}
				onClose={this.handleCloseUnassign}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title">Custom Date</DialogTitle>
				<DialogContent>
					{/* <DialogContentText id="alert-dialog-description"> */}
					{/* Are you sure you want to unassign {device.device_id + " " + device.device_name} from project {device.project.title} ? */}
					{/* </DialogContentText> */}
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
							color="primary"
							rightArrowIcon={<KeyArrRight />}
							leftArrowIcon={<KeyArrLeft />}
							InputLabelProps={{ FormLabelClasses: { root: classes.label, focused: classes.focused } }}
							InputProps={{ classes: { underline: classes.underline } }}
						/>
					</ItemGrid>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleCloseUnassign} color="primary">
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
						height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : 1000}
						width={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : window.innerWidth - 40}
						options={{
							maintainAspectRatio: false
						}}
						redraw
						data={this.state.roundDataSets} legend={legendOpts} /> : null

			case 1: 
				return this.state.roundDataSets ?
					<Doughnut
						height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : 1000}
						width={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : window.innerWidth - 40}
						options={{
							maintainAspectRatio: false
						}}
						redraw
						data={this.state.roundDataSets} legend={legendOpts} /> : null
			case 2: 
				return this.state.barDataSets ? <Bar
					data={this.state.barDataSets}
					legend={legendOpts}
					redraw
					height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 700 : 1000}
					width={this.props.theme.breakpoints.width("md") < window.innerWidth ? 700 : window.innerWidth - 40}
					options={{
						maintainAspectRatio: false
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
				<DateRange className={classes.leftIcon} />
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
	render() {
		const { actionAnchor, loading } = this.state

		return (
			<InfoCard
				title={"Data"} avatar={<AssignmentTurnedIn />}
				noExpand
				topAction={<ItemGrid container noMargin noPadding>
					{this.renderDateFilter()}
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
						PaperProps={{
							style: {
								maxHeight: 200,
								minWidth: 200
							}
						}}>
						<MenuItem>
							{/* <Edit className={classes.leftIcon} />Edit project */}
						</MenuItem>
						))}
					</Menu>
				</ItemGrid>}
				content={
					<Grid container>
						{this.renderCustomDateDialog()}
						{loading ? <CircularLoader notCentered /> :
							<Fragment>
								<ItemGrid xs={12} container noPadding>
									{this.renderType()}
								</ItemGrid>
								<ItemGrid xs={12} container noPadding>
									<Button onClick={() => {
										this.setState({
											display: this.state.display + 1 < 3 ? this.state.display + 1 : 0
										})
									}}> Change Type</Button>
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