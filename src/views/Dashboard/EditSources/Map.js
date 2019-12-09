import React, { Component, Fragment } from "react";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import { T, ItemG, TextF } from 'components';
import { ExpandMore } from 'variables/icons';
import { PieChartRounded, DonutLargeRounded, BarChart, ShowChart } from 'variables/icons';
import AssignSensorDialog from 'components/AssignComponents/AssignSensorDialog';


export class ESMap extends Component {
	constructor(props) {
		super(props)

		this.state = {
			dataSourceExp: false,
			generalExp: false,
			openSensor: false,
			openCF: false
		}
	}

	handleExpand = (prop, val) => e => {
		this.setState({ [prop]: val !== undefined ? val : !this.state[prop] })
	}

	chartTypes = () => {
		const { t } = this.props
		return [
			{ value: 0, icon: <PieChartRounded />, label: t('charts.type.pie') },
			{ value: 1, icon: <DonutLargeRounded />, label: t('charts.type.donut') },
			{ value: 2, icon: <BarChart />, label: t('charts.type.bar') },
			{ value: 3, icon: <ShowChart />, label: t('charts.type.line') },
		]
	}
	handleEditGraph = (prop) => e => {
		let newG = { ...this.props.g }
		newG[prop] = e.target.value
		this.props.handleEditGraph(newG)
	}

	handleEditChartType = (e) => {
		let newG = { ...this.props.g }
		newG.period.chartType = e.target.value
		newG.chartType = e.target.value
		this.props.handleEditGraph(newG)
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
		this.props.handleEditGraph(newG)
	}
	handleEditCF = d => {
		let newG = { ...this.props.g }
		newG.dataSource.cf = d.id
		this.props.handleEditGraph(newG)
		this.handleExpand('openCF', false)()
	}
	componentDidMount = () => {
		if (this.props.g.dataSource.deviceId > 0) {
			this.props.getSensor(this.props.g.dataSource.deviceId)
		}
	}
	handleEditDevice = d => {
		let newG = { ...this.props.g }
		newG.dataSource.deviceId = d.id
		this.props.getSensor(d.id)
		this.props.handleEditGraph(newG)
		this.handleExpand('openSensor', false)()
	}

	handleEditDataKey = e => {
		let newG = { ...this.props.g }
		newG.dataSource.dataKey = e.target.value
		this.props.handleEditGraph(newG)
	}

	render() {
		const { t, classes, sensor, g } = this.props
		const { dataSourceExp, generalExp, openSensor } = this.state
		return (
			<Fragment>
				<ItemG xs={12}>
					<ExpansionPanel
						expanded={generalExp}
						square
						onChange={this.handleExpand('generalExp')}
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
										onChange={this.handleEditGraph('name')}
										autoFocus
										id={'name'}
										label={t('dashboard.fields.label')}
										value={g.name}
										margin='normal'
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
						onChange={this.handleExpand('dataSourceExp')}
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
									<AssignSensorDialog
										t={t}
										open={openSensor}
										handleClose={this.handleExpand('openSensor', false)}
										callBack={this.handleEditDevice}
									/>
									<TextF
										id={'sensorChart'}
										label={t('dashboard.fields.device')}
										value={sensor ? sensor.name : t('no.device')}
										onClick={this.handleExpand('openSensor', true)}
										onChange={() => { }}
									/>
								</ItemG>
							</ItemG>
						</ExpansionPanelDetails>

					</ExpansionPanel>
				</ItemG>
			</Fragment>
		)
	}
}

export default ESMap
