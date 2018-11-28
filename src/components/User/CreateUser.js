import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { createUser } from 'variables/dataUsers';
import { getAllOrgs } from 'variables/dataOrgs';
import { GridContainer, ItemGrid, Warning, Danger, TextF, CircularLoader } from 'components';
import { Paper, Collapse, withStyles, MenuItem, Select, FormControl, InputLabel, Grid, Button } from '@material-ui/core';
import { Save } from 'variables/icons'
import classNames from 'classnames';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';

class CreateUser extends Component {
	constructor(props) {
		super(props)

		this.state = {
			user: {
				userName: '',
				firstName: '',
				lastName: '',
				phone: '',
				email: '',
				image: null,
				aux: {
					odeum: {
						language: 'da'
					},
					senti: {
						
					}
				},
				sysLang: 2,
				org: {
					id: 0,
					name: 'Ingen organisation'
				},
				groups: {
					136550100000225: {
						id: 136550100000225,
						name: 'Senti User'
					} 
				}
			},
			orgs: [],
			creating: false,
			created: false,
			loading: true,
			selectedGroup: 136550100000225,
		}
	}
    componentDidMount = async () => {
    	this._isMounted = 1
    	const { setHeader } = this.props
    	setHeader('menus.create.user', true, '/management/users', 'users')
    	if (this._isMounted)
    		await this.getOrgs()
    }
    componentWillUnmount = () => {
    	this._isMounted = 0
    }
    getOrgs = async () => { 
    	let orgs = await getAllOrgs().then(rs => rs)
    	this.setState({
    		orgs: orgs,
    		loading: false
    	})
    } 
    handleCreateUser = async () => {
    	const { user } = this.state
    	let newUser = {
    		...this.state.user,
    		userName: user.email
    	}
    	if (this.handleValidation()) {
    		await createUser(newUser).then(rs => {
    		return rs !== 400 ?
    			this.close(rs) :
    			this.setState({ created: false, creating: false, error: true, errorMessage: this.errorMessages(rs) })
    		})
    	}
    }
	close = (rs) => {
		this.setState({ created: true, creating: false, org: rs }) 
		const { history, s } = this.props
		s('snackbars.userCreated', { user: `${rs.firstName} ${rs.lastName}` })
		history.push(`/management/user/${rs.id}`)
	}
	handleChange = prop => e => {
		const { error } = this.state
		if (error) {
			this.setState({
				error: false,
				errorMessage: [],
				user: {
					...this.state.user,
					[prop]: e.target.value
				}
			})
		}
		else { 
			this.setState({
				user: {
					...this.state.user,
					[prop]: e.target.value
				}
			})
		}
	}
    handleValidation = () => {
    	let errorCode = [];
    	const { email, org } = this.state.user
    	if (email === '') {
    		errorCode.push(4)
    	}
    	if (org.id === 0) {
    		errorCode.push(5)
    	}
    	this.setState({
    		errorMessage: errorCode.map(c => <Danger key={c}>{this.errorMessages(c)}</Danger>),
    	})
    	if (errorCode.length === 0)
    		return true
    	else
    		this.setState({ error: true })
    		return false
    }
    errorMessages = code => {
    	const { t } = this.props
    	switch (code) {
    		case 0:
    			return t('users.validation.noUserName')
    		case 1:
    			return t('users.validation.noFirstName')
    		case 2:
    			return t('users.validation.noLastName')
    		case 3:
    			return t('users.validation.noPhone')
    		case 4:
    			return t('users.validation.noEmail')
    		case 5:
    			return t('users.validation.noOrg')
    		case 6: 
    			return t('users.validation.noGroup')
    		case 400: 
    			return t('users.validation.userAlreadyExists')
    		default:
    			return ''
    	}
	
    }
    handleLangChange = e => {
    	this.setState({
    		user: {
    			...this.state.user,
    			aux: {
    				...this.state.user.aux,
    				odeum: {
    					...this.state.user.aux.odeum,
    					language: e.target.value
    				}
    			}
    		}
    	})
    }
    handleGroupChange = e => { 
    	this.setState({
    		selectedGroup: e.target.value,
    		user: {
    			...this.state.user,
    			groups: {
    				[e.target.value]: {
    					id: e.target.value
    				}
    			}
    		}
    	})
    }
    handleOrgChange = e => {
    	this.setState({
    		user: {
    			...this.state.user,
    			org: {
    				id: e.target.value
    			}
    		}
    	})
    }
    renderOrgs = () => {
    	const { classes, t } = this.props
    	const { orgs, user, error } = this.state
    	const { org } = user
    	return <FormControl className={classes.formControl}>
    		<InputLabel error={error} FormLabelClasses={{ root: classes.label }} color={'primary'} htmlFor='select-multiple-chip'>
    			{t('users.fields.organisation')}
    		</InputLabel>
    		<Select
    			error={error}
    			fullWidth={false}
    			color={'primary'}
    			value={org.id}
    			onChange={this.handleOrgChange}
    			// renderValue={value => value.name}
    		>
    			{orgs ? orgs.map(org => (
    				<MenuItem
    					key={org.id}
    					value={org.id}
    				>
    					{org.name}
    				</MenuItem>
    			)) : null}
    		</Select>
    	</FormControl>
    }
    renderLanguage = () => {
    	const { t, classes } = this.props
    	const { error, user } = this.state
    	let languages = [
    		{ value: 'en', label: t('settings.languages.en') },
    		{ value: 'da', label: t('settings.languages.da') }
    	]
    	return <FormControl className={classes.formControl}>
    		<InputLabel error={error} FormLabelClasses={{ root: classes.label }} color={'primary'} htmlFor='select-multiple-chip'>
    			{t('users.fields.language')}
    		</InputLabel>
    		<Select
    			error={error}
    			fullWidth={false}
    			color={'primary'}
    			value={user.aux.odeum.language}
    			onChange={this.handleLangChange}
    		>
    			{languages.map(l => (
    				<MenuItem
    					key={l.value}
    					value={l.value}
    				>
    					{l.label}
    				</MenuItem>
    			))}
    		</Select>
    	</FormControl>
    }
    renderAccess = () => {
    	const { t, classes, accessLevel } = this.props
    	const { error, selectedGroup } = this.state
    	let groups = [
    		{
    			id: 136550100000211,
    			appId: 1220,
    			name: t('users.groups.accountManager'),
    			show: accessLevel.apiorg.editusers ? true : false
    			// description: ''
    		},
    		{
    			id: 136550100000143,
    			appId: 1220,
    			name: t('users.groups.superUser'),
    			show: accessLevel.apisuperuser ? true : false

    		},
    		{
    			id: 136550100000225,
    			appId: 1220,
    			name: t('users.groups.user'),
    			show: true
    		}
    	]
    	return <FormControl className={classes.formControl}>
    		<InputLabel error={error} FormLabelClasses={{ root: classes.label }} color={'primary'} htmlFor='select-multiple-chip'>
    			{t('users.fields.accessLevel')}
    		</InputLabel>
    		<Select
    			error={error}
    			fullWidth={false}
    			color={'primary'}
    			value={selectedGroup}
    			onChange={this.handleGroupChange}
    		>
    			{groups.map(g => g.show ? (
    				<MenuItem
    					key={g.id}
    					value={g.id}
    				>
    					{g.name}
    				</MenuItem>
    			) : null)}
    		</Select>
    	</FormControl>
    }
    render() {
    	const { error, errorMessage, user, created } = this.state
    	const { classes, t } = this.props
    	const buttonClassname = classNames({
    		[classes.buttonSuccess]: created,
    	})
    	return (
    		<GridContainer justify={'center'}>
    			<Paper className={classes.paper}>
    				<form className={classes.form}>
    					<ItemGrid xs={12}>
    						<Collapse in={this.state.error}>
    							<Warning>
    								<Danger>
    									{errorMessage}
    								</Danger>
    							</Warning>
    						</Collapse>
    					</ItemGrid>
    					<ItemGrid container xs={12} md={6}>
    						<TextF
    							id={'firstName'}
    							label={t('users.fields.firstName')}
    							value={user.firstName}
    							className={classes.textField}
    							handleChange={this.handleChange('firstName')}
    							margin='normal'
    							
    							error={error}
    						/>
    					</ItemGrid>
    					<ItemGrid container xs={12} md={6}>
    						<TextF
    							id={'lastName'}
    							label={t('users.fields.lastName')}
    							value={user.lastName}
    							className={classes.textField}
    							handleChange={this.handleChange('lastName')}
    							margin='normal'
    							
    							error={error}
    						/>
    					</ItemGrid>
    					<ItemGrid container xs={12} md={6}>
    						<TextF
    							id={'email'}
    							label={t('users.fields.email')}
    							value={user.email}
    							className={classes.textField}
    							handleChange={this.handleChange('email')}
    							margin='normal'
    							
    							error={error}
    						/>
    					</ItemGrid>
    					<ItemGrid container xs={12} md={6}>
    						<TextF
    							id={'phone'}
    							label={t('users.fields.phone')}
    							value={user.phone}
    							className={classes.textField}
    							handleChange={this.handleChange('phone')}
    							margin='normal'
    							
    							error={error}
    						/>
    					</ItemGrid>
    					<ItemGrid container xs={12} md={6}>
    						{this.renderLanguage()}
    					</ItemGrid>
    					<ItemGrid container xs={12} md={6}>
    						{this.renderOrgs()}
    					</ItemGrid>
    					<ItemGrid container xs={12} md={6}>
    						{this.renderAccess()}
    					</ItemGrid>
						
    				</form>
    				<ItemGrid xs={12} container justify={'center'}>
    					<Collapse in={this.state.creating} timeout='auto' unmountOnExit>
    						<CircularLoader notCentered />
    					</Collapse>
    				</ItemGrid>
    				<Grid container justify={'center'}>
    					<div className={classes.wrapper}>
    						<Button
    							variant='contained'
    							color='primary'
    							className={buttonClassname}
    							disabled={this.state.creating || this.state.created}
    							onClick={this.handleCreateUser}>
    							{this.state.created ?
    								<Fragment>{t('snackbars.redirect')}</Fragment>
    								: <Fragment><Save className={classes.leftIcon} />{t('menus.create.user')}</Fragment>}
    						</Button>
    					</div>
    				</Grid>
    			</Paper>
    		</GridContainer>
    	)
    }
}

const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(createprojectStyles)(CreateUser))
