import React, { useState, useEffect, Fragment } from 'react'
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
import { useLocalization } from 'hooks'

// @Andrei
export const ProjectContact = props => {
	const t = useLocalization()

	const [users, setUsers] = useState([]) // added
	const [openEditContact, setOpenEditContact] = useState(false)
	const [filters, setFilters] = useState({ keyword: '' })
	const [selectedUser, setSelectedUser] = useState({ id: -1 })
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		openEditContact: false,
	// 		filters: {
	// 			keyword: ""
	// 		},
	// 		selectedUser: {
	// 			id: -1
	// 		}
	// 	}
	// }
	useEffect(() => {
		const asyncFunc = async () => {
			await getAllUsers().then(rs => setUsers(rs))
		}
		asyncFunc()
	}, [])
	// componentDidMount = async () => {
	// 	await getAllUsers().then(rs => this.setState({ users: rs }))

	// }
	const handleOpenEditContact = () => {
		setOpenEditContact(true)
		// this.setState({
		// 	openEditContact: true
		// })
	}
	const handleCloseEditContact = () => {
		setOpenEditContact(false)
		// this.setState({
		// 	openEditContact: false
		// })
	}
	const handleFilterKeyword = value => {
		setFilters({ ...filters, keyword: value })
		// this.setState({
		// 	filters: {
		// 		keyword: value
		// 	}
		// })
	}
	const handleChangeUser = o => {
		setSelectedUser(o)
		// this.setState({
		// 	selectedUser: o
		// })
	}
	const handleChangeContactPerson = async () => {
		let newProject = {
			...props.project,
			user: selectedUser
		}
		await updateProject(newProject).then(() => {
			handleCloseEditContact()
			props.reload()
		})
	}
	const renderEditContact = () => {
		const { classes } = props
		// const { filters, users, openEditContact } = this.state
		const appBarClasses = classNames({
			[' ' + classes['primary']]: 'primary'
		});
		return users ? <Dialog
			fullScreen
			open={openEditContact}
			onClose={handleCloseEditContact}
			TransitionComponent={SlideT}>
			<AppBar className={classes.appBar + ' ' + appBarClasses}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={2} container alignItems={'center'}>
								<IconButton color='inherit' onClick={handleCloseEditContact} aria-label='Close'>
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
									handleFilterKeyword={handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
							<ItemG>
								<Button color={'inherit'} onClick={handleChangeContactPerson}>
									{t('actions.save')}
								</Button>
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={12} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={handleCloseEditContact} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('users.pageTitle')}
								</Typography>
								<Button color={'primary'} style={{ marginLeft: 'auto' }} onClick={handleChangeContactPerson}>
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
									handleFilterKeyword={handleFilterKeyword}
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
							classes={{ root: o.id === selectedUser.id ? classes.selectedItem : null }}
							// selected={o.id === this.state.selectedUser.id}
							divider
							onClick={() => handleChangeUser(o)}>
							<Gravatar default='mp' email={o.email} className={classes.img} />
							<ListItemText
								primaryTypographyProps={{ className: o.id === selectedUser.id ? classes.selectedItemText : null }}
								secondaryTypographyProps={{ classes: { root: o.id === selectedUser.id ? classes.selectedItemText : null } }}
								primary={`${o.firstName} ${o.lastName}`} secondary={o.org.name} />
						</ListItem>
					</Fragment>
				}) : null}
			</List>
		</Dialog> : null
	}

	const { project } = props
	return (
		<InfoCard
			title={t('projects.contact.title')}
			avatar={<Person />}
			subheader={''}
			noExpand
			topAction={<Dropdown
				menuItems={[
					{ label: t('menus.edit'), icon: Edit, func: handleOpenEditContact },
				]
				}
			/>
			}
			content={
				<Grid container>
					{renderEditContact()}
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

export default ProjectContact
