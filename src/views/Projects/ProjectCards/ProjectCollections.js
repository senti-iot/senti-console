import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button, Collapse, /* Grid, */ withStyles, TableRow, TableBody, Table, Hidden, TableCell, Typography, TableHead } from '@material-ui/core';
import { Caption, InfoCard, ItemG, ItemGrid, Info } from 'components';
import { Map, ExpandMore, DataUsage, SignalWifi2BarLock, SignalWifi2Bar } from 'variables/icons'
import { Maps } from 'components/Map/Maps';
// import CollectionSimpleList from 'components/Collections/CollectionSimpleList';
import classNames from 'classnames'
import devicetableStyles from "assets/jss/components/devices/devicetableStyles"
import { dateFormatter } from 'variables/functions';
import TP from 'components/Table/TP';
import TC from 'components/Table/TC';

class ProjectCollections extends Component {
	constructor(props) {
		super(props)

		// const { t } = props
		this.state = {
			mapExpanded: false,
			openUnassign: false,
			page: 0,
			rowsPerPage: 5
		}
	}
	handleChangePage = (event, page) => {
		this.setState({ page })
	}
	handleChangeRowsPerPage = event => {
		this.setState({ rowsPerPage: event.target.value })
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
		const { page, rowsPerPage } = this.state
		return (
			<InfoCard title={t("collections.pageTitle")} avatar={<DataUsage />}
				// subheader={project.dataCollections.length > 0 ? t("projects.collections.numCollections") + project.dataCollections.length : null}
				noRightExpand
				noPadding
				content={
					project.dataCollections.length > 0 ?
						<Fragment>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell className={classes.tablecellcheckbox + " " + classes.paddingLeft}>
											{t("collections.fields.ownState")}
										</TableCell>
										<TableCell classes={{ root: classes.tableCell }}>
											{t("collections.fields.name")}
										</TableCell>
										<Hidden mdDown>
											<TableCell padding={'checkbox'} classes={{ root: classes.tableCell }}>
												{t("collections.fields.status")}
											</TableCell>
											<TableCell classes={{ root: classes.tableCell }}>
												{t("collections.fields.created")}
											</TableCell>
											<TableCell classes={{ root: classes.tableCell }}>
												{t("collections.fields.org")}
											</TableCell>
										</Hidden>
									</TableRow>
								</TableHead>
								<TableBody>
									{dataCollections ? dataCollections.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((n, i) => {
										return (
											<TableRow
												hover
												onClick={e => { e.stopPropagation(); this.props.history.push({ pathname: '/collection/' + n.id, prevURL: `/project/${project.id}` }) }}
												key={i}
												style={{ cursor: 'pointer' }}
											>
												<Hidden lgUp>
													<TableCell padding="checkbox" className={classes.tablecellcheckbox + " " + classes.paddingLeft}>
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
													<TableCell padding="checkbox" className={classes.tablecellcheckbox + " " + classes.paddingLeft}>
														<ItemG container justify={"center"}>
															{this.renderStatus(n.state)}
														</ItemG>
													</TableCell>
													<TC FirstC label={n.name}/>
													<TC content={<div style={{ paddingLeft: 25 }}>
														{this.renderDeviceStatus(n.activeDevice.liveStatus)}
													</div>
													}/>
													<TC label={dateFormatter(n.created)}/>
													<TC label={n.org.name}/>
												</Hidden>
											</TableRow>

										)
									}) : null}
								</TableBody>
							</Table>
							<TP
								component={'div'}
								count={dataCollections.length}
								page={this.state.page}
								rowsPerPage={this.state.rowsPerPage}
								handleChangePage={this.handleChangePage}
								handleChangeRowsPerPage={this.handleChangeRowsPerPage}
								classes={classes}
								t={t}
							/>
						</Fragment>
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