import { withStyles } from '@material-ui/core';
import deviceTypeStyles from 'assets/jss/views/deviceStyles';
import { ItemG, CircularLoader, Info } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { CloudUpload } from 'variables/icons';
import { connect } from 'react-redux'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Link } from 'react-router-dom'

class DeviceTypeCloudFunctions extends Component {
	renderType = (type) => {
		const { t } = this.props
		switch (type) {
			case 0:
				return t('cloudfunctions.datatypes.timeSeries')
			case 1:
				return t('cloudfunctions.datatypes.average')
			default:
				break;
		}
	}
	render() {
		const { deviceType, t, cloudfunctions, loading } = this.props
		let cfi = deviceType.inbound
		let cfo = deviceType.outbound
		let cf = cloudfunctions
		return (
			<InfoCard
				title={t('sidebar.cloudfunctions')}
				avatar={<CloudUpload />}
				noExpand
				content={
					loading ? <CircularLoader /> : <ItemG container spacing={3}>
						<ItemG xs={12}>
							<Info>{t('cloudfunctions.fields.inboundfunc')}</Info>
							{cfi ? <Table>
								<TableHead>
									<TableRow>
										<TableCell>{t('cloudfunctions.fields.types.inbound')}</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{cfi.map((s, i) => {
										return <TableRow key={i + 'outbound'}>
											<TableCell>
												<Link to={{ pathname: `/function/${s.nId}`, prevURL: `/devicetype/${deviceType.id}` }}>
													{cf[cf.findIndex(f => f.id === s.nId)] ? cf[cf.findIndex(f => f.id === s.nId)].name : s.nId}
												</Link>
											</TableCell>

										</TableRow>
									})}
								</TableBody>
							</Table> : <Info>{t('no.deviceInboundFunc')}</Info>}
						</ItemG>
						<ItemG xs={12}>
							<Info>{t('cloudfunctions.fields.keys')}</Info>
							{cfo ? <Table>
								<TableHead>
									<TableRow>
										<TableCell>{t('cloudfunctions.fields.key')}</TableCell>
										<TableCell>{t('cloudfunctions.fields.types.outbound')}</TableCell>
										<TableCell>{t('cloudfunctions.fields.type')}</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{cfo.map((s, i) => {
										return <TableRow key={i + 'inbound'}>
											<TableCell>
												{s.key}
											</TableCell>
											<TableCell>
												<Link to={{ pathname: `/function/${s.nId}`, prevURL: `/devicetype/${deviceType.id}` }}>
													{s.nId > 0 ? cf[cf.findIndex(f => f.id === s.nId)].name : '-'}
												</Link>
											</TableCell>
											<TableCell>
												{this.renderType(s.type)}
											</TableCell>
										</TableRow>
									})}
								</TableBody>
							</Table> : <Info>{t('no.deviceDataKeys')}</Info>}
						</ItemG>
					</ItemG>} />)
	}
}

const mapStateToProps = (state) => ({
	detailsPanel: state.settings.detailsPanel,
	cloudfunctions: state.data.functions,
	loading: !state.data.gotfunctions
})

export default connect(mapStateToProps)(withStyles(deviceTypeStyles)(DeviceTypeCloudFunctions))