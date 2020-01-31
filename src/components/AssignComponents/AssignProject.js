/* eslint-disable indent */
import { AppBar, Button, Dialog, Divider, IconButton, List, ListItem, ListItemText, Toolbar, Typography, withStyles, Hidden } from '@material-ui/core';
import { Close } from 'variables/icons';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';
import { getAllProjects } from 'variables/dataProjects';
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import { ItemG, SlideT } from 'components';
import assignStyles from 'assets/jss/components/assign/assignStyles';
import { updateCollection, getCollection } from 'variables/dataCollections';
import { useLocalization } from 'hooks'

const AssignProject = props => {
	const t = useLocalization()
	const [projects, setProjects] = useState([])
	const [selectedProject, setSelectedProject] = useState({ id: 0 })
	const [filters, setFilters] = useState({
		keyword: '',
		startDate: null,
		endDate: null,
		activeDateFilter: false
	})
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		projects: [],
	// 		selectedProject: {
	// 			id: 0
	// 		},
	// 		filters: {
	// 			keyword: '',
	// 			startDate: null,
	// 			endDate: null,
	// 			activeDateFilter: false
	// 		}
	// 	}
	// }

	useEffect(() => {
		const asyncFunc = async () => {
			await getAllProjects().then(rs => setProjects(rs))
		}
		asyncFunc()
	}, [])
	// componentDidMount = async () => {
	// 	this._isMounted = 1
	// 	await getAllProjects().then(rs => this._isMounted ? this.setState({ projects: rs }) : null)

	// }
	// componentWillUnmount = () => {
	// 	this._isMounted = 0
	// }
	//Aici
	const assignProject = async () => {
		let collection = await getCollection(props.collectionId)
		// let newProject = await getProject(selectedProject.id)
		// if (this.props.multiple)
		// {
		// 	if (newProject.dataCollections.length > 0)
		// 		newProject.dataCollections = [...newProject.dataCollections, ...this.props.collectionId.map(ci => ({ id: ci }))]
		// 	else {
		// 		newProject.dataCollections = [...this.props.collectionId.map(ci => ({ id: ci }))]
		// 	}
		// }
		// else {
		// 	if (newProject.dataCollections)
		// 		newProject.dataCollections = [...newProject.dataCollections, ...this.props.collectionId.map(ci => ({ ...ci }))]
		// 	else {
		// 		newProject.dataCollections = [...this.props.collectionId.map(ci => ({  ...ci }))]
		// 	}
		// }
		collection.project.id = selectedProject.id
		await updateCollection(collection).then(() => {
			props.handleClose(true)
			setSelectedProject({ id: 0 })
			//  this.setState({ selectedProject: {
			// 	 id: 0
			//  } })
		})
	}

	const selectProject = pId => e => {
		e.preventDefault()
		if (selectedProject === pId)
			setSelectedProject({ id: 0 })
		// this.setState({ selectedProject: { id: 0 } })
		else setSelectedProject(pId)
		// else { this.setState({ selectedProject: pId }) }

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

	const { classes, open, handleCancel } = props;
	const appBarClasses = cx({
		[' ' + classes['primary']]: 'primary'
	});
	return (
		<div>
			<Dialog
				fullScreen
				open={open}
				onClose={handleCancel}
				TransitionComponent={SlideT}
			>
				<AppBar className={classes.appBar + appBarClasses}>
					<Toolbar>
						<Hidden mdDown>
							<ItemG container justify={'center'} alignItems={'center'}>
								<ItemG xs={2} container alignItems={'center'}>
									<IconButton color='inherit' onClick={handleCancel} aria-label='Close'>
										<Close />
									</IconButton>
									<Typography variant='h6' color='inherit' className={classes.flex}>
										{t('projects.pageTitle')}
									</Typography>
								</ItemG>
								<ItemG xs={8}>
									<Search
										fullWidth
										open={true}
										focusOnMount
										suggestions={projects ? suggestionGen(projects) : []}
										handleFilterKeyword={handleFilterKeyword}
										searchValue={filters.keyword} />
								</ItemG>
								<ItemG xs={2}>
									<Button color='inherit' onClick={assignProject}>
										{t('actions.save')}
									</Button>
								</ItemG>
							</ItemG>
						</Hidden>
						<Hidden lgUp>
							<ItemG container justify={'center'} alignItems={'center'}>
								<ItemG xs container alignItems={'center'}>
									<IconButton color='inherit' onClick={handleCancel} aria-label='Close'>
										<Close />
									</IconButton>
									<Typography variant='h6' color='inherit' className={classes.flex}>
										{t('projects.pageTitle')}
									</Typography>
									<Button variant={'contained'} color='primary' onClick={assignProject}>
										{t('actions.save')}
									</Button>
								</ItemG>
								<ItemG xs={12} container alignItems={'center'}>
									<Search
										noAbsolute
										fullWidth
										open={true}
										focusOnMount
										suggestions={projects ? suggestionGen(projects) : []}
										handleFilterKeyword={handleFilterKeyword}
										searchValue={filters.keyword}
									/>

								</ItemG>
							</ItemG>
						</Hidden>
					</Toolbar>
				</AppBar>
				<List>
					{projects ? filterItems(projects, filters).map((p, i) => (
						<Fragment key={i}>
							<ListItem button onClick={selectProject(p)}
								classes={{
									root: selectedProject.id === p.id ? classes.selectedItem : null
								}}
							>
								<ListItemText primaryTypographyProps={{
									className: selectedProject.id === p.id ? classes.selectedItemText : null
								}}
									secondaryTypographyProps={{
										classes: { root: selectedProject.id === p.id ? classes.selectedItemText : null }
									}}
									primary={p.title} secondary={p.user.organisation} />
							</ListItem>
							<Divider />
						</Fragment>
					)
					) : null}
				</List>
			</Dialog>
		</div>
	);
}

AssignProject.propTypes = {
	classes: PropTypes.object.isRequired,
	open: PropTypes.bool.isRequired,
	// t: PropTypes.func.isRequired,
	handleClose: PropTypes.func.isRequired,
	handleCancel: PropTypes.func.isRequired,
	collectionId: PropTypes.array.isRequired,
};

export default withStyles(assignStyles)(AssignProject);