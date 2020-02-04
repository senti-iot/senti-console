import React, { useState, Fragment } from 'react'
import { Table, TableHead, TableRow, TableCell, TableBody, withStyles } from '@material-ui/core';
import TP from 'components/Table/TP';
import { InfoCard, ItemG, Link } from 'components';
import { DeviceHub, CheckCircle, Block, SignalWifi2Bar } from 'variables/icons';
import { red, green } from '@material-ui/core/colors';
import { useSelector } from 'react-redux'
// import { Link } from 'react-router-dom'
import { useLocalization } from 'hooks';

// const mapStateToProps = (state) => ({
// 	rowsPerPage: state.appState.trp ? state.appState.trp : state.settings.trp,
// 	hoverTime: state.settings.hoverTime
// })

const styles = (theme) => ({
	blocked: {
		color: red[500],
		marginRight: 8
	},
	allowed: {
		color: green[500],
		marginRight: 8
	}
})

const RegistryDevices = props => {
	const rowsPerPage = useSelector(store => store.appState.trp ? store.appState.trp : store.settings.trp)
	// const hoverTime = useSelector(store => store.settings.hoverTime)

	const [page, setPage] = useState(0)
	const t = useLocalization()

	const handleChangePage = (event, page) => {
		setPage(page)
	}

	const renderCommunication = (val) => {
		const { classes } = props
		switch (val) {
			case 0:
				return <ItemG container><Block className={classes.blocked} /> {t('sensors.fields.communications.blocked')}</ItemG>
			case 1:
				return <ItemG container><CheckCircle className={classes.allowed} /> {t('sensors.fields.communications.allowed')}</ItemG>
			default:
				break;
		}
	}

	const { devices } = props
	return (
		<InfoCard
			title={t('sidebar.devices')}
			avatar={<DeviceHub />}
			noExpand
			content={
				<Fragment>

					<Table>
						<TableHead>
							<TableRow style={{ paddingLeft: 24 }}>
								<TableCell style={{ paddingLeft: 24 }}>{t('devices.fields.name')}</TableCell>
								<TableCell>
									<ItemG container>
										<SignalWifi2Bar style={{ marginRight: 8 }} />
										{t('sensors.fields.communication')}
									</ItemG>

								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{devices ? devices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(d => {
								return (
									<TableRow key={d.id}>
										<TableCell style={{ paddingLeft: 24 }} component="th" scope="row">
											<Link to={`/sensor/${d.id}`}>
												{d.name}
											</Link>
										</TableCell>
										<TableCell component="th" scope="row">
											{renderCommunication(d.communication)}
										</TableCell>
									</TableRow>
								);
							}) : null}
						</TableBody>
					</Table>
					<TP
						count={devices ? devices.length : 0}
						page={page}
						t={t}
						handleChangePage={handleChangePage}
					/>
				</Fragment>
			} />
	)
}

export default withStyles(styles)(RegistryDevices)
