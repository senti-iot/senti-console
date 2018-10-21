import { AppBar, Button, Dialog, Divider, IconButton, List, ListItem, ListItemText, Slide, Toolbar, Typography, withStyles, Hidden } from "@material-ui/core";
import { Close } from 'variables/icons';
import cx from "classnames";
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { getAllCollections } from 'variables/dataCollections';
// import { updateCollection } from 'variables/dataCollections'
// import { updateCollection } from 'variables/dataCollections';
import { ItemG, CircularLoader } from 'components';
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import { assignDeviceToCollection } from 'variables/dataCollections';
import assignStyles from 'assets/jss/components/assign/assignStyles';


class AssignDC extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			collections: [],
			selectedCollections: [],
			filters: {
				keyword: '',
				startDate: null,
				endDate: null,
				activeDateFilter: false
			}
		}
	}
	Transition = (props) => {
		return <Slide direction="up" {...props} />;
	}
	componentDidMount = async () => {
		this._isMounted = 1
		// const { orgId } = this.props
		await getAllCollections().then(rs => this._isMounted ? this.setState({ collections: rs }) : this.setState({ collections: [] }))
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}

	handleClick = (e, pId) => {
		e.preventDefault()
		this.setState({ selectedCollections: pId })
	}
	assignCollection = async () => {
		const { deviceId } = this.props

		await assignDeviceToCollection({ id: this.state.selectedCollections, deviceId }).then(rs => {
			this.props.handleClose(true)
		})
	}
	closeDialog = () => {
		console.log("Closing")
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
	isSelected = id => this.state.selectedCollections === (id) ? true : false 
	render() {
		const { collections, filters } = this.state
		const { classes, open, t } = this.props;
		const appBarClasses = cx({
			[" " + classes['primary']]: 'primary'
		});
		return (
			<div>
				<Dialog
					fullScreen
					open={open}
					onClose={() => this.props.handleClose(false)}
					TransitionComponent={this.Transition}
				>
					<AppBar className={classes.appBar + appBarClasses}>
						<Toolbar>
							<Hidden mdDown>
								<ItemG container alignItems={'center'}>
									<ItemG xs={2} container alignItems={'center'}>
										<IconButton color={'inherit'} onClick={() => this.props.handleClose(false)}
											aria-label="CloseCollection">
											<Close />
										</IconButton>
										<Typography variant="h6" color="inherit" className={classes.flex}>
											{t("collections.pageTitle")}
										</Typography>
									</ItemG>
									<ItemG xs={8}>
										<Search
											fullWidth
											open={true}
											focusOnMount
											suggestions={collections ? suggestionGen(collections) : []}
											handleFilterKeyword={this.handleFilterKeyword}
											searchValue={filters.keyword} />
									</ItemG>
									<ItemG xs={2}>
										<Button color="inherit" onClick={this.assignCollection}>
											{t("actions.save")}
										</Button>
									</ItemG>
								</ItemG>
							</Hidden>
							<Hidden lgUp>
								<ItemG container alignItems={'center'}>
									<ItemG xs={12} container alignItems={'center'}>
										<IconButton color={'inherit'} onClick={() => this.props.handleClose(false)} aria-label="Close">
											<Close />
										</IconButton>
										<Typography variant="h6" color="inherit" className={classes.flex}>
											{t("collections.pageTitle")}
										</Typography>
										<Button variant={'contained'} color="primary" onClick={this.assignCollection}>
											{t("actions.save")}
										</Button>
									</ItemG>
									<ItemG xs={12} container alignItems={'center'} justify={'center'}>
										<Search
											noAbsolute
											fullWidth
											open={true}
											focusOnMount
											suggestions={collections ? suggestionGen(collections) : []}
											handleFilterKeyword={this.handleFilterKeyword}
											searchValue={filters.keyword} />
									</ItemG>
								</ItemG>
							</Hidden>
						</Toolbar>
					</AppBar>
					<List>
						{collections ? filterItems(collections, filters).map((p, i) => (
							<Fragment key={i}>
								<ListItem button
									onClick={e => this.handleClick(e, p.id)}
									classes={{ root: this.isSelected(p.id) ? classes.selectedItem : null }}>
									<ListItemText
										primaryTypographyProps={{ className: this.isSelected(p.id) ? classes.selectedItemText : null }}
										secondaryTypographyProps={{ classes: { root: this.isSelected(p.id) ? classes.selectedItemText : null } }}
										primary={p.name} secondary={`${t("collections.fields.id")}: ${p.id}`} />
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

AssignDC.propTypes = {
	classes: PropTypes.object.isRequired,
	deviceId: PropTypes.number.isRequired,
};

export default withStyles(assignStyles)(AssignDC);