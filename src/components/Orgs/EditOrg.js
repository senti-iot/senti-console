import React, { Component, Fragment } from 'react'
import { Paper, withStyles, Collapse, Button, Fade } from '@material-ui/core';
import { Check } from 'variables/icons';
import classNames from 'classnames';
import { updateOrg } from 'variables/dataOrgs'
import { TextF, ItemGrid, CircularLoader, GridContainer, Danger, Warning, DSelect } from 'components'
import { connect } from 'react-redux'
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles'
import EditOrgAutoSuggest from './EditOrgAutoSuggest'
import { updateFav, isFav } from 'redux/favorites';
import { getOrgLS, getOrgs } from 'redux/data';

var countries = require('i18n-iso-countries');


class EditOrg extends Component {
	constructor(props) {
		super(props)

		this.state = {
			org: null,
			country: {
				label: '',
				value: -1
			},
			creating: false,
			created: false,
			loading: true,
		}
	}
	handleValidation = () => {
		let errorCode = [];
		const { name, address, city, zip, country } = this.state.org
		if (name === '') {
			errorCode.push(0)
		}
		if (address === '') {
			errorCode.push(1)
		}
		if (city === '') {
			errorCode.push(2)
		}
		if (zip === '') {
			errorCode.push(3)
		}
		if (country === '') {
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

	keyHandler = (e) => {
		if (e.key === 'Escape') {
			this.goToOrg()
		}
	}
	componentDidUpdate = (prevProps, prevState) => {
		const { org, t } = this.props
		if (org) {

			if ((!prevProps.org && org !== prevProps.org) || (this.state.org === null && org)) {
				this.setState({
					country: {
						id: org.country ?
							org.country.length > 2 ?
								countries.getAlpha2Code(org.country, 'en') ?
									countries.getAlpha2Code(org.country, 'en') : countries.getAlpha2Code(org.country, 'da') : this.state.country : this.state.country,
						label: countries.getName(org.country, this.props.language) ? countries.getName(org.country, this.props.language) : ''
					},
					org: {
						...org,
						aux: {
							...org.aux
						},
						country: org.country.length > 2 ? countries.getAlpha2Code(org.country, 'en') ? countries.getAlpha2Code(org.country, 'en') : countries.getAlpha2Code(org.country, 'da')
							: org.country
					},
					selectedOrg: {
						id: org.org.id > 0 ? org.org.id : -1,
						name: org.org.name !== null ? org.org.name : t('orgs.fields.topLevelOrg')
					}
				})
				// this.props.setHeader()
				this.props.setBC('editorg', org.name, org.id)
				this.props.setTabs({
					id: "editOrg",
					tabs: []
				})
			}
		}
	}
	componentDidMount = async () => {
		this._isMounted = 1
		window.addEventListener('keydown', this.keyHandler, false)

		let id = this.props.match.params.id
		const { location, getOrg, } = this.props
		getOrg(id)

		if (this.props.orgs) {
			this.setState({ orgs: this.props.orgs, loading: false })
		}
		else {
			getOrgs()
			this.setState({ orgs: this.props.orgs, loading: false })
		}

		this.setState({
			loading: false
		})
		let prevURL = location.prevURL ? location.prevURL : '/management/orgs'
		this.props.setHeader('orgs.updateOrg', true, prevURL, 'users')
	}

	componentWillUnmount = () => {
		this._isMounted = 0
		window.removeEventListener('keydown', this.keyHandler, false)
		clearTimeout(this.timer)
	}

	handleCountryChange = value => {
		this.setState({
			error: false,
			country: { id: value, label: value },
			org: {
				...this.state.org,
				country: countries.getAlpha2Code(value, this.props.language) ? countries.getAlpha2Code(value, this.props.language) : ''
			}
		})
	}
	handleAuxChange = (id) => e => {
		e.preventDefault()
		this.setState({
			error: false,
			org: {
				...this.state.org,
				aux: {
					...this.state.org.aux,
					[id]: e.target.value
				}
			}
		})
	}
	handleChange = (id) => e => {
		e.preventDefault()
		if (e.target.validity.valid) {
			this.setState({
				error: false,
				org: {
					...this.state.org,
					[id]: e.target.value
				}
			})
		}
	}
	close = () => {
		const { isFav, updateFav } = this.props
		const { org } = this.state
		let favObj = {
			id: org.id,
			name: org.name,
			type: 'org',
			path: `/management/org/${org.id}`
		}
		if (isFav(favObj)) {
			updateFav(favObj)
		}
		this.setState({ created: true, creating: false })
		this.props.s('snackbars.orgUpdated', ({ org: this.state.org.name }))
		this.props.getOrg(org.id)
		this.props.getOrgs(true)
		this.props.history.push(`/management/org/${this.state.org.id}`)
	}

	handleUpdateOrg = () => {
		clearTimeout(this.timer)
		if (this.handleValidation()) {
			return updateOrg(this.state.org).then(rs => rs ?
				this.close() :
				this.setState({ created: false, creating: false, error: true, errorMessage: this.props.t('orgs.validation.networkError') })
			)
		}
		else {
			this.setState({
				creating: false,
				error: true,
			})
		}

	}

	goToOrg = () => {
		const { location } = this.props
		this.props.history.push(location.prevURL ? location.prevURL : '/management/org/' + this.props.match.params.id)
	}
	handleOrgChange = e => {
		this.setState({
			selectedOrg: e.target.value,
			org: {
				...this.state.org,
				org: {
					id: e.target.value
				}
			}
		})
	}
	renderOrgs = () => {
		const { t, org, orgs, accessLevel } = this.props
		// const {  } = this.state
		return <DSelect
			label={t('orgs.fields.parentOrg')}
			value={org.org.id}
			onChange={this.handleOrgChange}
			menuItems={accessLevel.apisuperuser ? [{ value: -1, label: t('orgs.fields.topLevelOrg') }, ...orgs.map(org => ({ value: org.id, label: org.name }))] : orgs.map(org => ({ value: org.id, label: org.name }))}
		/>
	}
	render() {
		const { classes, t, loading } = this.props
		const { created, error, org } = this.state
		const buttonClassname = classNames({
			[classes.buttonSuccess]: created,
		})
		return (
			!loading && org ?
				<GridContainer justify={'center'}>
					<Fade in={true}>
						<Paper className={classes.paper}>
							<form className={classes.form}>
								<ItemGrid xs={12}>
									<Collapse in={this.state.error}>
										<Warning>
											<Danger>
												{this.state.errorMessage}
											</Danger>
										</Warning>
									</Collapse>
								</ItemGrid>
								<ItemGrid container xs={12} md={6}>
									<TextF
										autoFocus
										id={'title'}
										label={t('orgs.fields.name')}
										value={org.name}
										className={classes.textField}
										handleChange={this.handleChange('name')}
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
										handleChange={this.handleChange('address')}
										margin='normal'

										error={error}
									/>
								</ItemGrid>
								<ItemGrid container xs={12} md={6}>
									<TextF
										id={'postcode'}
										label={t('orgs.fields.zip')}
										value={org.zip}
										className={classes.textField}
										handleChange={this.handleChange('zip')}
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
										handleChange={this.handleChange('city')}
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
										handleChange={this.handleChange('region')}
										margin='normal'

										error={error}
									/>
								</ItemGrid>
								<ItemGrid container xs={12}>
									<EditOrgAutoSuggest
										t={t}
										country={this.state.country.label}
										handleChange={this.handleCountryChange}
										suggestions={
											Object.entries(countries.getNames(this.props.language)).map(
												country => ({ value: country[1], label: country[1] }))
										} />
								</ItemGrid>
								<ItemGrid container xs={12} md={6}>
									<TextF

										id={'website'}
										label={t('orgs.fields.url')}
										value={org.url}
										className={classes.textField}
										handleChange={this.handleChange('url')}
										margin='normal'

										error={error}
									/>
								</ItemGrid>
								<ItemGrid container xs={12} md={6}>
									{this.props.userOrg.id === org.id ? null : this.renderOrgs()}
								</ItemGrid>
								<ItemGrid container xs={12} md={6}>
									<TextF
										id={'cvr'}
										label={t('orgs.fields.CVR')}
										value={org.aux.cvr}
										className={classes.textField}
										handleChange={this.handleAuxChange('cvr')}
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
										handleChange={this.handleAuxChange('ean')}
										margin='normal'

										error={error}
									/>
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
										onClick={this.goToOrg}
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
										onClick={this.state.created ? this.goToOrg : this.handleUpdateOrg}>
										{this.state.created ?
											<Fragment><Check className={classes.leftIcon} />{t('snackbars.redirect')}</Fragment>
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
}
const mapStateToProps = (state) => ({
	language: state.localization.language,
	accessLevel: state.settings.user.privileges,
	userOrg: state.settings.user.org,
	org: state.data.org,
	orgs: state.data.orgs,
	loading: !state.data.gotOrg
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	updateFav: (favObj) => dispatch(updateFav(favObj)),
	getOrg: async id => dispatch(await getOrgLS(id)),
	getOrgs: (reload) => dispatch(getOrgs(reload))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(createprojectStyles, { withTheme: true })(EditOrg))
