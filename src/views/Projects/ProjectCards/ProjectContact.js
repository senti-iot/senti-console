import React, { Component, Fragment } from 'react'
import { InfoCard, ItemGrid, Caption, Info, Dropdown, ItemG, SlideT } from 'components';
import { Grid, Typography, IconButton, Hidden, Toolbar, AppBar, Dialog, List, ListItem, ListItemText, Button, Link } from '@material-ui/core';
import { Person, Edit, Close } from 'variables/icons'
import { Link as RLink } from 'react-router-dom'
import { suggestionGen, filterItems } from 'variables/functions';
import { getAllUsers } from 'variables/dataUsers';
import Gravatar from 'react-gravatar'
import classNames from 'classnames'
import Search from 'components/Search/Search';
import { updateProject } from 'variables/dataProjects';

export class ProjectContact extends Component {
	constructor(props) {
		super(props)

		this.state = {
			openEditContact: false,
			filters: {
				keyword: ""
			},
			selectedUser: {
				id: -1
			}
		}
	}
	componentDidMount = async () => {
		await getAllUsers().then(rs => this.setState({ users: rs }))

	}
	handleOpenEditContact = () => {
		this.setState({
			openEditContact: true
		})
	}
	handleCloseEditContact = () => {
		this.setState({
			openEditContact: false
		})
	}
	handleFilterKeyword = value => {
		this.setState({
			filters: {
				keyword: value
			}
		})
	}
	handleChangeUser = o => {
		this.setState({
			selectedUser: o
		})
	}
	handleChangeContactPerson = async () => {
		let newProject = {
			...this.props.project,
			user: this.state.selectedUser
		}
		await updateProject(newProject).then(() => {
			this.handleCloseEditContact()
			this.props.reload()
		})
	}
	renderEditContact = () => {
		const { t, classes } = this.props
		const { filters, users, openEditContact } = this.state
		const appBarClasses = classNames({
			[' ' + classes['primary']]: 'primary'
		});
		return users ? <Dialog
			fullScreen
			open={openEditContact}
			onClose={this.handleCloseEditContact}
			TransitionComponent={SlideT}>
			<AppBar className={classes.appBar + ' ' + appBarClasses}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={2} container alignItems={'center'}>
								<IconButton color='inherit' onClick={this.handleCloseEditContact} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('users.pageTitle')}
								</Typography>
							</ItemG>
							<ItemG xs={8}>
								<Search
									fullWidth
									open={true}
									focusOnMount
									suggestions={users ? suggestionGen(users) : []}
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
							<ItemG>
								<Button color={'inherit'} onClick={this.handleChangeContactPerson}>
									{t('actions.save')}
								</Button>
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={12} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={this.handleCloseEditContact} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('users.pageTitle')}
								</Typography>
								<Button color={'primary'} style={{ marginLeft: 'auto' }} onClick={this.handleChangeContactPerson}>
									{t('actions.save')}
								</Button>
							</ItemG>
							<ItemG xs={12} container alignItems={'center'} justify={'center'}>
								<Search
									noAbsolute
									fullWidth
									open={true}
									focusOnMount
									suggestions={users ? suggestionGen(users) : []}
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>

						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<List>
				{users ? filterItems(users, filters).map((o, i) => {
					return <Fragment key={i}>
						<ListItem button
							classes={{ root: o.id === this.state.selectedUser.id ? classes.selectedItem : null }}
							// selected={o.id === this.state.selectedUser.id}
							divider
							onClick={() => this.handleChangeUser(o)}>
							<Gravatar default='mp' email={o.email} className={classes.img} />
							<ListItemText
								primaryTypographyProps={{ className: o.id === this.state.selectedUser.id ? classes.selectedItemText : null }}
								secondaryTypographyProps={{ classes: { root: o.id === this.state.selectedUser.id ? classes.selectedItemText : null } }}
								primary={`${o.firstName} ${o.lastName}`} secondary={o.org.name} />
						</ListItem>
					</Fragment>
				}) : null}
			</List>
		</Dialog> : null
	}
	render() {
		const { t, project, classes } = this.props
		return (
			<InfoCard
				title={t('projects.contact.title')}
				avatar={<Person />}
				subheader={''}
				noExpand
				topAction={<Dropdown
					menuItems={[
						{ label: t('menus.edit'), icon: <Edit className={classes.leftIcon} />, func: this.handleOpenEditContact },
					]
					}
				/>
				}
				content={
					<Grid container>
						{this.renderEditContact()}
						<ItemGrid>
							<Caption>
								{t('projects.contact.name')}
							</Caption>
							<Info >
								<Link to={`/management/user/${project.user.id}`} >
									{project.user.firstName + ' ' + project.user.lastName}
								</Link>
							</Info>
						</ItemGrid>
						<ItemGrid>
							<Caption>
								{t('projects.contact.email')}
							</Caption>
							<Info>
								<Link title={t('links.mailTo')} href={`mailto:${project.user.email}`}>
									{project.user.email}
								</Link>
							</Info>
						</ItemGrid>
						<ItemGrid>
							<Caption>
								{t('projects.contact.phone')}
							</Caption>
							<Info>
								<Link title={t('links.phoneTo')} href={`tel:${project.user.phone}`}>
									{project.user.phone}
								</Link>
							</Info>
						</ItemGrid>
						<ItemGrid>
							<Caption>
								{t('projects.contact.organisation')}
							</Caption>
							<Info>
								{project.user.org ? <Link component={RLink} to={{ pathname: `/management/org/${project.user.org.id}`, prevURL: `/project/${project.id}` }} >
									{project.user.org.name}
								</Link> : t('users.fields.noOrg')}
							</Info>
						</ItemGrid>
					</Grid>
				}
			/>
		)
	}
}

export default ProjectContact
