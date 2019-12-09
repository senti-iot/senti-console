import React, { Component, Fragment } from 'react'
import { Dialog, AppBar, Toolbar, Typography, Button, List, ListItem, ListItemText, Divider, withStyles, Hidden, IconButton } from '@material-ui/core';
import { Close } from 'variables/icons';
import cx from 'classnames'
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import { Collapse, Paper } from '@material-ui/core'
import { CircularLoader, GridContainer, ItemGrid, TextF, Danger, Warning, ItemG, DatePicker, SlideT } from 'components'
import withLocalization from 'components/Localization/T';
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import Gravatar from 'react-gravatar'

class CreateProjectForm extends Component {
	constructor(props) {
		super(props)

		this.state = {
			filters: {
				keyword: ''
			}
		}
	}

	handleFilterKeyword = value => {
		this.setState({
			filters: {
				keyword: value
			}
		})
	}
	renderSelectUser = () => {
		const { t, openUser, handleCloseUser, users, handleChangeUser, classes } = this.props
		const { filters } = this.state
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return <Dialog
			fullScreen
			open={openUser}
			onClose={handleCloseUser}
			TransitionComponent={SlideT}>
			<AppBar className={classes.appBar + ' ' + appBarClasses}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={2} container alignItems={'center'}>
								<IconButton color='inherit' onClick={handleCloseUser} aria-label='Close'>
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
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={12} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={handleCloseUser} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('users.pageTitle')}
								</Typography>
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
						<ListItem button onClick={handleChangeUser(o)}>
							<Gravatar default='mp' email={o.email} className={classes.img} />
							<ListItemText primary={`${o.firstName} ${o.lastName}`} secondary={o.org.name} />
						</ListItem>
						<Divider />
					</Fragment>
				}) : null}
			</List>
		</Dialog>
	}
	renderSelectOrg = () => {
		const { t, openOrg, handleCloseOrg, orgs, handleChangeOrg, classes } = this.props
		const { filters } = this.state
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return <Dialog
			fullScreen
			open={openOrg}
			onClose={handleCloseOrg}
			TransitionComponent={SlideT}>
			<AppBar className={classes.appBar + ' ' + appBarClasses}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={2} container alignItems={'center'}>
								<IconButton color='inherit' onClick={handleCloseOrg} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('orgs.pageTitle')}
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
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={4} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={handleCloseOrg} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('orgs.pageTitle')}
								</Typography>
							</ItemG>
							<ItemG xs={8} container alignItems={'center'} justify={'center'}>
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
				{orgs ? filterItems(orgs, filters).map((o, i) => {
					return <Fragment key={i}>
						<ListItem button onClick={handleChangeOrg(o)}>
							<ListItemText primary={o.name} />
						</ListItem>
						<Divider />
					</Fragment>
				}) : null}
			</List>
		</Dialog>
	}
	render() {
		const { t, classes, errorMessage, error,
			created, title, handleChange, handleDateChange,
			description, startDate, endDate, creating, handleOpenOrg, org,
			handleCreateProject, handleOpenUser, user, goToProject
		} = this.props
		const buttonClassname = cx({
			[classes.buttonSuccess]: created,
		})
		return (
			<GridContainer justify={'center'}>
				<Paper className={classes.paper}>
					<form className={classes.form}>
						<ItemGrid xs={12}>
							<Collapse in={error}>
								<Warning>
									<Danger>
										{errorMessage}
									</Danger>
								</Warning>
							</Collapse>
						</ItemGrid>
						<ItemGrid container xs={12}>
							<TextF
								autoFocus
								id={'title'}
								label={t('projects.fields.name')}
								value={title}
								// className={classes.textField}
								onChange={handleChange('title')}
								margin='normal'

								error={error}

							/>
						</ItemGrid>
						<ItemGrid xs={12}>
							<TextF
								id={'multiline-flexible'}
								label={t('projects.fields.description')}
								multiline
								rows={4}
								color={'secondary'}
								// className={classes.textField}
								value={description}
								onChange={handleChange('description')}
								margin='normal'

								error={error}
							/>
						</ItemGrid>
						<ItemGrid xs={12}>
							<DatePicker
								label={t('projects.fields.startDate')}
								value={startDate}
								onChange={handleDateChange('startDate')}
								error={error}
							/>
						</ItemGrid>
						<ItemGrid xs={12}>
							<DatePicker
								label={t('projects.fields.endDate')}
								value={endDate}
								onChange={handleDateChange('endDate')}
								error={error}
							/>
						</ItemGrid>
						<ItemGrid xs={12}>
							{this.renderSelectUser()}
							<TextF
								id={'contactPerson'}
								label={t('projects.contact.title')}
								value={`${user.firstName} ${user.lastName}`}
								handleClick={handleOpenUser}
								InputProps={{
									onChange: handleOpenUser,
									readOnly: true
								}}
							/>
						</ItemGrid>
						<ItemGrid xs={12}>
							{this.renderSelectOrg()}
							<TextF
								id={'collectionOrg'}
								label={t('collections.fields.org')}
								value={org.name}
								handleClick={handleOpenOrg}
								InputProps={{
									onChange: handleOpenOrg,
									readOnly: true
								}}
							/>
						</ItemGrid>

					</form>
					<ItemGrid xs={12} container justify={'center'}>
						<Collapse in={creating} timeout='auto' unmountOnExit>
							<CircularLoader notCentered />
						</Collapse>
					</ItemGrid>
					<ItemGrid container style={{ margin: 16 }}>
						<div className={classes.wrapper}>
							<Button
								variant='outlined'
								onClick={goToProject}
								className={classes.redButton}
							>
								{t('actions.cancel')}
							</Button>
						</div>
						<div className={classes.wrapper}>
							<Button
								variant='outlined'
								color='primary'
								className={buttonClassname}
								disabled={creating || created}
								onClick={handleCreateProject}
							>
								{created ? t('snackbars.redirect')
									: t('actions.save')}

							</Button>
						</div>
					</ItemGrid>
				</Paper>
			</GridContainer>
		)
	}
}

export default withLocalization()(withStyles(createprojectStyles)(CreateProjectForm))