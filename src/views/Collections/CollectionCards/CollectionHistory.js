import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { InfoCard, Caption } from 'components';
import React from 'react';
import { dateFormatter } from 'variables/functions';
import { History } from 'variables/icons';

class CollectionHistory extends React.Component {
	render() {
		
		const { collection, t } = this.props
		// console.log(collection);
		return <InfoCard
			noExpand
			title={t("collections.cards.log")}
			avatar={<History />}
			content={collection.devices.length > 0 ? <Table>
				<TableHead>
					<TableRow>
						<TableCell>Device Name</TableCell>
						<TableCell>Device id</TableCell>
						<TableCell>Start date</TableCell>
						<TableCell>End date</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{collection.devices.map((c, i) => {
						return (
							<TableRow key={i}>
								<TableCell>{c.name ? c.name : this.props.t("devices.noName")} </TableCell>
								<TableCell>{c.id} </TableCell>
								<TableCell>{dateFormatter(c.start)} </TableCell>
								<TableCell>{dateFormatter(c.end)}</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table> : <Caption>{t("collections.noHistory")}</Caption>}
		/>
	}
}

export default CollectionHistory;
