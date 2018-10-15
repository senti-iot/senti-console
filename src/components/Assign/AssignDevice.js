import { AppBar, Button, Dialog, Divider, IconButton, List, ListItem, ListItemText, Slide, Toolbar, Typography, withStyles, Hidden } from "@material-ui/core";
import { Close } from 'variables/icons';
import { headerColor, hoverColor, primaryColor } from 'assets/jss/material-dashboard-react';
import cx from "classnames";
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { getAllDevices } from 'variables/dataDevices';
import { updateDevice } from 'variables/dataDevices'
import { updateCollection } from 'variables/dataCollections';
import { ItemG, CircularLoader } from 'components';
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';

const styles = {
	appBar: {
		position: 'relative',
		backgroundColor: headerColor,
		boxShadow: "none",
		borderBottom: "0",
		marginBottom: "0",
		width: "100%",
		paddingTop: "10px",
		zIndex: "1029",
		color: "#ffffff",
		border: "0",
		// borderRadius: "3px",
		padding: "10px 0",
		transition: "all 150ms ease 0s",
		minHeight: "50px",
		display: "block"
	},
	flex: {
		flex: 1,
	},
	selectedItem: {
		background: primaryColor,
		"&:hover": {
			background: hoverColor
		}
		// color: "#fff"
	},
	selectedItemText: {
		color: "#FFF"
	}
};

function Transition(props) {
	return <Slide direction="up" {...props} />;
}

class AssignDevice extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			devices: [],
			selectedDevice: null,
			filters: {
				keyword: '',
				startDate: null,
				endDate: null,
				activeDateFilter: false
			}
		}
	}

	componentDidMount = async () => {
		this._isMounted = 1
		await getAllDevices().then(rs => this._isMounted ? this.setState({ devices: rs }) : null)
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	selectDevice = pId => e => {
		e.preventDefault()
		this.setState({ selectedDevice: pId })
	}
	assignDevice = async () => {
		if (this.props.devices)
			Promise.all([this.props.deviceId.forEach(async e => {
				await updateDevice({ ...e, device: { id: this.state.selectedDevice } }).then(rs => rs)
			})]).then(() => {
				this.props.handleClose(true)
			})
		if (this.props.collections) {
			Promise.all([this.props.collectionId.map(e => {
				return updateCollection({ ...e, device: { id: this.state.selectedDevice } })
			})]).then(() => {
				this.props.handleClose(true)
			}
			)
		}
	}
	closeDialog = () => {
		this.props.handleClose(false)
	}
	handleFilterKeyword = value => {
		this.setState({
			filters: {
				...this.state.filters,
				keyword: value
			}
		})
	}
	render() {
		const { devices, filters } = this.state
		const { classes, open, t } = this.props;
		const appBarClasses = cx({
			[" " + classes['primary']]: 'primary'
		});
		return (
			<div>
				<Dialog
					fullScreen
					open={open}
					onClose={this.handleClose}
					TransitionComponent={Transition}
				>
					<AppBar className={classes.appBar + appBarClasses}>
						<Toolbar>
							<Hidden mdDown>
								<ItemG container alignItems={'center'}>
									<ItemG xs={2} container alignItems={'center'}>
										<IconButton color="inherit" onClick={this.props.handleCancel} aria-label="Close">
											<Close />
										</IconButton>
										<Typography variant="title" color="inherit" className={classes.flex}>
											{t("devices.pageTitle")}
										</Typography>
									</ItemG>
									<ItemG xs={8}>
										<Search
											fullWidth
											open={true}
											focusOnMount
											suggestions={devices ? suggestionGen(devices) : []}
											handleFilterKeyword={this.handleFilterKeyword}
											searchValue={filters.keyword} />
									</ItemG>
									<ItemG xs={2}>
										<Button color="inherit" onClick={this.assignDevice}>
											{t("actions.save")}
										</Button>
									</ItemG>
								</ItemG>
							</Hidden>
							<Hidden lgUp>
								<ItemG container alignItems={'center'}>
									<ItemG xs={12} container alignItems={'center'}>
										<IconButton color={'inherit'} onClick={this.props.handleCancel} aria-label="Close">
											<Close />
										</IconButton>
										<Typography variant="title" color="inherit" className={classes.flex}>
											{t("devices.pageTitle")}
										</Typography>
										<Button variant={'contained'} color="primary" onClick={this.assignDevice}>
											{t("actions.save")}
										</Button>
									</ItemG>
									<ItemG xs={12} container alignItems={'center'} justify={'center'}>
										<Search
											noAbsolute
											fullWidth
											open={true}
											focusOnMount
											suggestions={devices ? suggestionGen(devices) : []}
											handleFilterKeyword={this.handleFilterKeyword}
											searchValue={filters.keyword} />
									</ItemG>
								</ItemG>
							</Hidden>
						</Toolbar>
					</AppBar>
					<List>
						{devices ? filterItems(devices, filters).map((p, i) => (
							<Fragment key={i}>
								<ListItem button onClick={this.selectDevice(p.id)} value={p.id}
									classes={{
										root: this.state.selectedDevice === p.id ? classes.selectedItem : null
									}}
								>
									<ListItemText primaryTypographyProps={{
										className: this.state.selectedDevice === p.id ? classes.selectedItemText : null
									}}
									secondaryTypographyProps={{
										classes: { root: this.state.selectedDevice === p.id ? classes.selectedItemText : null }
									}}
									primary={p.name} /* secondary={p.user.deviceanisation} */ />
								</ListItem>
								<Divider />
							</Fragment>
						)
						) : <CircularLoader />}
					</List>
				</Dialog>
			</div>
		);
	}
}

AssignDevice.propTypes = {
	classes: PropTypes.object.isRequired,
	orgId: PropTypes.number.isRequired,
	
};

export default withStyles(styles)(AssignDevice);