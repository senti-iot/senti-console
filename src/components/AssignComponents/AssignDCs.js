import { AppBar, Button, Dialog, Divider, IconButton, List, ListItem, ListItemText, Toolbar, Typography, withStyles, Hidden } from '@material-ui/core';
import { Close } from 'variables/icons';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';
import { getAllCollections } from 'variables/dataCollections';
import { ItemG, CircularLoader, SlideT } from 'components';
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import assignStyles from 'assets/jss/components/assign/assignStyles';
import { updateProject, getProject } from 'variables/dataProjects';
import { useLocalization } from 'hooks';

// @Andrei
const AssignDCS = props => {
	const t = useLocalization()
	const [project, setProject] = useState(props.project)
	const [collections, setCollections] = useState([])
	const [selectedCollections, setSelectedCollections] = useState([])
	const [filters, setFilters] = useState({
		keyword: '',
		startDate: null,
		endDate: null,
		activeDateFilter: false
	})
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		project: props.project,
	// 		collections: [],
	// 		selectedCollections: [],
	// 		filters: {
	// 			keyword: '',
	// 			startDate: null,
	// 			endDate: null,
	// 			activeDateFilter: false
	// 		}
	// 	}
	// }
	//#region Lifecycle

	useEffect(() => {
		const asyncFunc = async () => {
			await getAllCollections().then(rs => setCollections(rs))
			await getProject(props.project).then(rs => {
				setProject(rs)
				setSelectedCollections(rs ? rs.dataCollections.map(r => r.id) : [])
			})
		}
		asyncFunc()
	}, [props.project])
	// componentDidMount = async () => {
	// 	this._isMounted = 1
	// 	await getAllCollections().then(rs => this._isMounted ? this.setState({ collections: rs }) : this.setState({ collections: [] }))
	// 	await getProject(this.props.project).then(rs => this._isMounted ? this.setState({ project: rs, selectedCollections: rs ? rs.dataCollections.map(r => r.id) : [] }) : null)
	// }
	useEffect(() => {
		const asyncFunc = async () => {
			await getProject(props.project).then(rs => {
				setProject(rs)
				setSelectedCollections(rs ? rs.dataCollections.map(r => r.id) : [])
			})
		}
		asyncFunc()
	}, [props.project])
	// componentWillUpdate = async (nextProps, nextState) => {
	// 	if (nextProps.project !== this.props.project)
	// 		await getProject(nextProps.project).then(rs => this._isMounted ? this.setState({ project: rs, selectedCollections: rs ? rs.dataCollections.map(r => r.id) : [] }) : null)
	// }

	// componentWillUnmount = () => {
	// 	this._isMounted = 0
	// }

	//#endregion

	//#region External

	const assignCollection = async () => {
		// const { selectedCollections, project } = this.state
		await updateProject({ ...project, dataCollections: [...selectedCollections.map(c => ({ id: c }))] }).then(
			() => props.handleClose(true)
		)
	}

	//#endregion

	//#region Handlers

	const handleClick = (event, id) => {
		event.stopPropagation()
		// const { selectedCollections } = this.state;
		const selectedIndex = selectedCollections.findIndex(c => c === id)
		let newSelected = [...selectedCollections];
		if (selectedIndex === -1) {
			newSelected.push(id);
		}
		else {
			newSelected = newSelected.filter(c => c !== id)
		}
		setSelectedCollections(newSelected)
		// this.setState({ selectedCollections: newSelected })
	}

	const handleFilterKeyword = value => {
		setFilters({ ...filters, keyword: value })
		// this.setState({
		// 	filters: {
		// 		...this.state.filters,
		// 		keyword: value
		// 	}
		// })
	}
	const isSelected = id => selectedCollections.findIndex(c => c === id) !== -1 ? true : false

	//#endregion

	// const { collections, filters } = this.state
	const { classes, open } = props;
	const appBarClasses = cx({
		[' ' + classes['primary']]: 'primary'
	});
	return (
		<div>
			<Dialog
				fullScreen
				open={open}
				onClose={() => props.handleClose(false)}
				TransitionComponent={SlideT}
			>
				<AppBar className={classes.appBar + appBarClasses}>
					<Toolbar>
						<Hidden mdDown>
							<ItemG container alignItems={'center'}>
								<ItemG xs={2} container alignItems={'center'}>
									<IconButton color={'inherit'} onClick={() => props.handleClose(false)}
										aria-label='CloseCollection'>
										<Close />
									</IconButton>
									<Typography variant='h6' color='inherit' className={classes.flex}>
										{t('collections.pageTitle')}
									</Typography>
								</ItemG>
								<ItemG xs={8}>
									<Search
										fullWidth
										open={true}
										focusOnMount
										suggestions={collections ? suggestionGen(collections) : []}
										handleFilterKeyword={handleFilterKeyword}
										searchValue={filters.keyword} />
								</ItemG>
								<ItemG xs={2}>
									<Button color='inherit' onClick={assignCollection}>
										{t('actions.save')}
									</Button>
								</ItemG>
							</ItemG>
						</Hidden>
						<Hidden lgUp>
							<ItemG container alignItems={'center'}>
								<ItemG xs={12} container alignItems={'center'}>
									<IconButton color={'inherit'} onClick={() => props.handleClose(false)} aria-label='Close'>
										<Close />
									</IconButton>
									<Typography variant='h6' color='inherit' className={classes.flex}>
										{t('collections.pageTitle')}
									</Typography>
									<Button variant={'contained'} color='primary' onClick={assignCollection}>
										{t('actions.save')}
									</Button>
								</ItemG>
								<ItemG xs={12} container alignItems={'center'} justify={'center'}>
									<Search
										noAbsolute
										fullWidth
										open={true}
										focusOnMount
										suggestions={collections ? suggestionGen(collections) : []}
										handleFilterKeyword={handleFilterKeyword}
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
								onClick={e => handleClick(e, p.id)}
								classes={{ root: isSelected(p.id) ? classes.selectedItem : null }}>
								<ListItemText
									primaryTypographyProps={{ className: isSelected(p.id) ? classes.selectedItemText : null }}
									secondaryTypographyProps={{ classes: { root: isSelected(p.id) ? classes.selectedItemText : null } }}
									primary={p.name} secondary={`${t('collections.fields.id')}: ${p.id}`} />
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

AssignDCS.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(assignStyles)(AssignDCS);