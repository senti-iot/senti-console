import React, { useState, Fragment } from 'react'
import { Table, TableHead, TableRow, TableCell, TableBody, makeStyles } from '@material-ui/core';
import TP from 'components/Table/TP';
import { InfoCard, ItemG, Link } from 'components';
import { DeviceHub, CheckCircle, Block, SignalWifi2Bar } from 'variables/icons';
import { red, green } from '@material-ui/core/colors';
import { useSelector } from 'react-redux'
import { useLocalization } from 'hooks';

const styles = makeStyles(theme => ({
	blocked: {
		color: red[500],
		marginRight: 8
	},
	allowed: {
		color: green[500],
		marginRight: 8
	}
}))

const RegistryDevices = props => {
	//Hooks
	const t = useLocalization()
	const classes = styles()

	//Redux
	const rowsPerPage = useSelector(store => store.appState.trp ? store.appState.trp : store.settings.trp)

	//State
	const [page, setPage] = useState(0)

	//Const
	const { devices, registry } = props

	//useCallbacks

	//useEffects

	//Handlers

	const handleChangePage = (event, page) => {
		setPage(page)
	}

	const renderCommunication = (val) => {
		switch (val) {
			case 0:
				return <ItemG container><Block className={classes.blocked} /> {t('sensors.fields.communications.blocked')}</ItemG>
			case 1:
				return <ItemG container><CheckCircle className={classes.allowed} /> {t('sensors.fields.communications.allowed')}</ItemG>
			default:
				break;
		}
	}

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
									<TableRow key={d.uuid}>
										<TableCell style={{ paddingLeft: 24 }} component="th" scope="row">
											{/* `/sensor/${d.uuid}`} */}
											<Link to={{ pathname: `/sensor/${d.uuid}`, prevURL: `/registry/${registry.uuid}` }}>
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

export default RegistryDevices
