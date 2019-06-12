import { withStyles } from '@material-ui/core';
import deviceTypeStyles from 'assets/jss/views/deviceStyles';
import { ItemG, Info } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { DataUsage } from 'variables/icons';
import { connect } from 'react-redux'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class DeviceTypeMetadata extends Component {

	render() {
		const { deviceType, t } = this.props
		let mtd = deviceType.metadata
		return (
			<InfoCard
				title={t('sensors.fields.metadata')}
				avatar={<DataUsage />}
				noExpand
				content={
					<ItemG container spacing={16}>
						<ItemG xs={12}>
							{/* <Caption>{t('devicetypes.fields.structure.name')}</Caption> */}
							{Object.keys(mtd).length > 0 ? <Table>
								<TableHead>
									<TableRow>
										<TableCell>{t('cloudfunctions.fields.metadata.key')}</TableCell>
										<TableCell>{t('cloudfunctions.fields.metadata.defaultValue')}</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									 {Object.keys(mtd).map(s => {
										return  <TableRow key={s}>
											<TableCell>
												{mtd[s].key}
											</TableCell>
											<TableCell>
												{mtd[s].value}
											</TableCell>
										</TableRow>
									})}
								</TableBody>
							</Table> : <Info>{t('no.metadata')}</Info>}
						</ItemG>
					</ItemG>} />
		)
	}
}

const mapStateToProps = (state) => ({
	detailsPanel: state.settings.detailsPanel
})

export default connect(mapStateToProps)(withStyles(deviceTypeStyles)(DeviceTypeMetadata))