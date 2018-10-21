import { Collapse, Divider, FormControl, FormHelperText, Hidden, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Select, withStyles, Checkbox } from '@material-ui/core';
import { BarChart, DateRange, DonutLargeRounded, ExpandMore, MoreVert, PieChartRounded, Visibility, Timeline, ShowChart } from "@material-ui/icons";
import deviceStyles from 'assets/jss/views/deviceStyles';
import classNames from 'classnames';
import { Caption, CircularLoader, CustomDateTime, Info, InfoCard, ItemG, ItemGrid } from 'components';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Bar, Doughnut, Pie, Line } from 'react-chartjs-2';
import { colors } from 'variables/colors';
import { getWifiDaily, getWifiHourly } from 'variables/dataDevices';
import { shortDateFormat } from 'variables/functions';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

class DeviceData extends Component {
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
			timeType: 0,
			openCustomDate: false,
			display: 2,
			visibility: false,
		}
	}

	legendOpts = {
		display: !isWidthUp("md", this.props.width) ? true : true,
		position: !isWidthUp("md", this.props.width) ? 'left' : "bottom",
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

	format = "YYYY-MM-DD+HH:mm"

	visibilityOptions = [
		{ id: 0, icon: <PieChartRounded />, label: this.props.t("charts.type.pie") },
		{ id: 1, icon: <DonutLargeRounded />, label: this.props.t("charts.type.donut") },
		{ id: 2, icon: <BarChart />, label: this.props.t("charts.type.bar") },
		{ id: 3, icon: <ShowChart />, label: this.props.t("charts.type.line") }
	]

	options = [
		{ id: 0, label: this.props.t("filters.dateOptions.today") },
		{ id: 5, label: this.props.t("filters.dateOptions.yesterday") },
		{ id: 6, label: this.props.t("filters.dateOptions.thisWeek") },
		{ id: 1, label: this.props.t("filters.dateOptions.7days") },
		{ id: 2, label: this.props.t("filters.dateOptions.30days") },
		{ id: 3, label: this.props.t("filters.dateOptions.90days") },
		{ id: 4, label: this.props.t("filters.dateOptions.custom") },
	]

	componentDidMount = async () => {
		this._isMounted = 1
		if (this._isMounted) {
			this.getWifiSum()
		}
	}

	componentWillUnmount = () => {
		this._isMounted = 0
	}

	getWifiDay = async () => {
		const { device } = this.props
		const { from, to } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		let data = await getWifiDaily(device.id, startDate, endDate).then(rs => rs)
		if (data) {
			let dataArr = Object.keys(data).map(r => ({ id: shortDateFormat(r), value: data[r] }))
			this.setState({
				loading: false,
				calibrated: {
					lineDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: colors[18],
							// borderWidth: 1,
							data: dataArr.map(rd => device.wifiFactor ? parseInt(rd.value, 10) * device.wifiFactor : parseInt(rd.value, 10)),
							backgroundColor: colors[18],
							fill: false,
							lineTension: 0.1,
							borderCapStyle: 'butt',
							borderJoinStyle: 'miter',
							pointBorderColor: colors[18]
						}]

					},
					roundDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: "#FFF",
							borderWidth: 1,
							data: dataArr.map(rd => device.wifiFactor ? parseInt(rd.value, 10) * device.wifiFactor : parseInt(rd.value, 10)),
							// backgroundColor: dataArr.map(() => getRandomColor())
							backgroundColor: dataArr.map((rd, id) => colors[id])
						}]
					},
					barDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: "#FFF",
							borderWidth: 1,
							data: dataArr.map(rd => device.wifiFactor ? parseInt(rd.value, 10) * device.wifiFactor : parseInt(rd.value, 10)),
							backgroundColor: dataArr.map((rd, id) => colors[id])
						}
						]
					}
				},
				uncalibrated: {
					lineDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: colors[18],
							// borderWidth: 1,
							data: dataArr.map(rd => parseInt(rd.value, 10)),
							backgroundColor: colors[18],
							fill: false,
							lineTension: 0.1,
							borderCapStyle: 'butt',
							borderJoinStyle: 'miter',
							pointBorderColor: colors[18]
						}]

					},
					roundDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: "#FFF",
							borderWidth: 1,
							data: dataArr.map(rd => rd.value),
							// backgroundColor: dataArr.map(() => getRandomColor())
							backgroundColor: dataArr.map((rd, id) => colors[id])
						}]
					},
					barDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: "#FFF",
							borderWidth: 1,
							data: dataArr.map(rd => rd.value),
							backgroundColor: dataArr.map((rd, id) => colors[id])
						}
						]
					}
				}
			})
		}
		else {
			this.setState({
				loading: false,
				calibrated: {
					roundDataSets: null,
					barDataSets: null,
				}
			})
		}
	}

	getWifiSum = async () => {
		const { device } = this.props
		const { from, to } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		var data = await getWifiHourly(device.id, startDate, endDate).then(rs => rs)
		if (data) {
			var dataArr = Object.keys(data).map(r => ({ id: moment(r).format("HH:mm"), value: data[r] }))
			this.setState({
				loading: false,
				calibrated: {
					lineDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: colors[18],
							// borderWidth: 1,
							data: dataArr.map(rd => device.wifiFactor ? parseInt(rd.value, 10) * device.wifiFactor : parseInt(rd.value, 10)),
							backgroundColor: colors[18],
							fill: false,
							lineTension: 0.1,
							borderCapStyle: 'butt',
							borderJoinStyle: 'miter',
							pointBorderColor: colors[18]
						}]
					},
					roundDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: "#FFF",
							borderWidth: 1,
							data: dataArr.map(rd => device.wifiFactor ? parseInt(rd.value, 10) * device.wifiFactor : parseInt(rd.value, 10)),
							// backgroundColor: dataArr.map(() => getRandomColor())
							backgroundColor: dataArr.map((rd, id) => colors[id])
						}]
					},
					barDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: "#FFF",
							borderWidth: 1,
							data: dataArr.map(rd => device.wifiFactor ? parseInt(rd.value, 10) * device.wifiFactor : parseInt(rd.value, 10)),
							backgroundColor: dataArr.map((rd, id) => colors[id])
						}
						]
					}
				},
				uncalibrated: {
					lineDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: colors[18],
							// borderWidth: 1,
							data: dataArr.map(rd => parseInt(rd.value, 10)),
							backgroundColor: colors[18],
							fill: false,
							lineTension: 0.1,
							borderCapStyle: 'butt',
							borderJoinStyle: 'miter',
							pointBorderColor: colors[18]
						}]

					},
					roundDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: "#FFF",
							borderWidth: 1,
							data: dataArr.map(rd => rd.value),
							// backgroundColor: dataArr.map(() => getRandomColor())
							backgroundColor: dataArr.map((rd, id) => colors[id])
						}]
					},
					barDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: "#FFF",
							borderWidth: 1,
							data: dataArr.map(rd => rd.value),
							backgroundColor: dataArr.map((rd, id) => colors[id])
						}
						]
					}
				}
			})
		}
		else {
			this.setState({
				loading: false,
				roundDataSets: null,
				barDataSets: null,
			})
		}
	}

	handleCustomCheckBox = (e) => {
		this.setState({ timeType: parseInt(e.target.value, 10) })
	}
	handleOpenActionsDetails = event => {
		this.setState({ actionAnchor: event.currentTarget });
	}

	handleCloseActionsDetails = () => {
		this.setState({ actionAnchor: null });
	}

	handleSwitchDayHour = () => {
		let id = this.state.dateFilterInputID
		const { timeType } = this.state.timeType
		switch (id) {
			case 0://
				this.getWifiSum();
				break;
			case 1:
				this.getWifiDay();
				break;
			case 2:
				this.getWifiDay();
				break;
			case 3:
				this.getWifiDay();
				break;
			case 4:
				timeType === 1 ? this.getWifiDay() : this.getWifiSum()
				break
			case 5:
				this.getWifiSum();
				break
			case 6:
				this.getWifiDay();
				break
			default:
				this.getWifiDay();
				break;

		}
	}

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
			case 4: //Custom range
				from = moment(this.state.from)
				to = moment(this.state.to)
				break
			case 5: // Yesterday
				from = moment().subtract(1, 'd').startOf('day')
				to = moment().subtract(1, 'd').endOf('day')
				break;
			case 6: //This Week
				from = moment().startOf('week').startOf('day')
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
		}, this.handleSwitchDayHour)
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
			this.setState({ loading: true, openCustomDate: true, dateFilterInputID: id })
		}
	}

	handleCustomDate = date => e => {
		this.setState({
			[date]: e
		})
	}

	handleCloseDialog = () => {
		this.setState({ openCustomDate: false })
		if (this.state.timeType === 1) {
			this.getWifiDay()
		}
		else {
			this.getWifiSum()
		}
	}

	handleCancelCustomDate = () => {
		this.setState({
			loading: false, openCustomDate: false
		})
	}

	handleRawData = () => {
		const { dateFilterInputID } = this.state
		this.setState({ loading: true, actionAnchor: null, raw: !this.state.raw }, () => this.handleSetDate(dateFilterInputID))
	}

	renderCustomDateDialog = () => {
		const { classes, t } = this.props
		const { openCustomDate, to, from, timeType } = this.state
		return <CustomDateTime
			openCustomDate={openCustomDate}
			handleCloseDialog={this.handleCloseDialog}
			handleCustomDate={this.handleCustomDate}
			to={to}
			from={from}
			timeType={timeType}
			handleCustomCheckBox={this.handleCustomCheckBox}
			handleCancelCustomDate={this.handleCancelCustomDate}
			t={t}
			classes={classes}
		/>
	}

	renderNoDataFilters = () => {
		return <ItemGrid container justify={'center'}>
			<Caption> {this.props.t("devices.noDataFilters")}</Caption>
		</ItemGrid>
	}

	renderType = () => {
		const { display, raw } = this.state
		if (raw) {
			switch (display) {
				case 0:
					return this.state.uncalibrated ? this.state.uncalibrated.roundDataSets ? <div style={{ maxHeight: 400 }}>						<Pie
						height={!isWidthUp("md", this.props.width) ? 300 : window.innerHeight - 300}
						legend={this.legendOpts}
						data={this.state.uncalibrated.roundDataSets}
						options={{
							maintainAspectRatio: false,
						}}
					/>
					</div>
						: this.renderNoDataFilters() : this.renderNoDataFilters()
				case 1:
					return this.state.uncalibrated ? this.state.uncalibrated.roundDataSets ?
						<div style={{ maxHeight: 400 }}>

							<Doughnut
								height={!isWidthUp("md", this.props.width) ? 300 : window.innerHeight - 300}
								legend={this.legendOpts}
								options={{
									maintainAspectRatio: false,
								}}
								data={this.state.uncalibrated.roundDataSets}
							/></div>
						: this.renderNoDataFilters() : this.renderNoDataFilters()
				case 2:
					return this.state.uncalibrated ? this.state.uncalibrated.barDataSets ?
						<div style={{ maxHeight: 400 }}>
							<Bar
								data={this.state.uncalibrated.barDataSets}
								legend={this.barOpts}
								height={!isWidthUp("md", this.props.width) ? 300 : window.innerHeight - 300}
								options={{
									maintainAspectRatio: false,
								}}
							/>
						</div>
						: this.renderNoDataFilters() : this.renderNoDataFilters()
				case 3:
					return this.state.uncalibrated ? this.state.uncalibrated.lineDataSets ?
						<div style={{ maxHeight: 400 }}>
							<Line
								data={this.state.uncalibrated.lineDataSets}
								legend={this.barOpts}
								height={!isWidthUp("md", this.props.width) ? 300 : window.innerHeight - 300}
								options={{
									maintainAspectRatio: false,
								}} />
						</div>
						: this.renderNoDataFilters() : this.renderNoDataFilters()

				default:
					break;
			}
		}
		else {
			switch (display) {
				case 0:
					return this.state.calibrated ? this.state.calibrated.roundDataSets ?
						<div style={{ maxHeight: 400 }}>
							<Pie
								height={!isWidthUp("md", this.props.width) ? 300 : window.innerHeight - 300}
								legend={this.legendOpts}
								data={this.state.calibrated.roundDataSets}
								options={{
									maintainAspectRatio: false,
								}}
							/>
						</div>
						: this.renderNoDataFilters() : this.renderNoDataFilters()
				case 1:
					return this.state.calibrated ? this.state.calibrated.roundDataSets ?
						<div style={{ maxHeight: 400 }}>
							<Doughnut
								height={!isWidthUp("md", this.props.width) ? 300 : window.innerHeight - 300}
								legend={this.legendOpts}
								options={{
									maintainAspectRatio: false,
								}}
								data={this.state.calibrated.roundDataSets}
							/>	</div>
						: this.renderNoDataFilters() : this.renderNoDataFilters()
				case 2:
					return this.state.calibrated ? this.state.calibrated.barDataSets ?
						<div style={{ maxHeight: 400 }}>
							<Bar
								data={this.state.calibrated.barDataSets}
								legend={this.barOpts}
								height={!isWidthUp("md", this.props.width) ? 300 : window.innerHeight - 300}
								options={{
									maintainAspectRatio: false,
								}}
							/>
						</div>
						: this.renderNoDataFilters() : this.renderNoDataFilters()
				case 3:
					return this.state.calibrated ? this.state.calibrated.lineDataSets ?
						<div style={{ maxHeight: 400 }}>
							<Line
								data={this.state.calibrated.lineDataSets}
								legend={this.barOpts}
								height={!isWidthUp("md", this.props.width) ? 300 : window.innerHeight - 300}
								options={{
									maintainAspectRatio: false,
								}} />
						</div>
						: this.renderNoDataFilters() : this.renderNoDataFilters()

				default:
					break;
			}
		}
	}

	renderDateFilter = () => {
		const { classes, t } = this.props
		const { dateFilterInputID, to, from } = this.state
		let displayTo = shortDateFormat(to)
		let displayFrom = shortDateFormat(from)
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
						<MenuItem value={5}>{t("filters.dateOptions.yesterday")}</MenuItem>
						<MenuItem value={6}>{t("filters.dateOptions.thisWeek")}</MenuItem>
						<MenuItem value={1}>{t("filters.dateOptions.7days")}</MenuItem>
						<MenuItem value={2}>{t("filters.dateOptions.30days")}</MenuItem>
						<MenuItem value={3}>{t("filters.dateOptions.90days")}</MenuItem>
						<Divider />
						<MenuItem value={4}>{t("filters.dateOptions.custom")}</MenuItem>
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
				))}
			</Menu>
		</ItemGrid>
	}

	render() {
		const { loading, raw } = this.state
		const { t, classes, /*  device */ } = this.props
		return (
			<InfoCard
				noRightExpand
				topAction={this.renderMenu()}
				title={t("devices.cards.data")}
				avatar={<Timeline />}
				// leftActions={
				// 	<Button
				// 		style={{ marginLeft: 24, padding: 16 }} 
				// 		variant={'text'} 
				// 		color={"primary"} 
				// 		onClick={() => this.props.history.push({ pathname: `/collection/${device.dataCollection.id}`, prevURL: `/device/${device.id}` })}>
				// 		{t("menus.seeMore")}
				// 	</Button>
				// }
				content={
					<ItemG container>
						{this.renderCustomDateDialog()}
						{loading ? <CircularLoader notCentered /> :
							<ItemG xs={12}>
								<Caption className={classes.bigCaption2}>{raw ? t("collections.rawData") : t("collections.calibratedData")}</Caption>
								{this.renderType()}
							</ItemG>}
					</ItemG>}
			/>
		);
	}
}

DeviceData.propTypes = {
	// history: PropTypes.any.isRequired,
	// match: PropTypes.any.isRequired,
	device: PropTypes.object.isRequired,
}

export default withStyles(deviceStyles, { withWidth: true })(withWidth()(DeviceData));