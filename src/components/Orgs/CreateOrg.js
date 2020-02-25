import React, { useState, useEffect } from 'react'
import { Paper, withStyles, Collapse, Button } from '@material-ui/core'
import classNames from 'classnames'
import { ItemGrid, CircularLoader, GridContainer, Danger } from 'components'
import { useSelector, useDispatch } from 'react-redux'
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles'
import { createOrg } from 'variables/dataOrgs'
import { getOrgs } from 'redux/data'
import { camelCase } from 'variables/functions'
import { useLocalization, useSnackbar, useHistory, useEventListener } from 'hooks'
import CreateOrgForm from 'components/Orgs/CreateOrgForm'
import { useCallback } from 'react'
import createOrgStyles from 'assets/jss/components/orgs/createOrgStyles'
var countries = require('i18n-iso-countries')

const CreateOrg = props => {
	//Hooks
	const t = useLocalization()
	const s = useSnackbar().s
	const dispatch = useDispatch()
	const history = useHistory()
	const classes = createOrgStyles()

	//Redux
	const language = useSelector(state => state.localization.language)
	// const accessLevel = useSelector(state => state.settings.user.privileges)

	//State
	const [openOrg, setOpenOrg] = useState(false)
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
			id: -1,
			name: t('no.org')
		}
	})
	const [country, setCountry] = useState({
		id: '',
		label: ''
	})
	const [creating, setCreating] = useState(false)
	const [created, setCreated] = useState(false)
	// const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null) // added
	const [errorMessage, setErrorMessage] = useState(null) // added

	//Const
	const { setBC, setHeader, setTabs } = props

	//useCallbacks
	const goToOrg = useCallback(() => {
		history.push('/management/orgs/')
	}, [history])

	const handleKeyPress = useCallback((e) => {
		if (e.key === 'Escape') {
			goToOrg()
		}
	}, [goToOrg])

	//useEventListener
	useEventListener('keydown', handleKeyPress)

	//useEffects
	useEffect(() => {
		let prevURL = `/management/orgs`

		setBC('createorg')
		setHeader('orgs.createOrg', true, prevURL, 'users')
		setTabs({
			id: "createOrg",
			tabs: [],
			route: 0
		})
	}, [setBC, setHeader, setTabs])

	//Handlers
	const handleOpenOrg = () => setOpenOrg(true)
	const handleCloseOrg = () => setOpenOrg(false)

	const handleValidation = () => {
		let errorCode = []
		const { name } = org
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
		// if (selectedOrg === null) {
		// 	errorCode.push(5)
		// }

		setErrorMessage(errorCode.map(c => <Danger key={c}>{errorMessages(c)}</Danger>))

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
		if (error) {
			setError(false)
			setErrorMessage(null)
		} setCountry({ id: value, label: value })
		setOrg({
			...org,
			country: countries.getAlpha2Code(value, language) ? countries.getAlpha2Code(value, language) : ''
		})
	}
	const handleAuxChange = (id) => e => {
		e.preventDefault()
		if (error) {
			setError(false)
			setErrorMessage(null)
		}
		setOrg({
			...org,
			aux: {
				...org.aux,
				[id]: e.target.value
			}
		})

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
			}
			else {
				setError(false)
				setOrg({
					...org,
					[id]: e.target.value
				})
			}
		}
	}
	const close = (rs) => {
		setCreated(true)
		setCreating(false)
		// setOrg(rs)
		dispatch(getOrgs(true))
		s('snackbars.orgCreated', { org: rs.name })
		history.push(`/management/org/${rs.id}`)
	}
	const handleCreateOrg = async () => {
		if (handleValidation()) {
			let newOrg = {
				...org,

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
			})
		}
		else {
			setCreating(false)
			setError(true)
		}
	}

	const handleChangeOrg = nOrg => {
		setOrg({
			...org,
			org: nOrg
		})
		handleCloseOrg()
	}


	const buttonClassname = classNames({
		[classes.buttonSuccess]: created,
	})

	return (
		<GridContainer justify={'center'}>
			<Paper className={classes.paper}>
				<CreateOrgForm
					/* Defaults */
					org={org}
					t={t}
					error={error}
					errorMessage={errorMessage}
					classes={classes}
					/*Assign Org*/
					openOrg={openOrg}
					handleOpenOrg={handleOpenOrg}
					handleCloseOrg={handleCloseOrg}
					handleChangeOrg={handleChangeOrg}
					/* Org */
					handleChange={handleChange}
					handleAuxChange={handleAuxChange}
					/* Countries */
					country={country}
					countries={countries}
					handleCountryChange={handleCountryChange}
					language={language}
				/>
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
								<>{t('snackbars.redirect')}</>
								: t('actions.save')}
						</Button>
					</div>
				</ItemGrid>
			</Paper>
		</GridContainer>
	)
}

export default withStyles(createprojectStyles, { withTheme: true })(CreateOrg)
