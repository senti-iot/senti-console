import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Collapse, Grid, withStyles } from '@material-ui/core';
import { Caption, InfoCard, ItemGrid, Info } from 'components';
import { Devices, Map, ExpandMore } from '@material-ui/icons'
import { Maps } from 'components/Map/Maps';
import DeviceSimpleList from 'components/List/DeviceSimpleList/DeviceSimpleList';
import classNames from 'classnames'
import deviceStyles from 'assets/jss/views/deviceStyles';

class ProjectDevices extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 mapExpanded: false
	  }
	}
	handleExtendMap = () => {
		this.setState({ mapExpanded: !this.state.mapExpanded })
	}
	render() {
		const { classes, project, deviceMostCounts } = this.props
		return (
			<InfoCard title={"Devices"} avatar={<Devices />} subheader={"Number of devices:" + project.devices.length}
				leftActions={
					<Button className={classes.leftActionButton} onClick={this.handleExtendMap}>
						<Map className={classes.leftIcon} />
						<Caption>
							{this.state.mapExpanded ? "Hide Map" : "See Map"}
						</Caption>
						<ExpandMore className={classNames(classes.expand, {
							[classes.expandOpen]: this.state.mapExpanded,
						})} />
					</Button>
				}
				leftActionContent={
					<Collapse in={this.state.mapExpanded} timeout="auto" unmountOnExit>
						<Maps markers={project.devices} />
					</Collapse>
				}
				content={
					<Grid container>
						<ItemGrid>
							<Caption>
								Most active device:
							</Caption>
							<Info>
								{deviceMostCounts ? deviceMostCounts.device_name ? deviceMostCounts.device_name : deviceMostCounts.device_id : "-"}
							</Info>
						</ItemGrid>
						<ItemGrid>
							<Caption>
								Hits by most active device:
							</Caption>
							<Info>
								{deviceMostCounts ? deviceMostCounts.totalCount : "-"}
							</Info>
						</ItemGrid>
					</Grid>
				}
				hiddenContent={
					<DeviceSimpleList filters={this.state.deviceFilters} data={project.devices} />
				}
			/>
		)
	}
}
ProjectDevices.propTypes = {
	project: PropTypes.object.isRequired,
}
export default withStyles(deviceStyles)(ProjectDevices)
