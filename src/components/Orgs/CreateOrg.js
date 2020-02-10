import React, { Fragment, useState, useEffect } from 'react'
import { Paper, withStyles, Collapse, Button } from '@material-ui/core';
import classNames from 'classnames';
import { TextF, ItemGrid, CircularLoader, GridContainer, Danger, Warning, DSelect } from 'components'
import { useSelector, useDispatch } from 'react-redux'
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles'
import EditOrgAutoSuggest from './EditOrgAutoSuggest';
import { createOrg, getAllOrgs } from 'variables/dataOrgs';
import { getOrgs } from 'redux/data';
import { camelCase } from 'variables/functions';
import { useLocalization, useSnackbar } from 'hooks';
var countries = require('i18n-iso-countries');

// const mapStateToProps = (state) => ({
// 	language: state.localization.language,
// 	accessLevel: state.settings.user.privileges
// })

// const mapDispatchToProps = dispatch => ({
// 	getOrgs: reload => dispatch(getOrgs(reload))
// })

// @Andrei
const CreateOrg = props => {
	props.setBC('createorg')
	let timer

	const t = useLocalization()
	const s = useSnackbar().s
	const dispatch = useDispatch()
	const language = useSelector(state => state.localization.language)
	const accessLevel = useSelector(state => state.settings.user.privileges)

	const [orgs, setOrgs] = useState([]) // added
	const [org, setOrg] = useState({
		id: -1,
		name: '',
		nickname: '',
		address: '',
		city: '',
		zip: '',
		region: '',
		country: '',
		url: '',
		aux: {
			cvr: '',
			ean: ''
		},
		org: {
			id: -1
		}
	})
	const [selectedOrg, /* setSelectedOrg */] = useState('')
	const [country, setCountry] = useState({
		id: '',
		label: ''
	})
	const [creating, setCreating] = useState(false)
	const [created, setCreated] = useState(false)
	const [loading, setLoading] = useState(true)
	// const [openSnackBar, setOpenSnackBar] = useState(false)
	const [error, setError] = useState(null) // added
	const [errorMessage, setErrorMessage] = useState(null) // added
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		org: {
	// 			id: -1,
	// 			name: '',
	// 			nickname: '',
	// 			address: '',
	// 			city: '',
	// 			zip: '',
	// 			region: '',
	// 			country: '',
	// 			url: '',
	// 			aux: {
	// 				cvr: '',
	// 				ean: ''
	// 			},
	// 			org: {
	// 				id: -1
	// 			}
	// 		},
	// 		selectedOrg: '',
	// 		country: {
	// 			id: '',
	// 			label: ''
	// 		},
	// 		creating: false,
	// 		created: false,
	// 		loading: true,
	// 		openSnackBar: false,
	// 	}
	// 	props.setBC('createorg')
	// }
	const goToOrg = () => {
		const { history, location } = props
		history.push(location.prevURL ? location.prevURL : '/management/orgs/')
	}
	const keyHandler = (e) => {
		if (e.key === 'Escape') {
			goToOrg()
		}
	}

	useEffect(() => {
		const asyncFunc = async () => {
			window.addEventListener('keydown', keyHandler, false)
			const { setHeader, location, setTabs } = props
			let prevURL = location.prevURL ? location.prevURL : `/management/orgs`
			setHeader('orgs.createOrg', true, prevURL, 'users')
			setTabs({
				id: "createOrg",
				tabs: []
			})
			await getAllOrgs().then(rs => {
				if (accessLevel.apisuperuser) {
					rs.unshift({ id: -1, name: t('orgs.fields.topLevelOrg') })
				}
				setOrgs(rs)
				setLoading(false)
				// if (this._isMounted) {
				// 	if (accessLevel.apisuperuser)
				// 		rs.unshift({ id: -1, name: t('orgs.fields.topLevelOrg') })
				// 	this.setState({ orgs: rs, loading: false })
				// }
			})
		}
		asyncFunc()

		return () => {
			window.removeEventListener('keydown', keyHandler, false)
			clearTimeout(timer)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = async () => {
	// 	this._isMounted = 1
	// 	window.addEventListener('keydown', this.keyHandler, false)
	// 	const { t, accessLevel, setHeader, location, setTabs } = this.props
	// 	let prevURL = location.prevURL ? location.prevURL : `/management/orgs`
	// 	setHeader('orgs.createOrg', true, prevURL, 'users')
	// 	setTabs({
	// 		id: "createOrg",
	// 		tabs: []
	// 	})
	// 	await getAllOrgs().then(rs => {
	// 		if (this._isMounted) {
	// 			if (accessLevel.apisuperuser)
	// 				rs.unshift({ id: -1, name: t('orgs.fields.topLevelOrg') })
	// 			this.setState({ orgs: rs, loading: false })
	// 		}
	// 	})
	// }


	// componentWillUnmount = () => {
	// 	window.removeEventListener('keydown', this.keyHandler, false)
	// 	this._isMounted = 0
	// 	clearTimeout(this.timer)
	// }

	const handleValidation = () => {
		let errorCode = [];
		const { name, /* address, city, zip, country */ } = org
		// const { selectedOrg } = this.state
		if (name === '') {
			errorCode.push(0)
		}
		// if (address === '') {
		// 	errorCode.push(1)
		// }
		// if (city === '') {
		// 	errorCode.push(2)
		// }
		// if (zip === '') {
		// 	errorCode.push(3)
		// }
		// if (country === '') {
		// 	errorCode.push(4)
		// }
		if (selectedOrg === null) {
			errorCode.push(5)
		}
		// if (!url.includes('http')) {
		// 	errorCode.push(6)
		// }
		setErrorMessage(errorCode.map(c => <Danger key={c}>{errorMessages(c)}</Danger>))
		// this.setState({
		// 	errorMessage: errorCode.map(c => <Danger key={c}>{this.errorMessages(c)}</Danger>),
		// })
		if (errorCode.length === 0)
			return true
		else
			return false
	}
	const errorMessages = code => {
		// const { t } = this.props
		switch (code) {
			case 0:
				return t('orgs.validation.noName')
			case 1:
				return t('orgs.validation.noAddress')
			case 2:
				return t('orgs.validation.noCity')
			case 3:
				return t('orgs.validation.noZip')
			case 4:
				return t('orgs.validation.noCountry')
			case 5:
				return t('orgs.validation.noParent')
			case 6:
				return t('orgs.validation.notWebsite')
			default:
				return ''
		}
	}


	const handleCountryChange = value => {
		setError(false)
		setCountry({ id: value, label: value })
		setOrg({
			...org,
			country: countries.getAlpha2Code(value, language) ? countries.getAlpha2Code(value, language) : ''
		})
		// this.setState({
		// 	error: false,
		// 	country: { id: value, label: value },
		// 	org: {
		// 		...this.state.org,
		// 		country: countries.getAlpha2Code(value, this.props.language) ? countries.getAlpha2Code(value, this.props.language) : ''
		// 	}
		// })
	}
	const handleAuxChange = (id) => e => {
		e.preventDefault()
		setError(false)
		setOrg({
			...org,
			aux: {
				...org.aux,
				[id]: e.target.value
			}
		})
		// this.setState({
		// 	error: false,
		// 	org: {
		// 		...this.state.org,
		// 		aux: {
		// 			...this.state.org.aux,
		// 			[id]: e.target.value
		// 		}
		// 	}
		// })
	}

	const handleChange = (id) => e => {
		e.preventDefault()
		if (e.target.validity.valid) {
			if (id === 'name') {
				setError(false)
				setOrg({
					...org,
					name: e.target.value,
					nickname: camelCase(e.target.value)
				})
				// this.setState({
				// 	error: false,
				// 	org: {
				// 		...this.state.org,
				// 		name: e.target.value,
				// 		nickname: camelCase(e.target.value)
				// 	}
				// })
			}
			else {
				setError(false)
				setOrg({
					...org,
					[id]: e.target.value
				})
				// this.setState({
				// 	error: false,
				// 	org: {
				// 		...this.state.org,
				// 		[id]: e.target.value
				// 	}
				// })
			}
		}
	}
	const close = (rs) => {
		setCreated(true)
		setCreating(false)
		setOrg(rs)
		// this.setState({ created: true, creating: false, org: rs })
		dispatch(getOrgs(true))
		// this.props.getOrgs(true)
		s('snackbars.orgCreated', { org: org.name })
		props.history.push(`/management/org/${org.id}`)
	}
	const handleCreateOrg = async () => {
		if (handleValidation()) {
			let newOrg = {
				...org,
				org: {
					id: selectedOrg ? selectedOrg : -1
				}
			}
			return await createOrg(newOrg).then(rs => {
				if (rs) {
					close(rs)
				} else {
					setCreated(false)
					setCreating(false)
					setError(true)
					setErrorMessage(t('orgs.validation.networkError'))
				}
				// rs ?
				// close(rs) :
				// this.setState({ created: false, creating: false, error: true, errorMessage: this.props.t('orgs.validation.networkError') })
			})
		}
		else {
			setCreating(false)
			setError(true)
			// this.setState({
			// 	creating: false,
			// 	error: true,
			// })
		}
	}

	const handleOrgChange = e => {
		setOrg({
			...org,
			org: {
				id: e.target.value
			}
		})
		// this.setState({
		// 	org: {
		// 		...this.state.org,
		// 		org: {
		// 			id: e.target.value
		// 		}
		// 	}
		// })
	}

	const renderOrgs = () => {
		// const { t } = this.props
		// const { orgs, org } = this.state
		return <DSelect
			label={t('orgs.fields.parentOrg')}
			value={org.org.id}
			onChange={handleOrgChange}
			menuItems={orgs.map(org => ({ value: org.id, label: org.name }))}
		/>
	}


	const { classes } = props
	// const { created, error, loading, org } = this.state
	const buttonClassname = classNames({
		[classes.buttonSuccess]: created,
	})

	return (
		!loading ?
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
						<ItemGrid container xs={12} md={6}>
							<TextF
								autoFocus
								id={'name'}
								label={t('orgs.fields.name')}
								value={org.name}
								className={classes.textField}
								onChange={handleChange('name')}
								margin='normal'

								error={error}
							/>
						</ItemGrid>
						<ItemGrid container xs={12} md={6}>
							<TextF
								id={'nickname'}
								label={t('orgs.fields.nickname')}
								value={org.nickname}
								className={classes.textField}
								onChange={handleChange('nickname')}
								margin='normal'
								error={error}
							/>
						</ItemGrid>
						<ItemGrid container xs={12} md={6}>
							<TextF

								id={'address'}
								label={t('orgs.fields.address')}
								value={org.address}
								className={classes.textField}
								onChange={handleChange('address')}
								margin='normal'

								error={error}
							/>
						</ItemGrid>
						<ItemGrid container xs={12} md={6}>
							<TextF

								id={'zip'}
								label={t('orgs.fields.zip')}
								value={org.zip}
								className={classes.textField}
								onChange={handleChange('zip')}
								margin='normal'

								error={error}
								type={'number'}
								pattern='[0-9]*'
							/>
						</ItemGrid>
						<ItemGrid container xs={12} md={6}>
							<TextF

								id={'city'}
								label={t('orgs.fields.city')}
								value={org.city}
								className={classes.textField}
								onChange={handleChange('city')}
								margin='normal'

								error={error}
							/>
						</ItemGrid>

						<ItemGrid container xs={12} md={6}>
							<TextF

								id={'region'}
								label={t('orgs.fields.region')}
								value={org.region}
								className={classes.textField}
								onChange={handleChange('region')}
								margin='normal'

								error={error}
							/>
						</ItemGrid>
						<ItemGrid container xs={12}>
							<EditOrgAutoSuggest
								error={error}
								country={country.label ? country.label : country.id}
								handleChange={handleCountryChange}
								t={t}
								suggestions={
									Object.entries(countries.getNames(language)).map(
										country => ({ value: country[1], label: country[1] }))
								} />
						</ItemGrid>
						<ItemGrid container xs={12} md={6}>
							<TextF

								id={'url'}
								label={t('orgs.fields.url')}
								value={org.url}
								className={classes.textField}
								onChange={handleChange('url')}
								margin='normal'

								error={error}
							/>
						</ItemGrid>
						<ItemGrid container xs={12} md={6}>
							{renderOrgs()}
						</ItemGrid>
						<ItemGrid container xs={12} md={6}>
							<TextF
								id={'cvr'}
								label={t('orgs.fields.CVR')}
								value={org.aux.cvr}
								className={classes.textField}
								onChange={handleAuxChange('cvr')}
								margin='normal'

								error={error}
							/>
						</ItemGrid>
						<ItemGrid container xs={12} md={6}>
							<TextF
								id={'ean'}
								label={t('orgs.fields.EAN')}
								value={org.aux.ean}
								className={classes.textField}
								onChange={handleAuxChange('ean')}
								margin='normal'

								error={error}
							/>
						</ItemGrid>
					</form>

					<ItemGrid xs={12} container justify={'center'}>
						<Collapse in={creating} timeout='auto' unmountOnExit>
							<CircularLoader fill />
						</Collapse>
					</ItemGrid>
					<ItemGrid container style={{ margin: 16 }}>
						<div className={classes.wrapper}>
							<Button
								variant='outlined'
								onClick={goToOrg}
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
								onClick={created ? goToOrg : handleCreateOrg}>
								{created ?
									<Fragment>{t('snackbars.redirect')}</Fragment>
									: t('actions.save')}
							</Button>
						</div>
					</ItemGrid>
				</Paper>
			</GridContainer>
			: <CircularLoader />
	)
}

export default withStyles(createprojectStyles, { withTheme: true })(CreateOrg)
