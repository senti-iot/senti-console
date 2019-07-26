import { AppBar, Dialog, Divider, IconButton, List, ListItem, ListItemText, Slide, Toolbar, Typography, withStyles, Hidden, Tooltip } from '@material-ui/core';
import { Close } from 'variables/icons';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';
// import { getAllDeviceTypes } from 'variables/dataDeviceTypes';
import { ItemG, CircularLoader } from 'components';
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import assignStyles from 'assets/jss/components/assign/assignStyles';
import { connect } from 'react-redux'
import TP from 'components/Table/TP';

class AssignDeviceTypeDialog extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			deviceTypes: [],
			selectedDeviceType: null,
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
		// await getAllDeviceTypes().then(rs => this._isMounted ? this.setState({ deviceTypes: rs }) : null)
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	assignDeviceType = sId => e => {
		// let sId = this.state.selectedDeviceType
		let deviceTypes = this.props.deviceTypes
		let org = deviceTypes[deviceTypes.findIndex(o => o.id === sId)]
		this.props.callBack(org)
	}
	Transition(props) {
		return <Slide direction='up' {...props} />;
	}
	selectDeviceType = pId => e => {
		e.preventDefault()
		this.setState({ selectedDeviceType: pId })
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
		const { filters, page } = this.state
		const { deviceTypes, classes, open, t } = this.props;

		let height = window.innerHeight
		let rows = Math.round((height - 85 - 49 - 49) / 49)
		let rowsPerPage = rows

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
										{t('sidebar.cloudfunctions')}
									</Typography>
								</ItemG>
								<ItemG xs>
									<Search
										fullWidth
										open={true}
										focusOnMount
										suggestions={deviceTypes ? suggestionGen(deviceTypes) : []}
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
										{t('deviceTypes.pageTitle')}
									</Typography>
								</ItemG>
								<ItemG xs={12} container alignItems={'center'} justify={'center'}>
									<Search
										noAbsolute
										fullWidth
										open={true}
										focusOnMount
										suggestions={deviceTypes ? suggestionGen(deviceTypes) : []}
										handleFilterKeyword={this.handleFilterKeyword}
										searchValue={filters.keyword} />
								</ItemG>
							</ItemG>
						</Hidden>
					</Toolbar>
				</AppBar>
				<List>
					{deviceTypes ? filterItems(deviceTypes, filters).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p, i) => (
						<Fragment key={i}>
							<ListItem button onClick={this.assignDeviceType(p.id)} value={p.id}
								classes={{
									root: this.state.selectedDeviceType === p.id ? classes.selectedItem : null
								}}
							>
								<ListItemText
									primaryTypographyProps={{
										className: this.state.selectedDeviceType === p.id ? classes.selectedItemText : null
									}}
									secondaryTypographyProps={{
										classes: { root: this.state.selectedDeviceType === p.id ? classes.selectedItemText : null }
									}}
									primary={p.name} />
							</ListItem>
							<Divider />
						</Fragment>
					)
					) : <CircularLoader />}
					<TP
						disableRowsPerPage
						count={deviceTypes ? deviceTypes.length : 0}
						page={page}
						t={t}
						handleChangePage={this.handleChangePage}
					/>
				</List>
			</Dialog>

		);
	}
}
const mapStateToProps = (state, props) => ({
	deviceTypes: state.data.deviceTypes,
})

const mapDispatchToProps = {

}

AssignDeviceTypeDialog.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(assignStyles)(AssignDeviceTypeDialog))