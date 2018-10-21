import { AppBar, Button, Dialog, Divider, IconButton, List, ListItem, ListItemText, Slide, Toolbar, Typography, withStyles, Hidden } from "@material-ui/core";
import { Close } from 'variables/icons';
import cx from "classnames";
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { getAvailableDevices } from 'variables/dataDevices';
import { ItemG, CircularLoader, Info } from 'components';
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import { assignDeviceToCollection } from 'variables/dataCollections';
import assignStyles from 'assets/jss/components/assign/assignStyles';

function Transition(props) {
	return <Slide direction="up" {...props} />;
}

class AssignDevice extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			devices: [],
			selectedDevices: [],
			noData: false,
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
		const { orgId } = this.props
		await getAvailableDevices(orgId).then(rs => {
			return rs ? this.setState({ devices: rs }) : this.setState({ devices: null, noData: true })
		})
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	handleClick = (event, id) => {
		event.stopPropagation()
		const { selectedDevices } = this.state;
		const selectedIndex = selectedDevices.indexOf(id)
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selectedDevices, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selectedDevices.slice(1))
		} else if (selectedIndex === selectedDevices.length - 1) {
			newSelected = newSelected.concat(selectedDevices.slice(0, -1))
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selectedDevices.slice(0, selectedIndex),
				selectedDevices.slice(selectedIndex + 1),
			);
		}

		this.setState({ selectedDevices: newSelected })
	}

	assignDevice = async () => {
		// if (this.props.devices)
		const { collectionId } = this.props
		Promise.all([this.state.selectedDevices.forEach(async e => {
			return assignDeviceToCollection({ id: collectionId, deviceId: e })
		})]).then(() => {
			this.props.handleClose(true)
		})
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
	isSelected = id => this.state.selectedDevices.indexOf(id) !== -1 ? true : false 
	render() {
		const { devices, filters, noData } = this.state
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
										<Typography variant="h6" color="inherit" className={classes.flex}>
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
										<Typography variant="h6" color="inherit" className={classes.flex}>
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
					{noData ? <div style={{ height: "100%", width: "100%", display: 'flex', justifyContent: "center", alignItems: "center" }}>
						<Info>{t("devices.noDevices")}</Info>
					</div> : <List>
						{devices ? filterItems(devices, filters).map((p, i) => (
							<Fragment key={i}>
								<ListItem button
									onClick={e => this.handleClick(e, p.id)}
									classes={{ root: this.isSelected(p.id) ? classes.selectedItem : null }}>
									<ListItemText
										primaryTypographyProps={{ className: this.isSelected(p.id) ? classes.selectedItemText : null }}
										secondaryTypographyProps={{ classes: { root: this.isSelected(p.id) ? classes.selectedItemText : null } }}
										primary={p.name} secondary={p.id} />
								</ListItem>
								<Divider />
							</Fragment>
						)
						) : <CircularLoader />}
					</List>}
				</Dialog>
			</div>
		);
	}
}

AssignDevice.propTypes = {
	classes: PropTypes.object.isRequired,
	orgId: PropTypes.number.isRequired,
	collectionId: PropTypes.number.isRequired,
};

export default withStyles(assignStyles)(AssignDevice);