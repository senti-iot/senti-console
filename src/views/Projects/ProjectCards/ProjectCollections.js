import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Collapse, /* Grid, */ withStyles, TableRow, TableBody, Table, Hidden, TableCell, Typography, TableHead } from '@material-ui/core';
import { Caption, InfoCard, ItemG, ItemGrid, Info } from 'components';
import { Map, ExpandMore, DataUsage, SignalWifi2BarLock, SignalWifi2Bar } from 'variables/icons'
import { Maps } from 'components/Map/Maps';
// import CollectionSimpleList from 'components/Collections/CollectionSimpleList';
import classNames from 'classnames'
import devicetableStyles from "assets/jss/components/devices/devicetableStyles"
import { dateFormatter } from 'variables/functions';

class ProjectCollections extends Component {
	constructor(props) {
		super(props)

		const { t } = props
		this.state = {
			mapExpanded: false,
			tableHead: [{ id: "name", label: t("collections.fields.name") },
				{ id: "activeDevice.liveStatus", label: t("collections.fields.status") },
				{ id: "created", label: t("collections.fields.created") },
				{ id: "devices[0].start", label: t("collections.fields.activeDeviceStartDate") },
				{ id: "org.name", label: t("collections.fields.org") }],
			openUnassign: false
		}
	}

	handleExtendMap = () => {
		this.setState({ mapExpanded: !this.state.mapExpanded })
	}
	renderMapButton = () => {
		const { classes, t } = this.props
		return <Button className={classes.leftActionButton} onClick={this.handleExtendMap}>
			<Map className={classes.leftIcon} />
			<Caption>
				{this.state.mapExpanded ? t("projects.collections.hideMap") : t("projects.collections.seeMap")}
			</Caption>
			<ExpandMore className={classNames({
				[classes.expandOpen]: this.state.mapExpanded,
			}, classes.expand)} />
		</Button>
	}
	renderMap = () => {
		const { project, t } = this.props
		return <Collapse in={this.state.mapExpanded} timeout="auto" unmountOnExit>
			<Maps markers={project.collections} t={t} />
		</Collapse>
	}
	renderNoCollections = () => {
		return <ItemG container justify={'center'}>
			<Caption> {this.props.t("collections.noCollectionsAssigned")}</Caption>
		</ItemG>
	}
	renderDeviceStatus = (status) => {
		const { classes } = this.props
		switch (status) {
			case 2:
				return <SignalWifi2Bar className={classes.yellowSignal} />
			case 1:
				return <SignalWifi2Bar className={classes.greenSignal} />
			case 0:
				return <SignalWifi2Bar className={classes.redSignal} />
			case null:
				return <div>
					<SignalWifi2BarLock className={classes.redSignal} />
					<Typography>
						Error
					</Typography>
				</div>
			default:
				break;
		}
	}
	renderStatus = (status) => {
		const { classes } = this.props
		switch (status) {
			case 2:
				return <DataUsage className={classes.yellowSignal} />
			case 1:
				return <DataUsage className={classes.greenSignal} />
			case 0:
				return <DataUsage className={classes.redSignal} />
			case null:
				return <div>
					<SignalWifi2BarLock className={classes.redSignal} />
					<Typography>
						Error
					</Typography>
				</div>
			default:
				break;
		}
	}
	render() {
		const { project, t, classes /* collectionMostCounts */ } = this.props
		const { dataCollections } = project
		console.log(dataCollections)
		return (
			<InfoCard title={t("collections.pageTitle")} avatar={<DataUsage />}
				// subheader={project.dataCollections.length > 0 ? t("projects.collections.numCollections") + project.dataCollections.length : null}
				noRightExpand
				noPadding
				content={
					project.dataCollections.length > 0 ?
						<Table>
							<TableHead>
								<TableRow>
									<TableCell className={classes.tablecellcheckbox}>
										<ItemG container justify={"center"}>
											{t("collections.fields.ownState")}
										</ItemG>
									</TableCell>
									<TableCell classes={{ root: classes.tableCell }}>
										<ItemG container justify={'center'}>
											{t("collections.fields.name")}
										</ItemG>
									</TableCell>
									<Hidden mdDown>
										<TableCell padding={'checkbox'} classes={{ root: classes.tableCell }}>
											<ItemG container justify={"center"}>
												{t("collections.fields.status")}
											</ItemG>
										</TableCell>
										<TableCell classes={{ root: classes.tableCell }}>
											<ItemG container justify={"center"}>
												{t("collections.fields.created")}
											</ItemG>
										</TableCell>
										<TableCell classes={{ root: classes.tableCell }}>
											<ItemG container justify={"center"}>
												{t("collections.fields.org")}
											</ItemG>
										</TableCell>
									</Hidden>
								</TableRow>
							</TableHead>
							<TableBody>
								{dataCollections ? dataCollections.map((n, i) => {
									return (
										<TableRow
											hover
											onClick={e => { e.stopPropagation(); this.props.history.push({ pathname: '/collection/' + n.id, prevURL: `/project/${project.id}` }) }}
											key={i}
											style={{ cursor: 'pointer' }}
										>
											<Hidden lgUp>
												<TableCell padding="checkbox" className={classes.tablecellcheckbox}>
													<ItemG container justify={"center"}>
														{this.renderStatus(n.state)}
													</ItemG>
												</TableCell>
												<TableCell classes={{ root: classes.tableCell }}>
													<ItemGrid container zeroMargin noPadding alignItems={"center"}>
														<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
															<Info noWrap paragraphCell={classes.noMargin}>
																{`${n.name}`}
															</Info>
														</ItemGrid>
														<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
															<Caption noWrap className={classes.noMargin}>
																{`${t("collections.fields.id")}: ${n.id}`}
															</Caption>
														</ItemGrid>
													</ItemGrid>
												</TableCell>
											</Hidden>
											<Hidden mdDown>
												<TableCell padding="checkbox" className={classes.tablecellcheckbox}>
													<ItemG container justify={"center"}>
														{this.renderStatus(n.state)}
													</ItemG>
												</TableCell>
												<TableCell padding="checkbox">
													<ItemG container justify={"center"}>
														{n.name}	
													</ItemG>
												</TableCell>
												<TableCell padding="checkbox">
													<ItemG container justify={"center"}>
														{this.renderDeviceStatus(n.activeDevice.liveStatus)}
													</ItemG>
												</TableCell>
												<TableCell padding="checkbox">
													<ItemG container justify={"center"}>
														{dateFormatter(n.created)}
													</ItemG>
												</TableCell>
												<TableCell padding="checkbox">
													<ItemG container justify={"center"}>
														{n.org.name}
													</ItemG>
												</TableCell>
											</Hidden>
										</TableRow>

									)
								}) : null}
							</TableBody>
						</Table>
						: this.renderNoCollections()
				}

			/>
		)
	}
}

ProjectCollections.propTypes = {
	project: PropTypes.object.isRequired,
}

export default withStyles(devicetableStyles)(ProjectCollections)
