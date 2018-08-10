import React, { Component } from 'react'
import { Grid, IconButton, Menu, MenuItem, withStyles } from '@material-ui/core';
import { ItemGrid, Info } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import { MoreVert, Edit, DeveloperBoard } from '@material-ui/icons'
import Caption from 'components/Typography/Caption';
import deviceStyles from 'assets/jss/views/deviceStyles';

class DeviceHardware extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 actionAnchor: null
	  }
	}
	handleOpenActionsHardware = e => {
		this.setState({ actionAnchor: e.currentTarget })
	}
	handleCloseActionsHardware = e => {
		this.setState({ actionAnchor: null })
	}

	render() {
		const { actionAnchor } = this.state
		const { classes, device, t  } = this.props
		return (
			<InfoCard
				title={t("devices.hardware")}
				avatar={<DeveloperBoard />}
				subheader={''}
				topAction={
					<ItemGrid>
						<IconButton
							aria-label="More"
							aria-owns={actionAnchor ? 'long-menu' : null}
							aria-haspopup="true"
							onClick={this.handleOpenActionsHardware}>
							<MoreVert />
						</IconButton>
						<Menu
							id="long-menu"
							anchorEl={actionAnchor}
							open={Boolean(actionAnchor)}
							onClose={this.handleCloseActionsHardware}
							PaperProps={{
								style: {
									maxHeight: 200,
									minWidth: 200
								}
							}}>
							<MenuItem onClick={() => this.props.history.push(`${this.props.match.url}/edit-hardware`)}>
								<Edit className={classes.leftIcon} />Edit hardware info
							</MenuItem>
							))}
						</Menu>
					</ItemGrid>
				}
				content={
					<Grid container>
						<Grid container >
							<ItemGrid xs>
								<Caption>{t("devices.fields.pcModel")}:</Caption>
								<Info>{device.RPImodel}</Info>
							</ItemGrid>
							<ItemGrid xs>
								<Caption>{t("devices.fields.memory")}:</Caption>
								<Info>{device.memory + " - " + device.memoryModel}</Info>
							</ItemGrid>
							<ItemGrid xs>
								<Caption>{t("devices.fields.adapter")}:</Caption>
								<Info>{device.adapter}</Info>
							</ItemGrid>
						</Grid>
						<Grid container>
							<ItemGrid xs>
								<Caption>{t("devices.fields.wifiModule")}:</Caption>
								<Info>{device.wifiModule}</Info>
							</ItemGrid>
							<ItemGrid xs>
								<Caption>{t("devices.fields.modemModel")}:</Caption>
								<Info>{device.modemModel}</Info>
							</ItemGrid>
						</Grid>
					</Grid>
				}
				hiddenContent={<Grid container>
					<ItemGrid>
						<Caption>{t("devices.fields.cellNumber")}:</Caption>
						<Info>{device.cellNumber}</Info>
					</ItemGrid>
					<ItemGrid>
						<Caption>{t("devices.fields.simProvider")}:</Caption>
						<Info>{device.SIMProvider}</Info>
					</ItemGrid>
					<ItemGrid>
						<Caption>{t("devices.fields.simCard")}:</Caption>
						<Info>{device.SIMID}</Info>
					</ItemGrid>
					<ItemGrid>
						<Caption>{t("devices.fields.modemIMEI")}:</Caption>
						<Info>{device.modemIMEI}</Info>
					</ItemGrid>

				</Grid>
				}
			/>
		)
	}
}
export default withStyles(deviceStyles)(DeviceHardware)