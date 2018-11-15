import { AppBar, Button, Dialog, Divider, IconButton, List, ListItem, ListItemText, Slide, Toolbar, Typography, withStyles, Hidden } from "@material-ui/core";
import { Close } from 'variables/icons';
import cx from "classnames";
import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';
import { getAllOrgs } from 'variables/dataOrgs';
import { updateDevice } from 'variables/dataDevices'
import { updateCollection } from 'variables/dataCollections';
import { ItemG, CircularLoader } from 'components';
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import assignStyles from 'assets/jss/components/assign/assignStyles';


function Transition(props) {
	return <Slide direction="up" {...props} />;
}

class AssignOrg extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			orgs: [],
			selectedOrg: null,
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
		await getAllOrgs().then(rs => this._isMounted ? this.setState({ orgs: rs }) : null)
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	selectOrg = pId => e => {
		e.preventDefault()
		this.setState({ selectedOrg: pId })
	}
	assignOrg = async () => {
		if (this.props.devices)
			Promise.all(this.props.deviceId.map( e =>
				updateDevice({ ...e, org: { id: this.state.selectedOrg } }).then(rs => rs)
			)).then(rs => {
				this.props.handleClose(true)
			})
		if (this.props.collections) {
			Promise.all(this.props.collectionId.map(e => {
				return updateCollection({ ...e, org: { id: this.state.selectedOrg } })
			})).then(rs => {
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
		const { orgs, filters } = this.state
		const { classes, open, t } = this.props;
		const appBarClasses = cx({
			[" " + classes['primary']]: 'primary'
		});
		return (
			
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
									<IconButton color="inherit" onClick={this.closeDialog} aria-label="Close">
										<Close />
									</IconButton>
									<Typography variant="h6" color="inherit" className={classes.flex}>
										{t("orgs.pageTitle")}
									</Typography>
								</ItemG>
								<ItemG xs={8}>
									<Search
										fullWidth
										open={true}
										focusOnMount
										suggestions={orgs ? suggestionGen(orgs) : []}
										handleFilterKeyword={this.handleFilterKeyword}
										searchValue={filters.keyword} />
								</ItemG>
								<ItemG xs={2}>
									<Button color="inherit" onClick={this.assignOrg}>
										{t("actions.save")}
									</Button>
								</ItemG>
							</ItemG>
						</Hidden>
						<Hidden lgUp>
							<ItemG container alignItems={'center'}>
								<ItemG xs={12} container alignItems={'center'}>
									<IconButton color={'inherit'} onClick={this.closeDialog} aria-label="Close">
										<Close />
									</IconButton>
									<Typography variant="h6" color="inherit" className={classes.flex}>
										{t("orgs.pageTitle")}
									</Typography>
									<Button variant={'contained'} color="primary" onClick={this.assignOrg}>
										{t("actions.save")}
									</Button>
								</ItemG>
								<ItemG xs={12} container alignItems={'center'} justify={'center'}>
									<Search
										noAbsolute
										fullWidth
										open={true}
										focusOnMount
										suggestions={orgs ? suggestionGen(orgs) : []}
										handleFilterKeyword={this.handleFilterKeyword}
										searchValue={filters.keyword} />
								</ItemG>
							</ItemG>
						</Hidden>
					</Toolbar>
				</AppBar>
				<List>
					{orgs ? filterItems(orgs, filters).map((p, i) => (
						<Fragment key={i}>
							<ListItem button onClick={this.selectOrg(p.id)} value={p.id}
								classes={{
									root: this.state.selectedOrg === p.id ? classes.selectedItem : null
								}}
							>
								<ListItemText primaryTypographyProps={{
									className: this.state.selectedOrg === p.id ? classes.selectedItemText : null
								}}
								secondaryTypographyProps={{
									classes: { root: this.state.selectedOrg === p.id ? classes.selectedItemText : null }
								}}
								primary={p.name} /* secondary={p.user.organisation} */ />
							</ListItem>
							<Divider />
						</Fragment>
					)
					) : <CircularLoader />}
				</List>
			</Dialog>
		
		);
	}
}

AssignOrg.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(assignStyles)(AssignOrg);