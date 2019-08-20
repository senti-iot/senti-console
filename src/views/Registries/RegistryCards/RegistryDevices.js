import React, { Component, Fragment } from 'react'
import { Table, TableHead, TableRow, TableCell, TableBody, withStyles } from '@material-ui/core';
import TP from 'components/Table/TP';
import { InfoCard, ItemG } from 'components';
import { DeviceHub, CheckCircle, Block, SignalWifi2Bar } from 'variables/icons';
import { red, green } from '@material-ui/core/colors';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

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

class RegistryDevices extends Component {
	constructor(props) {
		super(props)

		this.state = {
			page: 0
		}
	}

	handleChangePage = (event, page) => {
		this.setState({ page });
	}
	renderCommunication = (val) => {
		const { t, classes } = this.props
		switch (val) {
			case 0:
				return <ItemG container><Block className={classes.blocked} /> {t('sensors.fields.communications.blocked')}</ItemG>
			case 1:
				return <ItemG container><CheckCircle className={classes.allowed} /> {t('sensors.fields.communications.allowed')}</ItemG>
			default:
				break;
		}
	}
	render() {
		const { devices, t, rowsPerPage } = this.props
		const { page } = this.state
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
											<SignalWifi2Bar style={{ marginRight: 8 }}/>
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
												{this.renderCommunication(d.communication)}
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
							handleChangePage={this.handleChangePage}
						/>
					</Fragment>
				} />
		)
	}
}
const mapStateToProps = (state) => ({
	rowsPerPage: state.appState.trp ? state.appState.trp : state.settings.trp,
	hoverTime: state.settings.hoverTime
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RegistryDevices))
