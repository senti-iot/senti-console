import React, { useState, useCallback, useEffect } from 'react'
import { Paper, Collapse, Button, Fade } from '@material-ui/core'
import { Check } from 'variables/icons'
import classNames from 'classnames'
import { updateOrg } from 'variables/dataOrgs'
import { ItemGrid, CircularLoader, GridContainer, Danger } from 'components'
import { useSelector, useDispatch } from 'react-redux'
import { updateFav, isFav } from 'redux/favorites'
import { getOrgLS, getOrgs } from 'redux/data'
import { camelCase } from 'variables/functions'
import { useLocalization, useEventListener, useLocation, useHistory, useParams, useSnackbar } from 'hooks'
import CreateOrgForm from 'components/Orgs/CreateOrgForm'
import createOrgStyles from 'assets/jss/components/orgs/createOrgStyles'
var countries = require('i18n-iso-countries')


const EditOrg = props => {

	//Hooks
	const t = useLocalization()
	const s = useSnackbar().s
	const location = useLocation()
	const history = useHistory()
	const params = useParams()
	const dispatch = useDispatch()
	const classes = createOrgStyles()


	//Redux
	const rOrg = useSelector(s => s.data.org)
	const language = useSelector(s => s.settings.language)
	const loading = useSelector(s => !s.data.gotOrg)

	//State
	const [org, setOrg] = useState(null)
	const [country, setCountry] = useState({
		label: '',
		value: -1
	})
	const [creating, setCreating] = useState(false)
	const [created, setCreated] = useState(false)
	const [error, setError] = useState(null)
	const [errorMessage, setErrorMessage] = useState(null)
	const [openOrg, setOpenOrg] = useState(false)

	//Const
	const { setHeader, setBC, setTabs } = props
	//useCallbacks
	const getOrg = useCallback(async () => {
		let id = params.id
		if (id) {
			await dispatch(await getOrgLS(id))

		}
	}, [dispatch, params.id])
	const goToOrg = useCallback(() => {
		let prevURL = location.prevURL
		history.push(prevURL ? prevURL : '/management/org/' + rOrg.id)
	}, [location.prevURL, history, rOrg])

	const handleKeyPress = useCallback((e) => {
		if (e.key === 'Escape') {
			goToOrg()
		}
	}, [goToOrg])

	//useEventListener

	useEventListener('keydown', handleKeyPress)

	//useEffects

	const getCountryID = useCallback(c => c ? c.length > 2 ? countries.getAlpha2Code(c, 'en') ? countries.getAlpha2Code(c, 'en') : countries.getAlpha2Code(c, 'da') : c : c, [])
	const getCountryLabel = useCallback(l => countries.getName(l, language) ? countries.getName(l, language) : '', [language])

	useEffect(() => {
		let gOrg = async () => await getOrg()
		gOrg()
		return () => {
			dispatch(getOrgs(true))
		}
		//eslint-disable-next-line
	}, [])

	useEffect(() => {

		if (rOrg && !org) {
			setOrg({
				...rOrg,
				org: {
					...rOrg.org,
					name: rOrg.org.id === -1 ? t('no.org') : rOrg.org.name
				}
			})
			setCountry({
				id: getCountryID(rOrg.country),
				label: getCountryLabel(rOrg.country)
			})
		}
	}, [getCountryID, getCountryLabel, org, rOrg, t])
	useEffect(() => {
		if (rOrg) {
			let prevURL = location.prevURL
			setHeader('orgs.updateOrg', true, prevURL, 'users')
			setBC('editorg', rOrg.name, rOrg.id)
			setTabs({
				id: "editOrg",
				tabs: []
			})
		}
	}, [location.prevURL, rOrg, setBC, setHeader, setTabs])

	//Handlers
	const errorMessages = code => {
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
			default:
				return ''
		}
	}

	const handleValidation = () => {
		let errorCode = []
		const { name, /* address, city, zip, country  */ } = org
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
		setErrorMessage(errorCode.map(c => <Danger key={c}>{errorMessages(c)}</Danger>))
		if (errorCode.length === 0)
			return true
		else
			return false
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
		if (error) {
			setError(false)
			setErrorMessage(null)
		}
		if (e.target.validity.valid) {
			if (id === 'name') {
				setOrg({
					...org,
					name: e.target.value,
					nickname: camelCase(e.target.value)
				})
			}
			else {
				setOrg({
					...org,
					[id]: e.target.value
				})
			}
		}
	}
	const close = () => {
		let favObj = {
			id: org.id,
			name: org.name,
			type: 'org',
			path: `/management/org/${org.id}`
		}
		if (dispatch(isFav(favObj))) {
			dispatch(updateFav(favObj))
		}
		setCreated(true)
		setCreating(false)
		s('snackbars.orgUpdated', ({ org: org.name }))
		// dispatch(getOrgLS(org.id))
		getOrg(org.id)
		dispatch(getOrgs(true))
		history.push(`/management/org/${org.id}`)
	}

	const handleUpdateOrg = () => {
		if (handleValidation()) {
			return updateOrg(org).then(rs => {
				if (rs) {
					close(rs)
				}
				else {
					setCreated(false)
					setCreating(false)
					setError(true)
					setErrorMessage(t('orgs.validation.networkError'))
				}
			}
			)
		}
		else {
			setCreating(false)
			setError(true)
		}

	}
	const handleOpenOrg = () => setOpenOrg(true)
	const handleCloseOrg = () => setOpenOrg(false)

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
		!loading && org ?
			<GridContainer justify={'center'}>
				<Fade in={true}>
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
									// color={'danger'}
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
									onClick={created ? goToOrg : handleUpdateOrg}>
									{created ?
										<><Check className={classes.leftIcon} />{t('snackbars.redirect')}</>
										: t('actions.save')}
								</Button>

							</div>
						</ItemGrid>
					</Paper>
				</Fade>
			</GridContainer >
			: <CircularLoader />
	)
}


export default EditOrg
