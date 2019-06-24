import React, { Component, Fragment } from "react";
// import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Paper, Dialog, AppBar, IconButton, Hidden, withStyles, Toolbar, Drawer, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, List, ListItem, ListItemText, Divider, Collapse } from '@material-ui/core';
import { T, ItemG, DSelect, TextF, DateFilterMenu, CircularLoader } from 'components';
import cx from 'classnames'
import { Close, PieChartRounded, DonutLargeRounded, BarChart, ShowChart, ExpandMore } from 'variables/icons';
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
import { connect } from 'react-redux'

import GaugeFakeData from 'views/Charts/GaugeFakeData';
import DoubleChartFakeData from 'views/Charts/DoubleChartFakeData';
import ScorecardAB from 'views/Charts/ScorecardAB';
import WindCard from 'views/Charts/WindCard';
import Scorecard from 'views/Charts/Scorecard';
import withLocalization from 'components/Localization/T';
import { suggestionGen, filterItems } from 'variables/functions';
import Search from 'components/Search/Search';
import { editGraph } from 'redux/dsSystem';
import { getSensorLS } from 'redux/data';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class EditGraph extends Component {
	constructor(props) {
		super(props)

		this.state = {
			dataSourceExp: false,
			generalExp: true,
			filters: {
				keyword: '',
				startDate: null,
				endDate: null,
				activeDateFilter: false
			}
		}
	}
	componentDidUpdate = async (prevProps) => {
		if (this.props.openEditGraph !== prevProps.openEditGraph && !this.props.sensor ) {
			const { g } = this.props
			if (g) {
				console.log(g, g.dataSource.deviceId)
				if (g.dataSource.deviceId)
					await this.props.getSensor(g.dataSource.deviceId)
			}
		}
	}
	componentDidMount = async () => {

	}
	typeChildren = (g) => {
		const { t } = this.props
		let d = this.props.d
		switch (g.type) {
			case 1:
				return <Paper key={g.id} data-grid={{ ...g.grid, x: 2, y: 5 }}>
					<GaugeFakeData
						create
						title={g.name}
						period={{ ...g.period, menuId: g.periodType }}
						t={t}
						color={d.color}
						gId={g.id}
						dId={d.id}
						single
					/>
				</Paper>
			case 0:
				return <Paper key={g.id} data-grid={{ ...g.grid, x: 2, y: 5 }}>
					<DoubleChartFakeData
						create
						title={g.name}
						g={g}
						period={{ ...g.period, menuId: g.periodType }}
						gId={g.id}
						dId={d.id}
						color={d.color}
						single={true}
						t={t}
					/>
				</Paper>
			case 2:
				return <Paper key={g.id} data-grid={{ ...g.grid, x: 2, y: 5 }}>

					<ScorecardAB
						create
						title={g.name}
						gId={g.id}
						dId={d.id}
						single={true}
						t={t}
					/>
				</Paper>
			case 3:
				return <Paper key={g.id} data-grid={{ ...g.grid, x: 2, y: 5 }}>

					<Scorecard
						create
						title={g.name}
						gId={g.id}
						dId={d.id}
						single={true}
						t={t}
					/>
				</Paper>
			case 4:
				return <Paper key={g.id} data-grid={{ ...g.grid, x: 2, y: 5 }}>
					<WindCard
						create
						title={g.name}
						gId={g.id}
						dId={d.id}
						single={true}
						t={t}
					/>
				</Paper>
			default:
				return null;
		}
	}
	chartTypes = (p) => {
		const { t } = this.props
		return [
			{ value: 0, icon: <PieChartRounded />, label: t('charts.type.pie') },
			{ value: 1, icon: <DonutLargeRounded />, label: t('charts.type.donut') },
			{ value: 2, icon: <BarChart />, label: t('charts.type.bar') },
			{ value: 3, icon: <ShowChart />, label: t('charts.type.line') },
		]
	}
	handleFilterKeyword = value => {
		this.setState({
			filters: {
				...this.state.filters,
				keyword: value
			}
		})
	}
	handleChangeDS = () => this.setState({ dataSourceExp: !this.state.dataSourceExp })
	handleChangeGeneral = () => this.setState({ generalExp: !this.state.generalExp })
	handleOpenD = () => this.setState({ selectDevice: true })
	handleOpenF = () => this.setState({ selectFunction: true })
	handleCloseD = () => this.setState({ selectDevice: false })
	handleCloseF = () => this.setState({ selectFunction: false })

	renderSelectFunction = () => {
		const { classes, t, cfs } = this.props
		const { selectFunction, filters } = this.state
		return <Dialog
			fullScreen
			open={selectFunction}
			onClose={this.handleCloseF}
			TransitionComponent={this.transition}
		>	<AppBar className={classes.cAppBar}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={2} container alignItems={'center'}>
								<IconButton color='inherit' onClick={this.handleCloseF} aria-label='Close'>
									<Close />
								</IconButton>
								<T variant='h6' color='inherit' className={classes.flex}>
									{t('cfs.pageTitle')}
								</T>
							</ItemG>
							<ItemG xs={8}>
								<Search
									fullWidth
									open={true}
									focusOnMount
									suggestions={cfs ? suggestionGen(cfs) : []}
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={12} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={this.closeDialog} aria-label='Close'>
									<Close />
								</IconButton>
								<T variant='h6' color='inherit' className={classes.flex}>
									{t('cfs.pageTitle')}
								</T>
							</ItemG>
							<ItemG xs={12} container alignItems={'center'} justify={'center'}>
								<Search
									noAbsolute
									fullWidth
									open={true}
									focusOnMount
									suggestions={cfs ? suggestionGen(cfs) : []}
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<List>
				{cfs ? filterItems(cfs, filters).map((p, i) => (
					<Fragment key={i}>
						<ListItem button onClick={() => { }} value={p.id}>
							<ListItemText
								primary={p.name} />
						</ListItem>
						<Divider />
					</Fragment>
				)
				) : <CircularLoader />}
			</List>
		</Dialog>
	}
	renderSelectDevice = () => {
		const { classes, t, sensors } = this.props
		const { selectDevice, filters } = this.state
		return <Dialog
			fullScreen
			open={selectDevice}
			onClose={this.handleCloseD}
			TransitionComponent={this.transition}
		>	<AppBar className={classes.cAppBar}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={2} container alignItems={'center'}>
								<IconButton color='inherit' onClick={this.handleCloseD} aria-label='Close'>
									<Close />
								</IconButton>
								<T variant='h6' color='inherit' className={classes.flex}>
									{t('sensors.pageTitle')}
								</T>
							</ItemG>
							<ItemG xs={8}>
								<Search
									fullWidth
									open={true}
									focusOnMount
									suggestions={sensors ? suggestionGen(sensors) : []}
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={12} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={this.closeDialog} aria-label='Close'>
									<Close />
								</IconButton>
								<T variant='h6' color='inherit' className={classes.flex}>
									{t('sensors.pageTitle')}
								</T>
							</ItemG>
							<ItemG xs={12} container alignItems={'center'} justify={'center'}>
								<Search
									noAbsolute
									fullWidth
									open={true}
									focusOnMount
									suggestions={sensors ? suggestionGen(sensors) : []}
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<List>
				{sensors ? filterItems(sensors, filters).map((p, i) => (
					<Fragment key={i}>
						<ListItem button onClick={this.handleEditDevice(p.id)} value={p.id}>
							<ListItemText
								primary={p.name} />
						</ListItem>
						<Divider />
					</Fragment>
				)
				) : <CircularLoader />}
			</List>
		</Dialog>
	}
	handleEditDataKey = e => {
		let newG = this.props.g
		newG.dataSource.dataKey = e.target.value
		this.props.editGraph(newG)
	}
	handleEditDevice = d => e => {
		let newG = this.props.g
		newG.dataSource.deviceId = d
		this.props.getSensor(d)
		this.props.editGraph(newG)
		this.setState({
			filters: {
				keyword: '',
				startDate: null,
				endDate: null,
				activeDateFilter: false
			}
		})
		this.handleCloseD()
	}
	handleEditChartType = (e) => {
		let newG = { ...this.props.g }
		newG.period.chartType = e.target.value
		newG.chartType = e.target.value
		this.props.editGraph(newG)
	}
	handleEditPeriodG = (menuId, to, from, defaultT) => {
		let newG = { ...this.props.g }
		newG.period = {
			...newG.period,
			menuId: menuId,
			to: to,
			from: from,
			timeType: defaultT
		}
		newG.periodType = menuId
		this.props.editGraph(newG)
	}
	handleEditG = (prop) => e => {
		let newG = { ...this.props.g }
		newG[prop] = e.target.value
		this.props.editGraph(newG)
	}

	renderDataSource = g => {
		const { t, classes, sensor } = this.props
		const { dataSourceExp, generalExp } = this.state
		console.log(sensor)
		switch (g.type) {
			case 0:
				return <Fragment>
					<ItemG>
						<ExpansionPanel
							expanded={generalExp}
							square
							onChange={this.handleChangeGeneral}
							classes={{
								root: classes.expansionPanel
							}}
						>
							<ExpansionPanelSummary expandIcon={<ExpandMore className={classes.icon} />}>
								<T>{`${t('dashboard.fields.general')}`}</T>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<ItemG container>
									<ItemG xs={12}>
										<TextF
											handleChange={this.handleEditG('name')}
											autoFocus
											id={'name'}
											label={t('dashboard.fields.label')}
											value={g.name}
											margin='normal'
										/>
									</ItemG>
									<ItemG xs={12}>
										<DSelect
											onChange={this.handleEditChartType}
											label={t('dashboard.fields.chartType')}
											value={g.period.chartType}
											menuItems={this.chartTypes()}
										/>
									</ItemG>
								</ItemG>
							</ExpansionPanelDetails>

						</ExpansionPanel>

					</ItemG>
					<ItemG xs={12}>
						<ExpansionPanel
							expanded={dataSourceExp}
							square
							onChange={this.handleChangeDS}
							classes={{
								root: classes.expansionPanel
							}}
						>
							<ExpansionPanelSummary expandIcon={<ExpandMore className={classes.icon} />}>
								<T>{`${t('dashboard.fields.dataSource')}`}</T>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<ItemG container>
									<ItemG xs={12}>
										<DateFilterMenu
											customSetDate={this.handleEditPeriodG}
											label={t('dashboard.fields.defaultPeriod')}
											inputType
											t={t}
											period={g.period} />
									</ItemG>
									<ItemG xs={12}>
										{this.renderSelectDevice()}
										<TextF
											id={'sensorChart'}
											label={t('dashboard.fields.device')}
											value={sensor ? sensor.name : ''}
											handleClick={this.handleOpenD}
											handleChange={() => { }}
										/>
									</ItemG>
									<Collapse unmountOnExit in={g.dataSource.deviceId > 0}>
										{g.dataSource.deviceId > 0 ?
											<Fragment>
												<ItemG>
													<DSelect
														value={g.dataSource.dataKey}
														onChange={this.handleEditDataKey}
														menuItems={sensor ? sensor.dataKeys ? sensor.dataKeys.map(dt => ({ value: dt.key, label: dt.key })) : [] : []}
													/>
												</ItemG>
												<ItemG>
													{this.renderSelectFunction()}
													<TextF
														id={'cfSelect'}
														label={t('dashboard.fields.cf')}
														value={""}
														handleClick={this.handleOpenF}
														handleChange={() => { }}
													/>
												</ItemG>
												<ItemG xs={12}>
													<TextF
														autoFocus
														id={'unit'}
														label={t('dashboard.fields.unit')}
														value={g.unit}
														margin='normal'
													/>
												</ItemG>
											</Fragment>
											: null}
									</Collapse>
								</ItemG>
							</ExpansionPanelDetails>

						</ExpansionPanel>
					</ItemG>
				</Fragment>
			case 1:
				return <ItemG>
					Gauge
				</ItemG>
			case 2:
				return <ItemG>
					DiffCard
				</ItemG>
			case 3:
				return <ItemG>
					ScoreCard
				</ItemG>
			case 4:
				return <ItemG>
					WindCard
				</ItemG>
			default:
				break;
		}
	}
	render() {
		const { openEditGraph, handleCloseEG, classes, g } = this.props
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return (
			<Dialog
				fullScreen
				open={openEditGraph}
				onClose={handleCloseEG}
				TransitionComponent={this.transition}
			>	<AppBar className={classes.cAppBar + ' ' + appBarClasses}>
					<Toolbar>
						<Hidden mdDown>
							<ItemG container alignItems={'center'}>
								<ItemG xs={2} container alignItems={'center'}>
									<IconButton color='inherit' onClick={handleCloseEG} aria-label='Close'>
										<Close />
									</IconButton>
								</ItemG>
								<ItemG xs={10}>
									<T variant='h6' color='inherit' className={classes.flex}>
										{/* {this.state.n} */}
										Edit Graph
									</T>
								</ItemG>
							</ItemG>
						</Hidden>
						<Hidden lgUp>
							<ItemG container alignItems={'center'}>
								<ItemG xs={4} container alignItems={'center'}>
									<IconButton color={'inherit'} onClick={handleCloseEG} aria-label='Close'>
										<Close />
									</IconButton>
									<T variant='h6' color='inherit' className={classes.flex}>
										Edit Graph
									</T>
								</ItemG>
							</ItemG>
						</Hidden>
					</Toolbar>
				</AppBar>
				<div style={{ width: '100%', height: 'calc(100% - 70px)', background: '#eee' }}>

					<ResponsiveReactGridLayout
						{...this.props}
						style={{ minWidth: '600px', }}
					>
						{g ? this.typeChildren(g) : null}
					</ResponsiveReactGridLayout>
				</div>
				<Drawer
					variant={'permanent'}
					anchor={'right'}
					PaperProps={{
						style: {
							width: 360,
							top: 70,
						}
					}}
				>
					<ItemG container justify={'center'}>
						{g ? this.renderDataSource(g) : null}
					</ItemG>
				</Drawer>
			</Dialog>
		)
	}
}

const mapStateToProps = (state) => ({
	g: state.dsSystem.eGraph,
	cols: { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 },
	className: "layout",
	rowHeight: 25,
	isDraggable: false,
	isResizable: false,

	sensor: state.data.sensor,
	cfs: state.data.functions,
	sensors: state.data.sensors,
	sensorDataKeys: []
})

const mapDispatchToProps = dispatch => ({
	editGraph: (newG) => dispatch(editGraph(newG)),
	getSensor: async id => dispatch(await getSensorLS(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(dashboardStyle)(EditGraph)))
