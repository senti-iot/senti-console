import React, { Component, Fragment } from 'react'
import { BarChart, PieChartRounded, ShowChart, DonutLargeRounded, Add, Clear, DateRange, ExpandMore } from 'variables/icons'
import { InfoCard, DSelect, ItemGrid, DateFilterMenu, ItemG, T, Caption, Info, Dropdown } from 'components';
import { ListItemText, ListItem, List, Grid, withStyles, Typography, Button, ExpansionPanelActions, Checkbox } from '@material-ui/core';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { settingsStyles } from 'assets/jss/components/settings/settingsStyles';
import { dateTimeFormatter, weekendColorsDropdown } from 'variables/functions';
import { connect } from 'react-redux'
import { changeChartType } from 'redux/appState';
import { changeChartDataType, removeChartPeriod, updateChartPeriod, changeWeekendColor, changePeriodChartType } from 'redux/settings';
// import { dateTimeFormatter } from 'variables/functions';

const ExpansionPanelDetails = withStyles(theme => ({
	root: {
		// padding: theme.spacing.unit * 2,
		padding: '8px 24px 0px 24px',
		backgroundColor: '#42424200'
	},
}))(MuiExpansionPanelDetails);

const ExpansionPanel = withStyles(theme => ({
	root: {
		borderBottom: theme.palette.type === 'light' ? '1px solid rgba(0, 0, 0, 0.12)' : '1px solid rgba(255, 255, 255, 0.12)',
		boxShadow: 'none',
		// '&:not(:last-child)': {
		// 	borderBottom: 0,
		// },
		'&:before': {
			display: 'none',
		},
	},
	expanded: {
		margin: 'auto',
	},
}))(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
	root: {
		padding: '0px 16px',

		boxShadow: 'none',
		marginBottom: -1,
		minHeight: 56,
		'&$expanded': {
			minHeight: 56,
		},
	},
	content: {
		'&$expanded': {
			margin: '12px 0',
		},
	},
	expanded: {},
})(props => <MuiExpansionPanelSummary {...props} />);

ExpansionPanelSummary.muiName = 'ExpansionPanelSummary';
class ChartSettings extends Component {
	constructor(props) {
		super(props)

		this.state = {
			expanded: false
		}
	}
	renderIcon = (chartType) => {
		const { classes } = this.props
		switch (chartType) {
			case 0:
				return <PieChartRounded className={classes.icon}/>
			case 1:
				return <DonutLargeRounded className={classes.icon}/>
			case 2:
				return <BarChart className={classes.icon}/>
			case 3:
				return <ShowChart className={classes.icon}/>
			default:
				break;
		}
	}
	handleChange = panel => (event, expanded) => {
		this.setState({
			expanded: expanded ? panel : false,
		});
	};
	timeTypes = () => {
		const { t } = this.props
		return [
			{ id: 0, label: t('filters.dateOptions.minutely') },
			{ id: 1, label: t('filters.dateOptions.hourly') },
			{ id: 2, label: t('filters.dateOptions.daily') },
			{ id: 3, label: t('filters.dateOptions.summary') },
		]
	}
	options = () => {
		const { t } = this.props
		return [
			{ id: 0, label: t('filters.dateOptions.today') },
			{ id: 1, label: t('filters.dateOptions.yesterday') },
			{ id: 2, label: t('filters.dateOptions.thisWeek') },
			{ id: 3, label: t('filters.dateOptions.7days') },
			{ id: 4, label: t('filters.dateOptions.30days') },
			{ id: 5, label: t('filters.dateOptions.90days') },
			{ id: 6, label: t('filters.dateOptions.custom') },
		]
	}
	chartTypes = (p) => {
		const { t } = this.props
		return [
			{ value: 0, icon: <PieChartRounded />, label: t('charts.type.pie'), func: this.changePeriodChartType(p, 0) },
			{ value: 1, icon: <DonutLargeRounded />, label: t('charts.type.donut'), func: this.changePeriodChartType(p, 1) },
			{ value: 2, icon: <BarChart />, label: t('charts.type.bar'), func: this.changePeriodChartType(p, 2) },
			{ value: 3, icon: <ShowChart />, label: t('charts.type.line'), func: this.changePeriodChartType(p, 3) },
		]

	}
	chartDataTypes = () => {
		const { t } = this.props
		return [
			{ value: 0, icon: '', label: t('settings.notDefault') },
			{ value: 1, icon: '', label: t('settings.default') }
		]
	}

	changeChartType = e => this.props.changeChartType(e.target.value)
	changeChartDataType = e => this.props.changeChartDataType(e.target.value)
	changeWeekendColor = e => this.props.changeWeekendColor(e.target.value)
	changePeriodChartType = (p, val) => () => {
		// e.preventDefault()
		this.props.changePeriodChartType(val, p)
	}

	render() {
		const { t, classes, chartType, periods,
			updateChartPeriod, removeChartPeriod,
			weekendColor } = this.props
		const { expanded } = this.state;
		return (
			<InfoCard
				noExpand
				avatar={<BarChart />}
				title={t('settings.headers.charts')}
				content={
					<Grid container>
						<List className={classes.list}>
							{/* <ListItem divider>
								<ItemGrid container zeroMargin noPadding alignItems={'center'}>
									<ListItemText>{t('settings.chart.defaultChart')}</ListItemText>
									<DSelect leftIcon menuItems={this.chartTypes()} value={chartType} onChange={this.changeChartType} />
								</ItemGrid>
							</ListItem> */}
							<ListItem divider>
								<ItemGrid container zeroMargin noPadding alignItems={'center'}>
									<ListItemText>{t('settings.chart.weekendColor')}</ListItemText>
									<DSelect leftIcon menuItems={weekendColorsDropdown(t)} value={weekendColor} onChange={this.changeWeekendColor} />
								</ItemGrid>
							</ListItem>
							<ListItem divider>
								<ItemGrid xs={12} container zeroMargin noPadding alignItems={'center'}>
									<ListItemText>
										{t('settings.chart.periods')}
									</ListItemText>
									<DateFilterMenu
										button
										settings
										icon={<Fragment><Add className={classes.icon} /><Typography>{t('menus.charts.addAPeriod')}</Typography></Fragment>}
										t={t}
									/>
								</ItemGrid>
							</ListItem>
							{periods.map((p, i) => {
								return <ExpansionPanel
									key={i}
									square
									expanded={expanded === p.id}
									onChange={this.handleChange(p.id)}
								>
									<ExpansionPanelSummary expandIcon={<ExpandMore className={classes.icon} />}>
										<Typography>{`${t('settings.chart.period')}: ${this.options()[p.menuId].label}`}</Typography>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails>
										<ItemG container spacing={16} alignItems={'center'}>
											<ItemG>
												<Caption>{t('filters.startDate')}</Caption>
												<Info>{dateTimeFormatter(p.from)}</Info>
											</ItemG>
											<ItemG>
												<Caption>{t('filters.endDate')}</Caption>
												<Info>{dateTimeFormatter(p.to)}</Info>
											</ItemG>
											<ItemG>
												<Caption>{t('filters.display')}</Caption>
												<Info>{this.timeTypes()[p.timeType].label}</Info>
											</ItemG>
											{/* <ItemG container alignItems={'center'}>
												<Caption>{t('collections.rawData')}</Caption>
												<Checkbox
													style={{ padding: 8 }}
													checked={p.raw}
													onClick={() => updateChartPeriod(p)}
												/>
											</ItemG> */}
										</ItemG>
									</ExpansionPanelDetails>
									<ExpansionPanelActions style={{ paddingTop: 0, padding: '8px 16px' }}>
										<ItemG container alignItems={'center'} justify={'flex-end'}>
											<Button size={'small'} onClick={() => updateChartPeriod(p)} >
												<Checkbox
													style={{ padding: 4 }}
													className={classes.icon}
													checked={p.raw}
												/>
												<T>{t('collections.rawData')}</T>
											</Button>
											<Dropdown
												button
												icon={<Fragment>
													{this.renderIcon(p.chartType)}<T>{this.chartTypes()[this.chartTypes().findIndex(f => f.value === p.chartType)].label}</T>
												</Fragment>
												}
												menuItems={this.chartTypes(p)}
												value={chartType}
												onChange={this.changeChartType} />
											<DateFilterMenu
												settings={true}
												button
												period={p}
												icon={
													<Fragment>
														<DateRange className={classes.icon} /><T>{t('menus.edit')}</T>
													</Fragment>
												} t={t} />
											<Button size={'small'} style={{ padding: 4 }} onClick={() => removeChartPeriod(p.id)}>
												<Clear className={classes.icon} /><T>{t('menus.delete')}</T>
											</Button>
										</ItemG>
									</ExpansionPanelActions>
								</ExpansionPanel>
							})}

						</List>
					</Grid>

				}
			/>
		)
	}
}
const mapStateToProps = (state) => {
	const s = state.settings
	return ({
		chartType: s.chartType,
		periods: s.periods,
		weekendColor: s.weekendColor
	})
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeChartType: type => dispatch(changeChartType(type)),
		changeChartDataType: type => dispatch(changeChartDataType(type)),

		removeChartPeriod: pId => dispatch(removeChartPeriod(pId)),
		updateChartPeriod: p => dispatch(updateChartPeriod(p)),

		changeWeekendColor: color => dispatch(changeWeekendColor(color)),
		changePeriodChartType: (type, p) => dispatch(changePeriodChartType(type, p))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(settingsStyles)(ChartSettings))