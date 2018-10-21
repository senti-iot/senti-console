import { AppBar, Button, Dialog, Divider, IconButton, List, ListItem, ListItemText, Slide, Toolbar, Typography, withStyles, Hidden } from "@material-ui/core";
import { Close } from 'variables/icons';
import cx from "classnames";
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { getAllProjects, updateProject, getProject } from 'variables/dataProjects';
// import { updateDevice } from 'variables/dataDevices'
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import { ItemG } from 'components';
import assignStyles from 'assets/jss/components/assign/assignStyles';

function Transition(props) {
	return <Slide direction="up"a {...props} />;
}

class AssignProject extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			projects: [],
			selectedProject: {
				id: 0
			},
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
		await getAllProjects().then(rs => this._isMounted ? this.setState({ projects: rs }) : null)
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}


	selectProject = pId => e => {
		e.preventDefault()
		if (this.state.selectedProject === pId)
			this.setState({ selectedProject: { id: 0 } })
		else { this.setState({ selectedProject: pId }) }

	}
	assignProject = async () => {
		const { selectedProject } = this.state
		let newProject = await getProject(selectedProject.id)
		if (this.props.multiple)
		{ 
			if (newProject.dataCollections)
				newProject.dataCollections = [...newProject.dataCollections, ...this.props.collectionId.map(ci => ({ id: ci }))]
			else {
				newProject.dataCollections = [...this.props.collectionId.map(ci => ({ id: ci }))]
			}
		}	
		else {
			if (newProject.dataCollections)
				newProject.dataCollections = [...newProject.dataCollections, ...this.props.collectionId.map(ci => ({ ...ci }))]
			else { 
				newProject.dataCollections = [...this.props.collectionId.map(ci => ({  ...ci }))]
			}
		}
		await updateProject(newProject).then(() => {this.props.handleClose(true)
		 this.setState({ selectedProject: {
			 id: 0
		 } })
		})
	}
	
	handleFilterKeyword = value => {
		this.setState({
			filters: {
				...this.state.filters,
				keyword: value
			}
		})
	}
	renderList = (projects) => {
		
	}
	render() {
		const { filters, projects } = this.state
		const { classes, open, t, handleCancel } = this.props;
		const appBarClasses = cx({
			[" " + classes['primary']]: 'primary'
		});
		return (
			<div>
				<Dialog
					fullScreen
					open={open}
					onClose={handleCancel}
					TransitionComponent={Transition}
				>
					<AppBar className={classes.appBar + appBarClasses}>
						<Toolbar>
							<Hidden mdDown>
								<ItemG container justify={'center'} alignItems={'center'}>
									<ItemG xs={2} container alignItems={"center"}>
										<IconButton color="inherit" onClick={handleCancel} aria-label="Close">
											<Close />
										</IconButton>
										<Typography variant="h6" color="inherit" className={classes.flex}>
											{t("projects.pageTitle")}
										</Typography>
									</ItemG>
									<ItemG xs={8}>
										<Search
											fullWidth
											open={true}
											focusOnMount
											suggestions={projects ? suggestionGen(projects) : []}
											handleFilterKeyword={this.handleFilterKeyword}
											searchValue={filters.keyword} />
									</ItemG>
									<ItemG xs={2}>
										<Button color="inherit" onClick={this.assignProject}>
											{t("actions.save")}
										</Button>
									</ItemG>
								</ItemG>
							</Hidden>
							<Hidden lgUp>
								<ItemG container justify={'center'} alignItems={'center'}>
									<ItemG xs container alignItems={"center"}>
										<IconButton color="inherit" onClick={handleCancel} aria-label="Close">
											<Close />
										</IconButton>
										<Typography variant="h6" color="inherit" className={classes.flex}>
											{t("projects.pageTitle")}
										</Typography>
										<Button variant={'contained'} color="primary" onClick={this.assignProject}>
											{t("actions.save")}
										</Button>
									</ItemG>
									<ItemG xs={12} container alignItems={'center'}>
										<Search
											noAbsolute
											fullWidth
											open={true}
											focusOnMount
											suggestions={projects ? suggestionGen(projects) : []}
											handleFilterKeyword={this.handleFilterKeyword}
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
								<ListItem button onClick={this.selectProject(p)}
									classes={{
										root: this.state.selectedProject.id === p.id ? classes.selectedItem : null
									}}
								>
									<ListItemText primaryTypographyProps={{
										className: this.state.selectedProject.id === p.id ? classes.selectedItemText : null
									}}
									secondaryTypographyProps={{
										classes: { root: this.state.selectedProject.id === p.id ? classes.selectedItemText : null }
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
}

AssignProject.propTypes = {
	classes: PropTypes.object.isRequired,
	open: PropTypes.bool.isRequired,
	t: PropTypes.func.isRequired,
	handleClose: PropTypes.func.isRequired,
	handleCancel: PropTypes.func.isRequired,
	collectionId: PropTypes.array.isRequired,
};

export default withStyles(assignStyles)(AssignProject);