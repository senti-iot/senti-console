import { withStyles } from '@material-ui/core';
import deviceTypeStyles from 'assets/jss/views/deviceStyles';
import { ItemG, Info } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import React from 'react';
// import { Link } from 'react-router-dom';
import { StorageIcon } from 'variables/icons';
// import { useSelector } from 'react-redux'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useLocalization } from 'hooks';

// const mapStateToProps = (state) => ({
// 	detailsPanel: state.settings.detailsPanel
// })

// @Andrei
const DeviceTypeMetadata = props => {
	const t = useLocalization()
	// const detailsPanel = useSelector(state => state.settings.detailsPanel)

	const { deviceType } = props
	let mtd = deviceType.metadata
	return (
		<InfoCard
			title={t('sensors.fields.metadata')}
			avatar={<StorageIcon />}
			noExpand
			content={
				<ItemG container spacing={3}>
					<ItemG xs={12}>
						{mtd ? <Table>
							<TableHead>
								<TableRow>
									<TableCell>{t('cloudfunctions.fields.metadata.key')}</TableCell>
									<TableCell>{t('cloudfunctions.fields.metadata.defaultValue')}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{mtd.map(s => {
									return <TableRow key={s.key}>
										<TableCell>
											{s.key}
										</TableCell>
										<TableCell>
											{s.value}
										</TableCell>
									</TableRow>
								})}
							</TableBody>
						</Table> : <Info>{t('no.metadata')}</Info>}
					</ItemG>
				</ItemG>} />
	)
}

export default withStyles(deviceTypeStyles)(DeviceTypeMetadata)