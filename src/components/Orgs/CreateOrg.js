import React, { Component, Fragment } from 'react'
import { Paper, withStyles, Grid, Collapse, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Save } from 'variables/icons';
import classNames from 'classnames';
import { TextF, ItemGrid, CircularLoader, GridContainer, Danger, Warning } from 'components'
import { connect } from 'react-redux'
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles'
import EditOrgAutoSuggest from './EditOrgAutoSuggest';
import { createOrg, getAllOrgs } from 'variables/dataOrgs';
var countries = require('i18n-iso-countries');

class CreateOrg extends Component {
	constructor(props) {
		super(props)

		this.state = {
			org: {
				id: -1,
				name: '',
				address: '',
				city: '',
				zip: '',
				region: '',
				country: '',
				url: '',
				aux: {
					cvr: '',
					ean: ''
				}
			},
			selectedOrg: '',
			country: {
				id: '',
				label: ''
			},
			creating: false,
			created: false,
			loading: true,
			openSnackBar: false,
		}
	}
	componentDidMount = async () => {
		this._isMounted = 1
		const { t, accessLevel, setHeader, location } = this.props
		let prevURL = location.prevURL ? location.prevURL : `/management/orgs`
		setHeader('orgs.createOrg', true, prevURL, '/management/users')
		await getAllOrgs().then(rs => {
			if (this._isMounted) {
				if (accessLevel.apisuperuser)
					rs.unshift({ id: -1, name: t('orgs.fields.topLevelOrg') })
				this.setState({ orgs: rs, loading: false })
			}
		})
	}


	handleValidation = () => {
		let errorCode = [];
		const { name, address, city, zip, country } = this.state.org
		const { selectedOrg } = this.state
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
		if (selectedOrg === null) {
			errorCode.push(5)
		}
		this.setState({
			errorMessage: errorCode.map(c => <Danger key={ c }>{ this.errorMessages(c) }</Danger>),
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
			case 5:
				return t('orgs.validation.noParent')
			default:
				return ''
		}
	}

	componentWillUnmount = () => {
		this._isMounted = 0
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
					[ id ]: e.target.value
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
					[ id ]: e.target.value
				}
			})
		}
	}
	close = (rs) => {
		this.setState({ created: true, creating: false, org: rs })
		this.props.s('snackbars.orgCreated', { org: this.state.org.name })
		this.props.history.push(`/management/org/${this.state.org.id}`)
	}
	handleCreateOrg = () => {		
		if (this.handleValidation()) {
			let newOrg = {
				...this.state.org,
				org: {
					id: this.state.selectedOrg
				}
			}
			return createOrg(newOrg).then(rs => 
				rs ?
					this.close(rs) :
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
		this.props.history.push('/management/org/' + this.props.match.params.id)
	}

	handleOrgChange = e => {
		this.setState({
			selectedOrg: e.target.value
		})
	}
	
	renderOrgs = () => {
		const { classes, t } = this.props
		const { orgs, selectedOrg, error } = this.state

		return <FormControl>
			<InputLabel error={ error } FormLabelClasses={ { root: classes.label } } color={ 'primary' } htmlFor='select-multiple-chip'>
				{ t('orgs.fields.parentOrg') }
			</InputLabel>
			<Select
				error={ error }
				fullWidth={ false }
				color={ 'primary' }
				value={ selectedOrg }
				onChange={ this.handleOrgChange }
			>
				{ orgs ? orgs.map(org => (
					<MenuItem
						key={ org.id }
						value={ org.id }
					>
						{ org.name }
					</MenuItem>
				)) : null }
			</Select>
		</FormControl>

	}
	render () {
		const { classes, t } = this.props
		const { created, error, loading, org } = this.state
		const buttonClassname = classNames({
			[ classes.buttonSuccess ]: created,
		})

		return (
			!loading ?
				<GridContainer justify={ 'center' }>
					<Paper className={ classes.paper }>
						<form className={ classes.form }>
							<ItemGrid xs={ 12 }>
								<Collapse in={ this.state.error }>
									<Warning>
										<Danger>
											{ this.state.errorMessage }
										</Danger>
									</Warning>
								</Collapse>
							</ItemGrid>
							<ItemGrid container xs={ 12 } md={ 6 }>
								<TextF
									autoFocus
									id={ 'name' }
									label={ t('orgs.fields.name') }
									value={ org.name }
									className={ classes.textField }
									handleChange={ this.handleChange('name') }
									margin='normal'
									
									error={ error }
								/>
							</ItemGrid>
							<ItemGrid container xs={ 12 } md={ 6 }>
								<TextF

									id={ 'address' }
									label={ t('orgs.fields.address') }
									value={ org.address }
									className={ classes.textField }
									handleChange={ this.handleChange('address') }
									margin='normal'
									
									error={ error }
								/>
							</ItemGrid>
							<ItemGrid container xs={ 12 } md={ 6 }>
								<TextF

									id={ 'zip' }
									label={ t('orgs.fields.zip') }
									value={ org.zip }
									className={ classes.textField }
									handleChange={ this.handleChange('zip') }
									margin='normal'
									
									error={ error }
									type={ 'number' }
									pattern='[0-9]*'
								/>
							</ItemGrid>
							<ItemGrid container xs={ 12 } md={ 6 }>
								<TextF

									id={ 'city' }
									label={ t('orgs.fields.city') }
									value={ org.city }
									className={ classes.textField }
									handleChange={ this.handleChange('city') }
									margin='normal'
									
									error={ error }
								/>
							</ItemGrid>

							<ItemGrid container xs={ 12 } md={ 6 }>
								<TextF

									id={ 'region' }
									label={ t('orgs.fields.region') }
									value={ org.region }
									className={ classes.textField }
									handleChange={ this.handleChange('region') }
									margin='normal'
									
									error={ error }
								/>
							</ItemGrid>
							<ItemGrid container xs={ 12 }>
								<EditOrgAutoSuggest
									error={error}
									country={this.state.country.label ? this.state.country.label : this.state.country.id}
									handleChange={this.handleCountryChange}
									t={t}
									suggestions={
										Object.entries(countries.getNames(this.props.language)).map(
											country => ({ value: country[1], label: country[1] }))
									} />
							</ItemGrid>
							<ItemGrid container xs={ 12 } md={ 6 }>
								<TextF

									id={ 'url' }
									label={ t('orgs.fields.url') }
									value={ org.url }
									className={ classes.textField }
									handleChange={ this.handleChange('url') }
									margin='normal'
									
									error={ error }
								/>
							</ItemGrid>
							<ItemGrid container xs={ 12 } md={ 6 }>
								{ this.renderOrgs() }
							</ItemGrid>
							<ItemGrid container xs={ 12 } md={ 6 }>
								<TextF
									id={ 'cvr' }
									label={ t('orgs.fields.CVR') }
									value={ org.aux.cvr }
									className={ classes.textField }
									handleChange={ this.handleAuxChange('cvr') }
									margin='normal'
									
									error={ error }
								/>
							</ItemGrid>
							<ItemGrid container xs={ 12 } md={ 6 }>
								<TextF
									id={ 'ean' }
									label={ t('orgs.fields.EAN') }
									value={ org.aux.ean }
									className={ classes.textField }
									handleChange={ this.handleAuxChange('ean') }
									margin='normal'
									
									error={ error }
								/>
							</ItemGrid>
						</form>

						<ItemGrid xs={ 12 } container justify={ 'center' }>
							<Collapse in={ this.state.creating } timeout='auto' unmountOnExit>
								<CircularLoader notCentered />
							</Collapse>
						</ItemGrid>
						<Grid container justify={ 'center' }>
							<div className={ classes.wrapper }>
								<Button
									variant='contained'
									color='primary'
									className={ buttonClassname }
									disabled={ this.state.creating || this.state.created }
									onClick={ this.state.created ? this.goToOrg : this.handleCreateOrg }>
									{ this.state.created ?
										<Fragment>{t('snackbars.redirect') }</Fragment>
										: <Fragment><Save className={ classes.leftIcon } />{ t('orgs.createOrg') }</Fragment> }
								</Button>
							</div>
						</Grid>
					</Paper>
				</GridContainer>
				: <CircularLoader />
		)
	}
}
const mapStateToProps = (state) => ({
	language: state.localization.language,
	accessLevel: state.settings.user.privileges
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(createprojectStyles, { withTheme: true })(CreateOrg))
