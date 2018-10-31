import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types'
import {
	Grid, IconButton, Menu, MenuItem, withStyles, Select, FormControl, FormHelperText, Divider, Dialog, DialogTitle, DialogContent, Button, DialogActions, ListItem,
	ListItemIcon, ListItemText, Collapse, List, Hidden, Checkbox,
} from '@material-ui/core';
import {
	AccessTime, AssignmentTurnedIn, MoreVert,
	DateRange, KeyboardArrowRight as KeyArrRight, KeyboardArrowLeft as KeyArrLeft,
	DonutLargeRounded, PieChartRounded, BarChart, ExpandMore, Visibility, ShowChart
} from "variables/icons"
// import { dateFormatter } from 'variables/functions';
import { ItemGrid, CircularLoader, Caption, Info, ItemG, /* , Caption, Info */ } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import deviceStyles from 'assets/jss/views/deviceStyles';
import { Doughnut, Bar, Pie } from 'react-chartjs-2';
import { getDataSummary, getDataDaily, getDataHourly, /* getDataHourly */ } from 'variables/dataCollections';
import { colors } from 'variables/colors';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import classNames from 'classnames';
import { dateFormatter } from 'variables/functions';
import { connect } from 'react-redux'
import moment from 'moment'
import LineChart from 'components/Charts/LineChart';

class ProjectData extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			from: moment().subtract(7, 'd').startOf('day'),
			to: moment().endOf('day'),
			barDataSets: null,
			roundDataSets: null,
			actionAnchor: null,
			loading: true,
			dateFilterInputID: 3,
			openCustomDate: false,
			display: 3,
			visibility: false,
			timeType: 2,
			raw: false,
			tooltip: {
				show: false,
				top: 0,
				left: 0,
				value: 0
			}
		}
	}

	legendOpts = {
		display: this.props.theme.breakpoints.width("md") < window.innerWidth ? true : false,
		position: 'bottom',
		fullWidth: true,
		reverse: false,
		labels: {
			padding: 10
		},

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

	options = [
		{ id: 0, label: this.props.t("filters.dateOptions.today") },
		{ id: 1, label: this.props.t("filters.dateOptions.yesterday") },
		{ id: 2, label: this.props.t("filters.dateOptions.thisWeek") },
		{ id: 3, label: this.props.t("filters.dateOptions.7days") },
		{ id: 4, label: this.props.t("filters.dateOptions.30days") },
		{ id: 5, label: this.props.t("filters.dateOptions.90days") },
		{ id: 6, label: this.props.t("filters.dateOptions.custom") },
	]
	timeTypes = [
		{ id: 0, format: "HH:mm", chart: "minute" },
		{ id: 1, format: "HH:mm", chart: "hour" },
		{ id: 2, format: "ll", chart: "day" },
		{ id: 3, format: "ll", chart: "day" },
	]
	visibilityOptions = [
		{ id: 0, icon: <PieChartRounded />, label: this.props.t("charts.type.pie") },
		{ id: 1, icon: <DonutLargeRounded />, label: this.props.t("charts.type.donut") },
		{ id: 2, icon: <BarChart />, label: this.props.t("charts.type.bar") },
		{ id: 3, icon: <ShowChart />, label: this.props.t("charts.type.line") }
	]
	hoursToArr = () => {
		const { from, to } = this.state
		let startDate = moment(from)
		let endDate = moment(to)
		let arr = []
		let d = startDate.clone()
		while (d <= endDate) {
			arr.push(d.toDate())
			d = d.clone().add(1, 'h')
		}
		return arr
	}
	datesToArr = () => {
		const { from, to } = this.state
		let startDate = moment(from)
		let endDate = moment(to)
		let arr = []
		let d = startDate.clone()
		while (d <= endDate) {
			arr.push(d.toDate())
			d = d.clone().add(1, 'd')
		}
		return arr
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.hoverID !== this.props.hoverID)
			this.state.timeType === 1 ? this.setHourlyData() :  this.setDailyData()
	}

	setDailyData = () => {
		const { dataArr } = this.state
		// console.log(this.props.hoverID)
		// this.props.setTimeType(2)
		this.setState({
			loading: false,
			lineDataSets: {
				labels: [...this.datesToArr()],
				datasets: dataArr.map((d, i) => ({
					id: d.id,
					backgroundColor: d.color,
					borderColor: d.color,
					borderWidth: this.props.hoverID === d.id ? 8 : 3,
					fill: false,
					label: [d.name],
					data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
				}))
			}
		})
	}
	setHourlyData = () => {
		const { dataArr } = this.state
		// console.log(this.hoursToArr())
		// this.props.setTimeType(1)
		this.setState({
			loading: false,
			timeType: 1,
			lineDataSets: {
				labels: [...this.hoursToArr()],
				datasets: dataArr.map((d, i) => ({
					id: d.id,
					backgroundColor: d.color,
					borderColor: d.color,
					borderWidth: this.props.hoverID === d.id ? 8 : 3,
					fill: false,
					label: [d.name],
					data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
				}))
			}
		})
		// console.log(this.state.lineDataSets)
	}
	getWifiHourly = async () => {
		const { project } = this.props
		const { from, to, raw } = this.state
		console.log(from, to)
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		// let days = this.datesToArr()

		let dataArr = []

		await Promise.all(project.dataCollections.map(async d => {
			let dataSet = null
			let data = await getDataHourly(d.id, startDate, endDate, raw)
			dataSet = {
				name: d.name,
				id: d.id,
				data: data,
				color: d.color
			}
			return dataArr.push(dataSet)
		}))
		dataArr = dataArr.reduce((newArr, d) => {
			if (d.data !== null)
				newArr.push(d)
			return newArr
		}, [])
		// console.log('dataArr', dataArr)
		this.setState({ dataArr: dataArr }, this.setHourlyData)
		// this.setDailyData(dataArr)
	}
	getWifiDaily = async () => {
		const { project } = this.props
		const { from, to, raw } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		// let days = this.datesToArr()

		let dataArr = []

		await Promise.all(project.dataCollections.map(async d => {
			let dataSet = null
			let data = await getDataDaily(d.id, startDate, endDate, raw)
			dataSet = {
				name: d.name,
				id: d.id,
				data: data,
				color: d.color
			}
			return dataArr.push(dataSet)
		}))
		dataArr = dataArr.reduce((newArr, d) => {
			if (d.data !== null)
				newArr.push(d)
			return newArr
		}, [])
		this.setState({ dataArr: dataArr }, this.setDailyData)
		// this.setDailyData(dataArr)
	}

	getWifiSum = async () => {
		const { project } = this.props
		const { from, to, raw } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)

		let dataArr = []
		await Promise.all(project.dataCollections.map(async d => {
			let dataSet = null
			let rs = await getDataSummary(d.id, startDate, endDate, raw)
			let total = 0
			Object.keys(rs).map(r => total = total + parseInt(rs[r], 10))
			dataSet = { nr: d.id, id: d.name + "(" + d.id + ")", data: total }
			return dataArr.push(dataSet)
		}))
		dataArr.sort((a, b) => a.nr - b.nr)
		if (dataArr.length > 0)
			this.setState({
				loading: false,
				roundDataSets: {
					labels: dataArr.map(da => da.id),
					datasets: [{
						borderColor: "#FFF",
						borderWidth: 1,
						data: dataArr.map(d => parseInt(d.data, 10)),
						backgroundColor: dataArr.map((rd, id) => colors[id])
					}]
				},
				barDataSets: {
					// labels: [this.options[this.state.dateFilterInputID].label],
					label: "DataSet",
					datasets: dataArr.map((d, id) => ({
						label: d.id,
						borderColor: "#FFF",
						borderWidth: 1,
						data: [parseInt(d.data, 10)],
						backgroundColor: colors[id]
					}))
				}
			})
		else {
			this.setState({
				loading: false,
				noData: true
			})
		}
	}

	componentDidMount = async () => {
		this._isMounted = 1
		if (this._isMounted) {
			this.getWifiDaily()
		}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}

	handleOpenActionsDetails = event => {
		this.setState({ actionAnchor: event.currentTarget });
	}

	handleCloseActionsDetails = () => {
		this.setState({ actionAnchor: null });
	}

	format = "YYYY-MM-DD+HH:mm"
	displayFormat = "DD MMMM YYYY HH:mm"
	handleSetDate = (id) => {
		let to = null
		let from = null
		switch (id) {
			case 0: // Today
				from = moment().startOf('day')
				to = moment().endOf('day')
				break;
			case 1: // Yesterday
				from = moment().subtract(1, 'd').startOf('day')
				to = moment().subtract(1, 'd').endOf('day')
				break;
			case 2: // This week
				from = moment().startOf('week').startOf('day')
				to = moment().endOf('day')
				break;
			case 3: // Last 7 days
				from = moment().subtract(7, 'd').startOf('day')
				to = moment().endOf('day')
				break;
			case 4: // last 30 days
				from = moment().subtract(30, 'd').startOf('day')
				to = moment().endOf('day')
				break;
			case 5: // last 90 days
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
		}, this.handleSwitchDayHourSummary)
	}
	handleSwitchDayHourSummary = () => {
		let id = this.state.dateFilterInputID
		const { to, from, timeType } = this.state
		let diff = moment.duration(to.diff(from)).days()
		switch (id) {
			case 0:// Today
				this.getWifiHourly();
				break;
			case 1:// Yesterday
				this.getWifiHourly();
				break;
			case 2://this week
				parseInt(diff, 10) > 1 ? this.getWifiDaily() : this.getWifiDaily()
				break;
			case 3:
				this.getWifiDaily();
				break;
			case 4:
				timeType === 1 ? this.getWifiDaily() : this.getWifiDaily()
				break
			case 5:
				this.getWifiDaily();
				break
			case 6:
				this.getWifiDaily();
				break
			default:
				this.getWifiDaily();
				break;

		}
	}
	handleSwitchVisibility = () => {
		const { display } = this.state
		switch (display) {
			case 0 || 1 || 2:
				this.getWifiSum()
				break;
			case 3:
				this.handleSwitchDayHourSummary()
				break;
			default:
				break;
		}
	}
	handleVisibility = (event) => {
		let id = event.target.value
		this.setState({ display: id })
	}

	handleDateFilter = (event) => {
		let id = event.target.value
		if (id !== 6) {
			this.handleSetDate(id)
		}
		else {
			this.setState({ loading: true, openCustomDate: true, dateFilterInputID: id })
		}
	}

	handleCustomDate = date => e => {
		console.log(e)
		this.setState({
			[date]: e
		})
	}

	handleCloseDialog = () => {
		this.setState({ openCustomDate: false })
		this.getWifiDaily()
	}

	handleRawData = () => {
		this.setState({ loading: true, actionAnchor: null, raw: !this.state.raw }, () => this.getWifiDaily())
	}
	handleZoomOnData = async (elements) => {
		// console.log(elements)
		if (elements.length > 0) {
			// console.log(this.state.lineDataSets)
			// console.log(elements[0])
			let date = null
			let startDate = null
			let endDate = null
			try {
				date = this.state.lineDataSets.datasets[elements[0]._datasetIndex].data[elements[0]._index].x
				startDate = moment(date).startOf('day')
				endDate = moment(date).endOf('day')
				this.setState({
					from: startDate,
					to: endDate,
					dateFilterInputID: 6,
					timeType: 1
				}, await this.getWifiHourly)

			}
			catch (error) {
				console.log('Error')
			}
			// console.log(date)
		}
	}
	renderCustomDateDialog = () => {
		const { classes, t } = this.props
		return <MuiPickersUtilsProvider utils={MomentUtils}>
			<Dialog
				open={this.state.openCustomDate}
				onClose={this.handleCloseUnassign}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title">{t("filters.dateOptions.custom")}</DialogTitle>
				<DialogContent>
					<ItemGrid>
						<DateTimePicker
							autoOk
							label={t("filters.startDate")}
							clearable
							ampm={false}
							format="LLL"
							value={this.state.from}
							onChange={this.handleCustomDate('from')}
							animateYearScrolling={false}
							color="primary"
							disableFuture
							dateRangeIcon={<DateRange />}
							timeIcon={<AccessTime />}
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
							label={t("filters.endDate")}
							clearable
							ampm={false}
							format="LLL"
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
					<Button onClick={() => { this.setState({ loading: false, openCustomDate: false }) }} color="primary">
						{t("dialogs.cancel")}
					</Button>
					<Button onClick={this.handleCloseDialog} color="primary" autoFocus>
						{t("dialogs.apply")}
					</Button>
				</DialogActions>
			</Dialog>
		</MuiPickersUtilsProvider>

	}
	renderType = () => {
		const { display } = this.state
		// const { t } = this.props
		switch (display) {
			case 0:
				return this.state.roundDataSets ? <div style={{ maxHeight: 400 }}>
					<Pie
						height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : window.innerHeight - 200}
						legend={this.legendOpts}
						data={this.state.roundDataSets}
						options={{
							maintainAspectRatio: false,
						}}
					/>
				</div>
					: this.renderNoData()
			case 1:
				return this.state.roundDataSets ?
					<div style={{ maxHeight: 400 }}>
						<Doughnut
							height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : window.innerHeight - 200}
							legend={this.legendOpts}
							options={{
								maintainAspectRatio: false,
							}}
							data={this.state.roundDataSets}
						/></div>
					: this.renderNoData()
			case 2:
				return this.state.barDataSets ? <div style={{ maxHeight: 400 }}><Bar
					data={this.state.barDataSets}
					legend={this.barOpts}
					height={this.props.theme.breakpoints.width("md") < window.innerWidth ? window.innerWidth / 4 : window.innerHeight - 200}
					options={{
						display: true,
						maintainAspectRatio: false,
					}}
				/></div> : this.renderNoData()
			case 3:
				return this.state.lineDataSets ?
					<LineChart
						unit={this.timeTypes[this.state.timeType]}
						onElementsClick={this.handleZoomOnData}
						setHoverID={this.props.setHoverID}
						data={this.state.lineDataSets}
					/> : this.renderNoData()
			default:
				break;
		}
	}
	renderDateFilter = () => {
		const { classes, t } = this.props
		const { dateFilterInputID, to, from } = this.state
		let displayTo = dateFormatter(to)
		let displayFrom = dateFormatter(from)
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
						<MenuItem value={0}>{t("filters.dateOptions.today")}</MenuItem>
						<MenuItem value={1}>{t("filters.dateOptions.yesterday")}</MenuItem>
						<MenuItem value={2}>{t("filters.dateOptions.thisWeek")}</MenuItem>
						<MenuItem value={3}>{t("filters.dateOptions.7days")}</MenuItem>
						<MenuItem value={4}>{t("filters.dateOptions.30days")}</MenuItem>
						<MenuItem value={5}>{t("filters.dateOptions.90days")}</MenuItem>
						<Divider />
						<MenuItem value={6}>{t("filters.dateOptions.custom")}</MenuItem>
					</Select>
					<FormHelperText>{`${displayFrom} - ${displayTo}`}</FormHelperText>
				</FormControl>
			</div>
		)
	}
	renderMenu = () => {
		const { actionAnchor, actionAnchorVisibility } = this.state
		const { classes, t } = this.props
		return <ItemGrid container noMargin noPadding>
			<ItemG>
				<Hidden smDown>
					{this.renderDateFilter()}
				</Hidden>
			</ItemG>
			<ItemG>
				<Hidden smDown>
					<IconButton title={"Chart Type"} variant={"fab"} onClick={(e) => { this.setState({ actionAnchorVisibility: e.currentTarget }) }}>
						<Visibility />
					</IconButton>
					<Menu
						id="long-menu"
						anchorEl={actionAnchorVisibility}
						open={Boolean(actionAnchorVisibility)}
						onClose={e => this.setState({ actionAnchorVisibility: null })}
						PaperProps={{
							style: {
								// maxHeight: 300,
								minWidth: 250
							}
						}}>					<List component="div" disablePadding>
							{this.visibilityOptions.map(op => {
								return <ListItem key={op.id} button className={classes.nested} onClick={() => this.setState({ display: op.id })}>
									<ListItemIcon>
										{op.icon}
									</ListItemIcon>
									<ListItemText inset primary={op.label} />
								</ListItem>
							})}
						</List>
					</Menu>
				</Hidden>
			</ItemG>
			<ItemG>
				<IconButton
					aria-label="More"
					aria-owns={actionAnchor ? 'long-menu' : null}
					aria-haspopup="true"
					onClick={this.handleOpenActionsDetails}>
					<MoreVert />
				</IconButton>
			</ItemG>
			<Menu
				id="long-menu"
				anchorEl={actionAnchor}
				open={Boolean(actionAnchor)}
				onClose={this.handleCloseActionsDetails}
				onChange={this.handleVisibility}
				PaperProps={{
					style: {
						// maxHeight: 300,
						minWidth: 250
					}
				}}>
				<div>
					<Hidden mdUp>
						<ListItem>
							{this.renderDateFilter()}
						</ListItem>
					</Hidden>
				</div>
				<ListItem button onClick={() => this.handleRawData()}>
					<ListItemIcon>
						<Checkbox
							checked={this.state.raw}
							// disabled
							className={classes.noPadding}
						/>
					</ListItemIcon>
					<ListItemText>
						{t("collections.rawData")}
					</ListItemText>
				</ListItem>
				<div>
					<Hidden mdUp>
						<ListItem button onClick={() => { this.setState({ visibility: !this.state.visibility }) }}>
							<ListItemIcon>
								<Visibility />
							</ListItemIcon>
							<ListItemText inset primary={t("filters.options.graphType")} />
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
					</Hidden>
				</div>
			</Menu>
		</ItemGrid>
	}
	renderNoData = () => {
		return <ItemG container justify={'center'}>
			<Caption> {this.props.t("devices.noData")}</Caption>
		</ItemG>
	}

	render() {
		const { t, classes } = this.props
		const { loading, noData, raw } = this.state
		return (
			<InfoCard
				title={t("projects.infoCardProjectData")} avatar={<AssignmentTurnedIn />}
				noExpand
				// noPadding
				topAction={noData ? null : this.renderMenu()}
				content={
					<Grid container>
						{this.renderCustomDateDialog()}
						{loading ? <CircularLoader notCentered /> :
							<Fragment>
								<ItemG xs={12}>
									<Caption className={classes.bigCaption2}>{raw ? t("collections.rawData") : t("collections.calibratedData")}</Caption>
									{noData ? this.renderNoData() : this.renderType()}
								</ItemG>
								{/* {this.props.hoverID} */}
							</Fragment>}
					</Grid>}
			/>
		);
	}
}
ProjectData.propTypes = {
	project: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => ({
	chartType: state.settings.chartType
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(deviceStyles, { withTheme: true })(ProjectData))