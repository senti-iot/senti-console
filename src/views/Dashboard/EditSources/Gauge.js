import React, { Component, Fragment } from "react";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Collapse } from '@material-ui/core';
import { T, ItemG, DSelect, TextF, DateFilterMenu } from 'components';
import { ExpandMore } from 'variables/icons';
import { PieChartRounded, DonutLargeRounded, BarChart, ShowChart } from 'variables/icons';
import AssignSensorDialog from 'components/AssignComponents/AssignSensorDialog';
import AssignCFDialog from 'components/AssignComponents/AssignCFDialog';


export class ESGauge extends Component {
	constructor(props) {
		super(props)

		this.state = {
			dataSourceExp: false,
			generalExp: false,
			openSensor: false,
			openCF: false
		}
	}

	handleExpand = (prop, val) => e => this.setState({ [prop]: val !== undefined ? val : !this.state[prop] })

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
		const { t, classes, sensor, g, cfs } = this.props
		const { dataSourceExp, generalExp, openSensor, openCF } = this.state
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
										handleChange={this.handleEditGraph('name')}
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
									<DateFilterMenu
										customSetDate={this.handleEditPeriodG}
										label={t('dashboard.fields.defaultPeriod')}
										inputType
										t={t}
										period={g.period} />
								</ItemG>
								<ItemG xs={12}>
									<AssignSensorDialog
										all
										t={t}
										open={openSensor}
										handleClose={this.handleExpand('openSensor', false)}
										callBack={this.handleEditDevice}
									/>
									<TextF
										id={'sensorChart'}
										label={t('dashboard.fields.device')}
										value={sensor ? sensor.name : t('no.device')}
										handleClick={this.handleExpand('openSensor', true)}
										handleChange={() => { }}
									/>
								</ItemG>
								<Collapse unmountOnExit in={g.dataSource.deviceId > 0}>
									{g.dataSource.deviceId > 0 ?
										<Fragment>
											<ItemG>
												<DSelect
													simple
													value={g.dataSource.dataKey}
													onChange={this.handleEditDataKey}
													menuItems={sensor ? sensor.dataKeys ? sensor.dataKeys.map(dt => dt.key).filter((value, index, self) => self.indexOf(value) === index) : [] : []}
												/>
											</ItemG>
											<ItemG>
												<AssignCFDialog
													t={t}
													open={openCF}
													handleClose={this.handleExpand('openCF', false)}
													callBack={this.handleEditCF}
												/>
												<TextF
													id={'cfSelect'}
													label={t('dashboard.fields.cf')}
													value={cfs[cfs.findIndex(f => f.id === g.dataSource.cf)] ? cfs[cfs.findIndex(f => f.id === g.dataSource.cf)].name : t('no.function')}
													handleClick={this.handleExpand('openCF', true)}
													handleChange={() => { }}
												/>
											</ItemG>
											<ItemG xs={12}>
												<TextF
													handleChange={this.handleEditGraph('unit')}
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
		)
	}
}

export default ESGauge
