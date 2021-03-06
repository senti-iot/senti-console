import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { InfoCard, Caption } from 'components';
import React from 'react';
import { dateTimeFormatter } from 'variables/functions';
import { History } from 'variables/icons';
import { useLocalization } from 'hooks'

const CollectionHistory = props => {
	const t = useLocalization()

	const { collection } = props
	return <InfoCard
		noExpand
		title={t('collections.cards.log')}
		avatar={<History />}
		content={collection.devices.length > 0 ? <Table>
			<TableHead>
				<TableRow>
					{/* <TableCell>Device Name</TableCell> */}
					<TableCell>{t('collections.fields.deviceId')}</TableCell>
					<TableCell>{t('collections.fields.activated')}</TableCell>
					<TableCell>{t('collections.fields.endOfService')}</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{collection.devices.map((c, i) => {
					return (
						<TableRow key={i}>
							{/* <TableCell>{c.name ? c.name : this.props.t('devices.noName')} </TableCell> */}
							<TableCell>{c.id} </TableCell>
							<TableCell>{dateTimeFormatter(c.start)} </TableCell>
							<TableCell>{dateTimeFormatter(c.end)}</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table> : <Caption>{t('no.history')}</Caption>}
	/>
}

export default CollectionHistory;
