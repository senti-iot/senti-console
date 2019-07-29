import { AppBar, Dialog, Divider, IconButton, List, ListItem, ListItemText, Slide, Toolbar, Typography, withStyles, Hidden, Tooltip } from '@material-ui/core';
import { Close } from 'variables/icons';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';
// import { getAllCloudFunctions } from 'variables/dataCloudFunctions';
import { ItemG, CircularLoader } from 'components';
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import assignStyles from 'assets/jss/components/assign/assignStyles';
import { connect } from 'react-redux'
import TP from 'components/Table/TP';

class AssignCloudFunctionDialog extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			cfs: [],
			selectedCloudFunction: null,
			page: 0,
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
		// await getAllCloudFunctions().then(rs => this._isMounted ? this.setState({ cfs: rs }) : null)
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	assignCloudFunction = sId => e => {
		// let sId = selectedCloudFunction
		let cfs = this.props.cfs
		let org = cfs[cfs.findIndex(o => o.id === sId)]
		this.props.callBack(org)
	}
	Transition(props) {
		return <Slide direction='up' {...props} />;
	}
	selectCloudFunction = pId => e => {
		e.preventDefault()
		this.setState({ selectedCloudFunction: pId })
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
	handleChangePage = (event, page) => {
		this.setState({ page });
	}
	render() {
		const { filters, page, selectedCloudFunction } = this.state
		const { cfs, classes, open, t } = this.props;

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
										suggestions={cfs ? suggestionGen(cfs) : []}
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
										{t('cfs.pageTitle')}
									</Typography>
								</ItemG>
								<ItemG xs={12} container alignItems={'center'} justify={'center'}>
									<Search
										noAbsolute
										fullWidth
										open={true}
										focusOnMount
										suggestions={cfs ? suggestionGen(cfs) : []}
										handleFilterKeyword={this.handleFilterKeyword}
										searchValue={filters.keyword} />
								</ItemG>
							</ItemG>
						</Hidden>
					</Toolbar>
				</AppBar>
				<List>
					{cfs ? filterItems(cfs, filters).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p, i) => (
						<Fragment key={i}>
							<ListItem button onClick={this.assignCloudFunction(p.id)} value={p.id}
								classes={{
									root: selectedCloudFunction === p.id ? classes.selectedItem : null
								}}
							>
								<ListItemText
									primaryTypographyProps={{
										className: selectedCloudFunction === p.id ? classes.selectedItemText : null
									}}
									secondaryTypographyProps={{
										classes: { root: selectedCloudFunction === p.id ? classes.selectedItemText : null }
									}}
									primary={p.name} />
							</ListItem>
							<Divider />
						</Fragment>
					)
					) : <CircularLoader />}
					<TP
						disableRowsPerPage
						count={cfs ? cfs.length : 0}
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
	cfs: [{ id: -1, name: props.t('no.cloudfunction') }, ...state.data.functions],
})

const mapDispatchToProps = {

}

AssignCloudFunctionDialog.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(assignStyles)(AssignCloudFunctionDialog))