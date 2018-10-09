import {
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody
} from '@material-ui/core';
import React from 'react'

import TC from 'components/Table/TC';

class CollectionDevices extends React.Component {
	render() {
		const { devices, classes } = this.props
		return <Table className={classes.table}>
			<TableHead>
				<TableRow>
					<TableCell>Dessert (100g serving)</TableCell>
					<TableCell numeric>Calories</TableCell>
					<TableCell numeric>Fat (g)</TableCell>
					<TableCell numeric>Carbs (g)</TableCell>
					<TableCell numeric>Protein (g)</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{devices.map(row => {
					return (
						<TableRow key={row.id}>
							<TC label={row.name} />
							<TC label={row.id} />
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	}
}

export default CollectionDevices;
