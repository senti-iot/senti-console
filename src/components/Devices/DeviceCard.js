import React, { Component } from 'react'
import { withStyles, IconButton, Menu, MenuItem, Button } from '@material-ui/core';
import { ItemGrid, SmallCard, ItemG, Info, Caption } from 'components';
import { MoreVert, Edit, SignalWifi2Bar, SignalWifi2BarLock } from 'variables/icons';
import { Link } from 'react-router-dom';
import regularCardStyle from 'assets/jss/material-dashboard-react/regularCardStyle';

class DeviceCard extends Component {
	constructor(props) {
		super(props)

		this.state = {
			actionAnchor: null,
			img: null
		}
	}

	componentDidMount = async () => {
		this._isMounted = 1
		// const { p } = this.props
		// let img = await getProjectImage(p.id).then(rs => rs)
		// if (this._isMounted) {
		// 	if (img)
		// 		this.setState({ img: URL.createObjectURL(img) })
		// }
	}

	componentWillUnmount = () => {
		this._isMounted = 0
	}

	handleOpenActionsDetails = event => {
		this.setState({ actionAnchor: event.currentTarget });
	}

	handleCloseActionsDetails = () => {
		this.setState({ actionAnchor: null });
	}

	handleEdit = () => {
	}

	handleDeleteProject = () => {
	}
	renderIcon = (status) => {
		const { classes, t } = this.props
		switch (status) {
			case 1:
				return <div title={t("devices.status.yellow")}><SignalWifi2Bar className={classes.yellowSignal} /></div>
			case 2:
				return <div title={t("devices.status.green")}><SignalWifi2Bar className={classes.greenSignal} /></div>
			case 0:
				return <div title={t("devices.status.red")}><SignalWifi2Bar className={classes.redSignal} /></div>
			case null:
				return <SignalWifi2BarLock />
			default:
				break;
		}
	}
	render() {
		const { d, classes, t } = this.props
		const { actionAnchor } = this.state
		return (
			<ItemGrid noPadding extraClass={classes.smallCardGrid} noMargin md={4}>
				<div style={{
					margin: 8, height: "100%"
				}}>
					<SmallCard
						whiteAvatar
						key={d.id}
						title={d.name ? d.name : d.id}
						avatar={this.renderIcon(d.liveStatus)}
						// img={this.state.img}
						topAction={
							<ItemGrid noMargin noPadding>
								<IconButton
									aria-label="More"
									aria-owns={actionAnchor ? 'long-menu' : null}
									aria-haspopup="true"
									onClick={this.handleOpenActionsDetails}>
									<MoreVert />
								</IconButton>
								<Menu
									id="long-menu"
									anchorEl={actionAnchor}
									open={Boolean(actionAnchor)}
									onClose={this.handleCloseActionsDetails}
									PaperProps={{
										style: {
											// maxHeight: 200,
											minWidth: 200
										}
									}}>
									<MenuItem component={Link} to={`/device/${d.id}/edit`} style={{
										color: "black"
									}}>
										{/* <Link to=> */}
										<Edit className={classes.leftIcon} />{t("menus.edit")}
										{/* </Link> */}
									</MenuItem>
									{/* <MenuItem onClick={() => alert(t("dialogs.warnings.wip"))}>
										<Devices className={classes.leftIcon} />{t("menus.assignDevices")}
									</MenuItem>
									<MenuItem onClick={() => alert(t("dialogs.warnings.wip"))}>
										<PictureAsPdf className={classes.leftIcon} />{t("menus.exportPDF")}
									</MenuItem>
									<MenuItem onClick={() => alert(t("dialogs.warnings.wip"))}>
										<Delete className={classes.leftIcon} />{t("menus.deleteProject")}
									</MenuItem> */}
									))}
								</Menu>
							</ItemGrid>
						}
						content={<ItemGrid container>
							<ItemG xs={6}>
								<Caption>{t("devices.fields.temp")}</Caption>
								<Info>{d.temperature} &#8451;</Info>
							</ItemG>
							<ItemG xs={12}>
								<Caption>{t("devices.fields.address")}</Caption>
								<Info>{d.address ? d.address : t("devices.noAddress")}</Info>
							</ItemG>
						</ItemGrid>}
						rightActions={
							<Button variant={'text'} color={"primary"} component={Link} to={`/device/${d.id}`}>
								{t("menus.seeMore")}
							</Button>
						}
					/>
				</div>
			</ItemGrid>
		)
	}
}

export default withStyles(regularCardStyle)(DeviceCard)
