import { AppBar, Dialog, Divider, IconButton, List, ListItem, ListItemText, Slide, Toolbar, Typography, withStyles, Hidden, Tooltip } from '@material-ui/core';
import { Close } from 'variables/icons';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';
// import { getAllOrgs } from 'variables/dataOrgs';
import { ItemG, CircularLoader } from 'components';
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import assignStyles from 'assets/jss/components/assign/assignStyles';
import { connect } from 'react-redux'




class AssignOrgDialog extends PureComponent {
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
		// await getAllOrgs().then(rs => this._isMounted ? this.setState({ orgs: rs }) : null)
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	assignOrg = sId => e => {
		// let sId = this.state.selectedOrg
		let orgs = this.props.orgs
		let org = orgs[orgs.findIndex(o => o.id === sId)]
		this.props.callBack(org)
	}
	Transition(props) {
		return <Slide direction='up' {...props} />;
	}
	selectOrg = pId => e => {
		e.preventDefault()
		this.setState({ selectedOrg: pId })
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
		const {  filters } = this.state
		const { orgs, classes, open, t } = this.props;
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return (
			
			<Dialog
				fullScreen
				open={open}
				onClose={this.handleClose}
				TransitionComponent={this.Transition}
			>
				<AppBar className={classes.appBar + appBarClasses}>
					<Toolbar>
						<Hidden smDown>
							<ItemG container alignItems={'center'}>
								<ItemG xs={3} container alignItems={'center'}>
									<Typography variant='h6' color='inherit' className={classes.flex}>
										{t('orgs.pageTitle')}
									</Typography>
								</ItemG>
								<ItemG xs>
									<Search
										fullWidth
										open={true}
										focusOnMount
										suggestions={orgs ? suggestionGen(orgs) : []}
										handleFilterKeyword={this.handleFilterKeyword}
										searchValue={filters.keyword} />
								</ItemG>
								<ItemG xs={1}>
									<Tooltip title={t('actions.cancel')}>
										<IconButton color='inherit' onClick={this.closeDialog} aria-label='Close'>
											<Close />
										</IconButton>
									</Tooltip>
								</ItemG>
							</ItemG>
						</Hidden>
						<Hidden mdUp>
							<ItemG container alignItems={'center'}>
								<ItemG xs={12} container alignItems={'center'}>
									<IconButton color={'inherit'} onClick={this.closeDialog} aria-label='Close'>
										<Close />
									</IconButton>
									<Typography variant='h6' color='inherit' className={classes.flex}>
										{t('orgs.pageTitle')}
									</Typography>
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
							<ListItem button onClick={this.assignOrg(p.id)} value={p.id}
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
								primary={p.name} />
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
const mapStateToProps = (state) => ({
	orgs: state.data.orgs
})

const mapDispatchToProps = {
	
}

AssignOrgDialog.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(assignStyles)(AssignOrgDialog))