import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/core';
import { ItemG, Info, Dropdown } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import { Edit, DeveloperBoard } from 'variables/icons'
import Caption from 'components/Typography/Caption';
import deviceStyles from 'assets/jss/views/deviceStyles';

class DeviceHardware extends PureComponent {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 actionAnchor: null
	  }
	}
	handleOpenActionsHardware = e => {
		this.setState({ actionAnchor: e.currentTarget })
	}
	handleCloseActionsHardware = () => {
		this.setState({ actionAnchor: null });
	}

	render() {
		const { classes, device, t  } = this.props
		return (
			<InfoCard
				title={t("devices.cards.hardware")}
				avatar={<DeveloperBoard />}
				subheader={''}
				haveMargin
				topAction={
					<Dropdown menuItems={
						[
							{ label: t("menus.edit"), icon: <Edit className={classes.leftIcon} />, func: () => this.props.history.push(`${this.props.match.url}/edit-hardware`) },
							// { label: t("actions.deletePicture"), icon: <Delete className={classes.leftIcon} />, func: this.handleOpenDeletePictureDialog },
						]
					} />
					// <ItemG>
					// 	<IconButton
					// 		aria-label="More"
					// 		aria-owns={actionAnchor ? 'long-menu' : null}
					// 		aria-haspopup="true"
					// 		onClick={this.handleOpenActionsHardware}>
					// 		<MoreVert />
					// 	</IconButton>
					// 	<Menu
					// 		id="long-menu"
					// 		anchorEl={actionAnchor}
					// 		open={Boolean(actionAnchor)}
					// 		onClose={this.handleCloseActionsHardware}
					// 		PaperProps={{
					// 			style: {
					// 				maxHeight: 200,
					// 				minWidth: 200
					// 			}
					// 		}}>
					// 		<MenuItem onClick={() => this.props.history.push(`${this.props.match.url}/edit-hardware`)}>
					// 			<Edit className={classes.leftIcon} />Edit hardware info
					// 		</MenuItem>
					// 		))}
					// 	</Menu>
					// </ItemG>
				}
				content={
					<ItemG container spacing={16}>
						<ItemG>
							<Caption>{t("devices.fields.pcModel")}:</Caption>
							<Info>{device.RPImodel}</Info>
						</ItemG>
						<ItemG>
							<Caption>{t("devices.fields.memory")}:</Caption>
							<Info>{device.memory + " - " + device.memoryModel}</Info>
						</ItemG>
						<ItemG>
							<Caption>{t("devices.fields.adapter")}:</Caption>
							<Info>{device.adapter}</Info>
						</ItemG>
					
						<ItemG>
							<Caption>{t("devices.fields.wifiModule")}:</Caption>
							<Info>{device.wifiModule}</Info>
						</ItemG>
						<ItemG>
							<Caption>{t("devices.fields.modemModel")}:</Caption>
							<Info>{device.modemModel}</Info>
						</ItemG>
					
					</ItemG>
				}
				hiddenContent={<ItemG container spacing={16}>
					<ItemG>
						<Caption>{t("devices.fields.cellNumber")}:</Caption>
						<Info>{device.cellNumber}</Info>
					</ItemG>
					<ItemG>
						<Caption>{t("devices.fields.simProvider")}:</Caption>
						<Info>{device.SIMProvider}</Info>
					</ItemG>
					<ItemG>
						<Caption>{t("devices.fields.simCard")}:</Caption>
						<Info>{device.SIMID}</Info>
					</ItemG>
					<ItemG>
						<Caption>{t("devices.fields.modemIMEI")}:</Caption>
						<Info>{device.modemIMEI}</Info>
					</ItemG>

				</ItemG>
				}
			/>
		)
	}
}
export default withStyles(deviceStyles)(DeviceHardware)