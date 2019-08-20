import React, { Component, Fragment } from "react";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Collapse, Button } from '@material-ui/core';
import { T, ItemG, DSelect, TextF, ITB } from 'components';
import { ExpandMore, Add, Delete } from 'variables/icons';
import { PieChartRounded, DonutLargeRounded, BarChart, ShowChart } from 'variables/icons';
import AssignSensorDialog from 'components/AssignComponents/AssignSensorDialog';
import AssignCFDialog from 'components/AssignComponents/AssignCFDialog';


class ESScorecard extends Component {
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

	handleEditLabel = i => e => {
		let newG = { ...this.props.g }
		newG.dataSources[i].label = e.target.value
		this.props.handleEditGraph(newG)
	}
	handleEditUnit = i => e => {
		let newG = { ...this.props.g }
		newG.dataSources[i].unit = e.target.value
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
	handleEditCF = i => d => {
		let newG = { ...this.props.g }
		newG.dataSources[i].cf = d.id
		this.props.handleEditGraph(newG)
		this.handleExpand('openCF', false)()
	}
	handleEditDevice = i => d => {
		let newG = { ...this.props.g }
		newG.dataSources[i].deviceId = d.id
		this.props.getSensor(d.id)
		this.props.handleEditGraph(newG)
		this.handleExpand('openSensor' + i, false)()
	}

	handleEditDataKey = i => e => {
		let newG = { ...this.props.g }
		newG.dataSources[i].dataKey = e.target.value
		this.props.handleEditGraph(newG)
	}
	handleAddDataSource = () => {
		let newG = { ...this.props.g }
		newG.dataSources.push({
			cf: -1,
			dataKey: "",
			deviceId: -1,
			label: "",
			unit: ""
		})
		this.props.handleEditGraph(newG)
	}
	handleRemoveDataSource = index => e => {
		e.stopPropagation()
		let newG = { ...this.props.g }
		newG.dataSources = newG.dataSources.filter((ds, i) => index !== i)
		this.props.handleEditGraph(newG)
	}
	render() {
		const { t, classes, sensor, g, cfs } = this.props
		const { generalExp } = this.state
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
								<ItemG xs={12}>
									<Button color={'primary'} fullWidth style={{ borderRadius: 0 }} onClick={this.handleAddDataSource}>
										{`${t('actions.add')} ${t('dashboard.fields.dataSource')}`}
									</Button>
								</ItemG>
							</ItemG>
						</ExpansionPanelDetails>

					</ExpansionPanel>

				</ItemG>
				<ItemG xs={12}>

					<ExpansionPanel
						expanded={false}
						square
						// onChange={this.handleAddDataSource}
						classes={{
							root: classes.expansionPanel
						}}
					>
						<Button style={{ textTransform: 'none', textAlign: 'left', width: '100%' }} onClick={this.handleAddDataSource}>
							<ExpansionPanelSummary className={classes.expandButton} expandIcon={<Add className={classes.icon} />}>
								<T>{`${t('actions.add')} ${t('dashboard.fields.dataSource')}`}</T>
							</ExpansionPanelSummary>
						</Button>
					</ExpansionPanel>

				</ItemG>
				{g.dataSources.map((ds, i) => {
					return <ItemG xs={12}><ExpansionPanel
						expanded={this.state['scorecard' + i]}
						square
						onChange={this.handleExpand('scorecard' + i)}
						classes={{
							root: classes.expansionPanel
						}}
					>
						<ExpansionPanelSummary expandIcon={<ExpandMore className={classes.icon} />}>
							<ItemG container justify={'space-between'} alignItems={'center'}>

								<T>{`${t('dashboard.fields.dataSource')}`}</T>
								<ITB
									onClick={this.handleRemoveDataSource(i)}
									size={'small'}
									label={t('actions.delete')}
									icon={<Delete />}
								/>
							</ItemG>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<ItemG container>
								<ItemG xs={12}>
									<AssignSensorDialog
										all
										t={t}
										open={this.state['openSensor' + i]}
										handleClose={this.handleExpand('openSensor' + i, false)}
										callBack={this.handleEditDevice(i)}
									/>
									<TextF
										id={'sensorChart'}
										label={t('dashboard.fields.device')}
										value={sensor ? sensor.name : t('no.device')}
										handleClick={this.handleExpand('openSensor' + i, true)}
										handleChange={() => { }}
									/>
								</ItemG>
								<Collapse unmountOnExit in={ds.deviceId > 0}>

									{ds.deviceId > 0 ?
										<Fragment>
											<ItemG xs={12}>
												<TextF
													handleChange={this.handleEditLabel(i)}
													autoFocus
													id={'label' + i}
													label={t('dashboard.fields.label')}
													value={ds.label}
													margin='normal'
												/>
											</ItemG>
											<ItemG xs={12}>
												<TextF
													handleChange={this.handleEditUnit(i)}
													autoFocus
													id={'unit' + i}
													label={t('dashboard.fields.unit')}
													value={ds.unit}
													margin='normal'
												/>
											</ItemG>
											<ItemG>
												<DSelect
													simple
													value={ds.dataKey}
													onChange={this.handleEditDataKey(i)}
													menuItems={sensor ? sensor.dataKeys ? sensor.dataKeys.map(dt => dt.key).filter((value, index, self) => self.indexOf(value) === index) : [] : []}
												/>
											</ItemG>
											<ItemG>
												<AssignCFDialog
													t={t}
													open={this.state['openCF' + i]}
													handleClose={this.handleExpand('openCF' + i, false)}
													callBack={this.handleEditCF(i)}
												/>
												<TextF
													id={'cfSelect'}
													label={t('dashboard.fields.cf')}
													value={cfs[cfs.findIndex(f => f.id === ds.cf)] ? cfs[cfs.findIndex(f => f.id === ds.cf)].name : t('no.function')}
													handleClick={this.handleExpand('openCF' + i, true)}
													handleChange={() => { }}
												/>
											</ItemG>

										</Fragment>
										: null}
								</Collapse>
							</ItemG>
						</ExpansionPanelDetails>

					</ExpansionPanel>
					</ItemG>
				})
				}

			</Fragment>
		)
	}
}

export default ESScorecard
