import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Collapse, /* Grid, */ withStyles } from '@material-ui/core';
import { Caption, InfoCard, /*  ItemGrid, Info */ } from 'components';
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
		const { classes, project, t /* deviceMostCounts */ } = this.props
		return (
			<InfoCard title={t("projects.devices.title")} avatar={<Devices />} subheader={t("projects.devices.numDevices") + project.devices.length}
				leftActions={
					<Button className={classes.leftActionButton} onClick={this.handleExtendMap}>
						<Map className={classes.leftIcon} />
						<Caption>
							{this.state.mapExpanded ? t("projects.devices.hideMap") : t("projects.devices.seeMap")}
						</Caption>
						<ExpandMore className={classNames({
							[classes.expandOpen]: this.state.mapExpanded,
						}, classes.expand)} />
					</Button>
				}
				leftActionContent={
					<Collapse in={this.state.mapExpanded} timeout="auto" unmountOnExit>
						<Maps markers={project.devices} t={t}/>
					</Collapse>
				}
				noRightExpand
				content={
					<DeviceSimpleList t={t} filters={this.state.deviceFilters} data={project.devices} />
				}
			
			/>
		)
	}
}

ProjectDevices.propTypes = {
	project: PropTypes.object.isRequired,
}

export default withStyles(deviceStyles)(ProjectDevices)
