import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Collapse, /* Grid, */ withStyles } from '@material-ui/core';
import { Caption, InfoCard, ItemG } from 'components';
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
	renderMapButton = () => {
		const { classes, t } = this.props
		return <Button className={classes.leftActionButton} onClick={this.handleExtendMap}>
			<Map className={classes.leftIcon} />
			<Caption>
				{this.state.mapExpanded ? t("projects.devices.hideMap") : t("projects.devices.seeMap")}
			</Caption>
			<ExpandMore className={classNames({
				[classes.expandOpen]: this.state.mapExpanded,
			}, classes.expand)} />
		</Button>
	}
	renderMap = () => { 
		const { project, t } = this.props
		return <Collapse in={this.state.mapExpanded} timeout="auto" unmountOnExit>
			<Maps markers={project.devices} t={t} />
		</Collapse>
	}
	renderNoDevices= () => {
		return <ItemG container justify={'center'}>
			<Caption> {this.props.t("devices.noDevicesAssigned")}</Caption>
		</ItemG>
	}
	render() {
		const { project, t /* deviceMostCounts */ } = this.props
		console.log(project.devices)
		return (
			<InfoCard title={t("projects.devices.title")} avatar={<Devices />}
				subheader={project.devices.length > 0 ? t("projects.devices.numDevices") + project.devices.length : null}
				leftActions={project.devices.length > 0  ? this.renderMapButton() : null}
				leftActionContent={project.devices.length > 0 ?  this.renderMap() : null}
				noRightExpand
				content={
					project.devices.length > 0 ? <DeviceSimpleList t={t} filters={this.state.deviceFilters} data={project.devices} /> : this.renderNoDevices()
				}
			
			/>
		)
	}
}

ProjectDevices.propTypes = {
	project: PropTypes.object.isRequired,
}

export default withStyles(deviceStyles)(ProjectDevices)
