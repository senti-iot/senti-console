import React, { useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { /* Button, Collapse, */ TableRow, TableBody, Table, Hidden, TableCell, Typography, TableHead } from '@material-ui/core';
import { Caption, InfoCard, ItemG, ItemGrid, Info, GridContainer } from 'components';
import { /* Map, ExpandMore, */ DataUsage, SignalWifi2BarLock, SignalWifi2Bar } from 'variables/icons'
// import { Maps } from 'components/Map/Maps';
// import classNames from 'classnames'
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles'
import { dateFormatter } from 'variables/functions';
import TP from 'components/Table/TP';
import TC from 'components/Table/TC';
import { useSelector } from 'react-redux'
import { useLocalization, useHistory } from 'hooks';

// const mapStateToProps = (state) => ({
// 	rowsPerPage: state.appState.trp ? state.appState.trp : state.settings.trp,
// })

// @Andrei
const ProjectCollections = props => {
	const t = useLocalization()
	const rowsPerPage = useSelector(state => state.appState.trp ? state.appState.trp : state.settings.trp)
	const classes = devicetableStyles()
	const history = useHistory()

	// const [mapExpanded, setMapExpanded] = useState(false)
	// const [openUnassign, setOpenUnassign] = useState(false)
	const [page, setPage] = useState(0)
	// constructor(props) {
	// 	super(props)
	// 	this.state = {
	// 		mapExpanded: false,
	// 		openUnassign: false,
	// 		page: 0,
	// 	}
	// }
	const handleChangePage = (event, newpage) => {
		setPage(newpage)
		// this.setState({ page })
	}
	// const handleExtendMap = () => {
	// 	setMapExpanded(!mapExpanded)
	// 	// this.setState({ mapExpanded: !this.state.mapExpanded })
	// }
	// const renderMapButton = () => {
	// 	// const { classes, t } = this.props
	// 	return <Button className={classes.leftActionButton} onClick={handleExtendMap}>
	// 		<Map className={classes.leftIcon} />
	// 		<Caption>
	// 			{mapExpanded ? t('projects.collections.hideMap') : t('projects.collections.seeMap')}
	// 		</Caption>
	// 		<ExpandMore className={classNames({
	// 			[classes.expandOpen]: mapExpanded,
	// 		}, classes.expand)} />
	// 	</Button>
	// }
	// const renderMap = () => {
	// 	const { project } = props
	// 	return <Collapse in={mapExpanded} timeout='auto' unmountOnExit>
	// 		<Maps markers={project.collections} t={t} />
	// 	</Collapse>
	// }
	const renderNoCollections = () => {
		return <GridContainer justify={'center'}>
			<Caption> {t('no.collections')}</Caption>
		</GridContainer>
	}
	const renderDeviceStatus = (status) => {
		// const { classes } = this.props
		switch (status) {
			case 1:
				return <SignalWifi2Bar className={classes.yellowSignal} />
			case 2:
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
	const renderStatus = () => {
		return <DataUsage style={{ marginRight: 8 }} />
	}

	const { project } = props
	const { dataCollections } = project
	// const { page } = this.state
	return (
		<InfoCard title={t('collections.pageTitle')} avatar={<DataUsage />}
			noRightExpand
			noPadding
			content={
				project.dataCollections.length > 0 ?
					<Fragment>
						<Table>
							<TableHead>
								<TableRow >
									<TableCell padding='checkbox'>
										{/* <ItemG container justify={'center'}>
												{t('collections.fields.ownState')}
											</ItemG>
											<ItemG container justify={'center'}>
												({t('collections.fields.collection')})
											</ItemG> */}
									</TableCell>
									<TableCell>
										{t('collections.fields.name')}
									</TableCell>
									<Hidden mdDown>
										<TableCell padding={'checkbox'}>
											<ItemG container justify={'center'}>
												{t('collections.fields.status')}
											</ItemG>
										</TableCell>
										<TableCell>
											{t('collections.fields.created')}
										</TableCell>
										<TableCell>
											{t('collections.fields.org')}
										</TableCell>
									</Hidden>
								</TableRow>
							</TableHead>
							<TableBody onMouseLeave={() => props.setHoverID(0)}>
								{dataCollections ? dataCollections.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((n, i) => {
									return (
										<TableRow
											onMouseEnter={() => props.setHoverID(n.id)}
											hover
											onClick={e => { e.stopPropagation(); history.push({ pathname: '/collection/' + n.id, prevURL: `/project/${project.id}` }) }}
											key={i}
											style={{ cursor: 'pointer' }}
										>
											<Hidden lgUp>
												<TableCell padding='checkbox' className={classes.tablecellcheckbox + ' ' + classes.paddingLeft}>
													<ItemG container justify={'center'} >
														<div style={{ color: n.color }}>
															{renderStatus()}
														</div>
													</ItemG>
												</TableCell>
												<TableCell classes={{ root: classes.tableCell }}>
													<ItemGrid container zeroMargin noPadding alignItems={'center'}>
														<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
															<Info noWrap paragraphCell={classes.noMargin}>
																{`${n.name}`}
															</Info>
														</ItemGrid>
														<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
															<Caption noWrap className={classes.noMargin}>
																{`${t('collections.fields.id')}: ${n.id}`}
															</Caption>
														</ItemGrid>
													</ItemGrid>
												</TableCell>
											</Hidden>
											<Hidden mdDown>
												<TableCell padding='checkbox' className={classes.tablecellcheckbox}>
													<ItemG container justify={'center'}>
														<div style={{ color: n.color }}>
															{renderStatus()}
														</div>
													</ItemG>
												</TableCell>
												<TC /* FirstC */ label={n.name} />
												<TC FirstC content={n.activeDevice ? <ItemG container justify={'center'}>
													{renderDeviceStatus(n.activeDevice.liveStatus)}
												</ItemG>
													: null
												} />
												<TC label={dateFormatter(n.created)} />
												<TC label={n.org.name} />
											</Hidden>
										</TableRow>

									)
								}) : null}
							</TableBody>
						</Table>
						<TP
							component={'div'}
							count={dataCollections.length}
							page={page}
							rowsPerPage={rowsPerPage}
							handleChangePage={handleChangePage}
							// handleChangeRowsPerPage={handleChangeRowsPerPage}
							classes={classes}
							t={t}
						/>
					</Fragment>
					: renderNoCollections()
			}

		/>
	)
}

ProjectCollections.propTypes = {
	project: PropTypes.object.isRequired,
}

export default ProjectCollections
