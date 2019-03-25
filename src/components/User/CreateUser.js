import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { createUser } from 'variables/dataUsers';
import { getAllOrgs } from 'variables/dataOrgs';
import { GridContainer, ItemGrid, DatePicker, Warning, Danger, TextF, CircularLoader, DSelect, ItemG } from 'components';
import { Paper, Collapse, withStyles, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import classNames from 'classnames';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles'

class CreateUser extends Component {
	constructor(props) {
		super(props)

		this.state = {
			openExtended: false,
			extended: {
				bio: "",
				position: "",
				location: "",
				recoveryEmail: "",
				linkedInURL: "",
				twitterURL: "",
				birthday: null,
				newsletter: true,
			},
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
						extendedProfile: {
							newsletter: true,
						}
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
		props.setBC('createuser')
	}
	keyHandler = (e) => {
		if (e.key === 'Escape') {
			this.goToUser()
		}
	}
	componentDidMount = async () => {
		this._isMounted = 1
		window.addEventListener('keydown', this.keyHandler, false)

		const { setHeader } = this.props
		setHeader('menus.create.user', true, '/management/users', 'users')
		if (this._isMounted)
			await this.getOrgs()
	}
	componentWillUnmount = () => {
		this._isMounted = 0
		window.removeEventListener('keydown', this.keyHandler, false)

	}
	getOrgs = async () => {
		let orgs = await getAllOrgs().then(rs => rs)
		this.setState({
			orgs: orgs,
			user: {
				...this.state.user,
				org: {
					...this.props.user.org
				}
			},
			loading: false
		})
	}
	handleCreateUser = async () => {
		const { user, openExtended } = this.state
		let newUser = {
			...this.state.user,
			userName: user.email
		}
		if (openExtended)
			newUser.aux.senti.extendedProfile = this.state.extended
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
	handleExtendedBirthdayChange = prop => e => {

		const { error } = this.state
		if (error) {
			this.setState({
				error: false,
				errorMessage: []
			})
		}
		this.setState({
			extended: {
				...this.state.extended,
				[prop]: e
			}
		})
	}
	handleExtendedChange = prop => e => {

		const { error } = this.state
		if (error) {
			this.setState({
				error: false,
				errorMessage: []
			})
		}
		this.setState({
			extended: {
				...this.state.extended,
				[prop]: e.target.value
			}
		})
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
	goToUser = () => this.props.history.push('/management/users')
	renderOrgs = () => {
		const { t, accessLevel } = this.props
		const { orgs, user, error } = this.state
		const { org } = user
		return accessLevel.apiorg.editusers ?
			<DSelect
				label={t('users.fields.organisation')}
				error={error}
				value={org.id}
				onChange={this.handleOrgChange}
				menuItems={orgs.map(org => ({ value: org.id, label: org.name }))}
			/>
			: null
	}
	renderLanguage = () => {
		const { t } = this.props
		const { error, user } = this.state
		let languages = [
			{ value: 'en', label: t('settings.languages.en') },
			{ value: 'da', label: t('settings.languages.da') }
		]
		return <DSelect
			label={t('users.fields.language')}
			error={error}
			value={user.aux.odeum.language}
			menuItems={languages.map(l => ({ value: l.value, label: l.label }))}
		/>
	}
	groups = () => {
		const { accessLevel, t } = this.props
		return [
			{
				id: '136550100000211',
				appId: '1220',
				name: t('users.groups.accountManager'),
				show: accessLevel.apiorg.editusers ? true : false
			},
			{
				id: '136550100000143',
				appId: '1220',
				name: t('users.groups.superUser'),
				show: accessLevel.apisuperuser ? true : false

			},
			{
				id: '136550100000225',
				appId: '1220',
				name: t('users.groups.user'),
				show: true
			}
		]
	}
	renderAccess = () => {
		const { t, accessLevel } = this.props
		const { error, selectedGroup, user } = this.state
		let rend = false
		if ((accessLevel.apisuperuser) || (accessLevel.apiorg.editusers && !user.privileges.apisuperuser)) {
			rend = true
		}
		return rend ? <DSelect
			error={error}
			label={t('users.fields.accessLevel')}
			value={selectedGroup}
			onChange={this.handleGroupChange}
			menuItems={
				this.groups().filter(g => g.show ? true : false)
					.map(g => ({ value: g.id, label: g.name }))
			} /> : null
	}
	renderExtendedProfile = () => {
		const { openExtended, extended, error } = this.state
		const { classes, t } = this.props
		return <Collapse in={openExtended}>
			<ItemGrid container xs={12} >
				<TextF
					id={'bio'}
					label={t('users.fields.bio')}
					value={extended.bio}
					multiline
					rows={4}
					className={classes.textField}
					handleChange={this.handleExtendedChange('bio')}
					margin='normal'
					error={error}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} >
				<TextF
					id={'position'}
					label={t('users.fields.position')}
					value={extended.position}
					className={classes.textField}
					handleChange={this.handleExtendedChange('position')}
					margin='normal'
					error={error}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} >
				<TextF
					id={'location'}
					label={t('users.fields.location')}
					value={extended.location}
					className={classes.textField}
					handleChange={this.handleExtendedChange('location')}
					margin='normal'
					error={error}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} >
				<TextF
					id={'recoveryEmail'}
					label={t('users.fields.recoveryEmail')}
					value={extended.recoveryEmail}
					className={classes.textField}
					handleChange={this.handleExtendedChange('recoveryEmail')}
					margin='normal'
					error={error}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} >
				<TextF
					id={'linkedInURL'}
					label={t('users.fields.linkedInURL')}
					value={extended.linkedInURL}
					className={classes.textField}
					handleChange={this.handleExtendedChange('linkedInURL')}
					margin='normal'
					error={error}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} >
				<TextF
					id={'twitterURL'}
					label={t('users.fields.twitterURL')}
					value={extended.twitterURL}
					className={classes.textField}
					handleChange={this.handleExtendedChange('twitterURL')}
					margin='normal'
					error={error}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} >
				<DatePicker
					label={t('users.fields.birthday')}
					format='ll'
					value={extended.birthday}
					className={classes.textField}
					onChange={this.handleExtendedBirthdayChange('birthday')}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} >
				<FormControlLabel
					style={{ margin: 0 }}
					control={
						<Checkbox
							checked={extended.newsletter}
							onChange={this.handleExtendedChange('newsletter')}
							value="checkedB"
							color="primary"
						/>
					}
					label={t('users.fields.newsletter')}
				/>
			</ItemGrid>
		</Collapse>
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
						<ItemGrid container xs={12} >
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
						<ItemGrid container xs={12} >
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
						<ItemGrid container xs={12} >
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
						<ItemGrid container xs={12} >
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
						<ItemGrid container xs={12} >
							{this.renderLanguage()}
						</ItemGrid>
						<ItemGrid container xs={12} >
							{this.renderOrgs()}
						</ItemGrid>
						<ItemGrid container xs={12} >
							{this.renderAccess()}
						</ItemGrid>
						<ItemG xs={12}>
							{this.renderExtendedProfile()}
						</ItemG>
						<ItemGrid container xs={12} md={12}>
							<Button style={{ margin: 8 }} color={'primary'} onClick={() => this.setState({ openExtended: !this.state.openExtended })}>{t('actions.extendProfile')}</Button>
						</ItemGrid>
					</form>
					<ItemGrid xs={12} container justify={'center'}>
						<Collapse in={this.state.creating} timeout='auto' unmountOnExit>
							<CircularLoader notCentered />
						</Collapse>
					</ItemGrid>
					<ItemGrid container style={{ margin: 16 }}>
						<div className={classes.wrapper}>
							<Button
								variant='outlined'
								onClick={this.goToUser}
								className={classes.redButton}
							>
								{/* <Clear className={classes.leftIcon} /> */}{t('actions.cancel')}
							</Button>
						</div>
						<div className={classes.wrapper}>
							<Button
								variant='outlined'
								color='primary'
								className={buttonClassname}
								disabled={this.state.creating || this.state.created}
								onClick={this.handleCreateUser}>
								{this.state.created ?
									<Fragment>{t('snackbars.redirect')}</Fragment>
									: <Fragment>{/* <Save className={classes.leftIcon} /> */}{t('actions.save')}</Fragment>}
							</Button>
						</div>
					</ItemGrid>
				</Paper>
			</GridContainer>
		)
	}
}

const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	user: state.settings.user
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(createprojectStyles)(CreateUser))
