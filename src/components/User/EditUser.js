import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { editUser } from 'variables/dataUsers';
import { getAllOrgs } from 'variables/dataOrgs';
import { GridContainer, ItemGrid, DatePicker, Warning, Danger, TextF, CircularLoader, ItemG, DSelect } from 'components';
import { Paper, Collapse, withStyles, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import classNames from 'classnames';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import { isFav, updateFav } from 'redux/favorites';
import { getSettings } from 'redux/settings';
import { getUserLS, getUsers, getOrgs } from 'redux/data';

class EditUser extends Component {
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
				birthday: "",
				newsletter: true,
			},
			user: null
			// userName: '',
			// firstName: '',
			// lastName: '',
			// phone: '',
			// email: '',
			// image: null,
			// aux: {
			// 	odeum: {
			// 		language: 'da'
			// 	},
			// 	senti: {

			// 	}
			// },
			// sysLang: 2,
			// org: {
			// 	id: '',
			// 	name: 'Ingen organisation'
			// },
			// groups: {
			// 	'136550100000225': {
			// 		id: 136550100000225,
			// 		name: 'Senti User'
			// 	}
			// }
			,
			orgs: [],
			creating: false,
			created: false,
			loading: true,
			selectedGroup: '',
		}
	}
	keyHandler = (e) => {
		if (e.key === 'Escape') {
			this.goToUser()
		}
	}
	componentDidMount = async () => {
		this._isMounted = 1
		window.addEventListener('keydown', this.keyHandler, false)
		const { setHeader, location } = this.props
		let prevURL = location.prevURL ? location.prevURL : '/management/users'
		setHeader('users.editUser', true, prevURL, 'users')
		if (this._isMounted) {
			await this.getUser()
			this.props.setBC('edituser', this.state.user.firstName + ' ' + this.state.user.lastName, this.state.user.id)
			this.props.setTabs({
				id: "editUser",
				tabs: []
			})
			await this.getOrgs()
		}
	}
	componentDidUpdate = (prevProps, prevState) => {
		const { user } = this.props
		if ((!prevProps.user && user !== prevProps.user) || (this.state.user === null && user)) {
			let g = 0
			let userGroups = Object.keys(user.groups)
			userGroups.sort((a, b) => a > b ? 1 : -1)
			if (userGroups.find(x => x === '136550100000211'))
				g = '136550100000211'
			if (userGroups.find(x => x === '136550100000225'))
				g = '136550100000225'
			if (userGroups.find(x => x === '136550100000143'))
				g = '136550100000143'

			this.setState({
				selectedGroup: g,
				user: {
					...user,
					groups: Object.keys(user.groups).map(g => ({ id: g, name: user.groups[g].name, appId: user.groups[g].appId }))
				},
				extended: user.aux.senti ? user.aux.senti.extendedProfile ? { ...user.aux.senti.extendedProfile } : { ...this.state.extended } : { ...this.state.extended }

			})
		}
	}

	componentWillUnmount = () => {
		this._isMounted = 0
		window.removeEventListener('keydown', this.keyHandler, false)
	}
	getUser = async () => {
		const { getUser } = this.props
		let id = this.props.match.params.id
		if (id) {
			await getUser(id).then(() => {

			})


		}
	}
	getOrgs = async () => {
		let orgs = await getAllOrgs().then(rs => rs)
		this.setState({
			orgs: orgs,
			loading: false
		})
	}
	handleEditUser = async () => {
		const { user, openExtended } = this.state
		let groups = {}
		this.state.user.groups.forEach(x => {
			groups[x.id] = {
				...x
			}
		})
		let newUser = {
			...this.state.user,
			userName: user.email,
			groups: groups
		}
		if (openExtended) {
			newUser.aux.senti.extendedProfile = this.state.extended
		}
		await editUser(newUser).then(rs => rs ?
			this.close() :
			this.setState({ created: false, creating: false, error: true, errorMessage: this.props.t('orgs.validation.networkError') })

		)
	}
	goToUser = () => {
		const { user } = this.state
		const { history, location } = this.props
		history.push(location.prevURL ? location.prevURL : `/management/user/${user.id}`)
	}
	close = async () => {
		const { isFav, updateFav } = this.props
		const { user } = this.state
		let favObj = {
			id: user.id,
			name: `${user.firstName} ${user.lastName}`,
			type: 'user',
			path: `/management/user/${user.id}`
		}
		await this.props.getSettings()
		if (isFav(favObj)) {
			updateFav(favObj)
		}
		this.setState({ created: true, creating: false })
		const { s, history } = this.props
		s('snackbars.userUpdated', { user: `${user.firstName} ${user.lastName}` })
		history.push(`/management/user/${user.id}`)
	}

	handleChange = prop => e => {
		this.setState({
			user: {
				...this.state.user,
				[prop]: e.target.value
			}
		})
	}
	handleValidation = () => {
		let errorCode = [];
		const { email } = this.state.user
		if (email === '') {
			errorCode.push(4)
		}
		this.setState({
			errorMessage: errorCode.map(c => <Danger key={c}>{this.errorMessages(c)}</Danger>),
		})
		if (errorCode.length === 0)
			return true
		else
			return false
	}
	errorMessages = code => {
		const { t } = this.props
		switch (code) {
			case 0:
				return t('users.validation.nouserName')
			case 1:
				return t('users.validation.nofirstName')
			case 2:
				return t('users.validation.nolastName')
			case 3:
				return t('users.validation.nophone')
			case 4:
				return t('users.validation.noemail')
			case 5:
				return t('users.validation.noorg')
			case 6:
				return t('users.validation.nogroup')
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
		const { user } = this.state
		let groups = user.groups
		groups = groups.filter(x => !this.groups().some(y => x.id === y.id))
		let g = this.groups()[this.groups().findIndex(x => x.id === e.target.value)]
		groups.push(g)
		this.setState({
			selectedGroup: e.target.value,
			user: {
				...this.state.user,
				groups: groups
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
	handleExtendedNewsletter = () => {
		this.setState({
			extended: {
				...this.state.extended,
				newsletter: !this.state.extended.newsletter
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
	renderExtendedProfile = () => {
		const { openExtended, error, extended } = this.state
		const { classes, t } = this.props
		return <Collapse in={openExtended}>
			<ItemGrid container xs={12} md={6}>
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
			<ItemGrid container xs={12} md={6}>
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
			<ItemGrid container xs={12} md={6}>
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
			<ItemGrid container xs={12} md={6}>
				<TextF
					id={'recoveryEmail'}
					label={t('users.fields.recoveryEmail')}
					value={extended.recoveryEmail ? extended.recoveryEmail : ""}
					className={classes.textField}
					handleChange={this.handleExtendedChange('recoveryEmail')}
					margin='normal'
					error={error}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} md={6}>
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
			<ItemGrid container xs={12} md={6}>
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
			<ItemGrid container xs={12} md={6}>
				<DatePicker
					label={t('users.fields.birthday')}
					format='ll'
					value={extended.birthday}
					className={classes.textField}
					onChange={this.handleExtendedBirthdayChange('birthday')}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} md={6}>
				<FormControlLabel
					control={
						<Checkbox
							checked={extended.newsletter}
							onChange={this.handleExtendedNewsletter}
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
		const { classes, t, loading } = this.props
		const buttonClassname = classNames({
			[classes.buttonSuccess]: created,
		})
		return !loading && user ?
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
						<ItemG xs={12}>
							{this.renderExtendedProfile()}
						</ItemG>
						<ItemGrid container xs={12} md={12}>
							<Button color={'primary'} onClick={() => this.setState({ openExtended: !this.state.openExtended })}>{t('actions.extendProfile')}</Button>
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
								// color={'danger'}
								onClick={this.goToUser}
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
								disabled={this.state.creating || this.state.created}
								onClick={this.handleEditUser}>
								{this.state.created ?
									<Fragment>{t('snackbars.redirect')}</Fragment>
									: <Fragment>{t('actions.save')}</Fragment>}
							</Button>
						</div>
					</ItemGrid>
				</Paper>

			</GridContainer> : <CircularLoader />

	}
}

const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	user: state.data.user,
	loading: !state.data.gotUser
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	updateFav: (favObj) => dispatch(updateFav(favObj)),
	getSettings: async () => dispatch(await getSettings()),
	getUser: async id => dispatch(await getUserLS(id)),
	getUsers: reload => dispatch(getUsers(reload)),
	getOrgs: reload => dispatch(getOrgs(reload))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(createprojectStyles)(EditUser))
