import React, { Component, Fragment } from 'react'
import { Paper, withStyles, Grid, /*  FormControl, InputLabel, Select, Input, Chip,  MenuItem, */ Collapse, Button, Snackbar, MenuItem, Select, FormControl, InputLabel } from '@material-ui/core';
import { Save, Check } from 'variables/icons';
import classNames from 'classnames';
import { getOrg, updateOrg, getAllOrgs } from 'variables/dataOrgs'
import { TextF, ItemGrid, CircularLoader, GridContainer, Danger, Warning } from '..'
import { connect } from 'react-redux'
import createprojectStyles from '../../assets/jss/components/projects/createprojectStyles'
import EditOrgAutoSuggest from './EditOrgAutoSuggest'

// var moment = require("moment")
var countries = require("i18n-iso-countries");

// // const ITEM_PADDING_TOP = 8;
// const MenuProps = {
// 	PaperProps: {
// 		style: {
// 			maxHeight: 300,
// 			width: 250,
// 		},
// 	},
// };

class EditOrg extends Component {
	constructor(props) {
		super(props)

		this.state = {
			org: {},
			country: {},
			creating: false,
			created: false,
			loading: true,
			openSnackBar: false,
		}
	}
	handleValidation = () => {
		/* Address, City, Postcode, Country, Region, Website. */
		let errorCode = [];
		const { name, address, city, zip, country } = this.state.org
		if (name === "") {
			errorCode.push(0)
		}
		if (address === "") {
			errorCode.push(1)
		}
		if (city === "") {
			errorCode.push(2)
		}
		if (zip === "") {
			errorCode.push(3)
		}
		if (country === "") {
			errorCode.push(4)
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
				return t("orgs.validation.noName")
			case 1:
				return t("orgs.validation.noAddress")
			case 2:
				return t("orgs.validation.noCity")
			case 3:
				return t("orgs.validation.noZip")
			case 4:
				return t("orgs.validation.noCountry")
			default:
				return ""
		}
	}
	componentDidMount = async () => {
		this._isMounted = 1
		let id = this.props.match.params.id
		const { accessLevel, t } = this.props
		await getOrg(id).then(rs => {
			if (rs && this._isMounted) {
				this.setState({
					country: {
						id: rs.country.length > 2 ? countries.getAlpha2Code(rs.country, "en") ? countries.getAlpha2Code(rs.country, "en") : countries.getAlpha2Code(rs.country, "da")
							: rs.country, label: countries.getName(rs.country, this.props.language) ? countries.getName(rs.country, this.props.language) : ''
					},
					org: {
						...rs,
						aux: {
							...rs.aux
						},
						country: rs.country.length > 2 ? countries.getAlpha2Code(rs.country, "en") ? countries.getAlpha2Code(rs.country, "en") : countries.getAlpha2Code(rs.country, "da")
							: rs.country
					},
					selectedOrg: {
						id: rs.org.id > 0 ? rs.org.id : -1,
						name: rs.org.name !== null ? rs.org.name : t("orgs.fields.topLevelOrg")
					}
				})
			}

		})
		await getAllOrgs().then(rs => {
			if (this._isMounted) {
				if (accessLevel.apisuperuser)
					rs.unshift({ id: -1, name: t("orgs.fields.topLevelOrg") })
				this.setState({ orgs: rs, loading: false })
			}
		})
		this.setState({
			loading: false
		})
		this.props.setHeader("orgs.updateOrg", true, `/org/${id}`, "users")
	}

	componentWillUnmount = () => {
		this._isMounted = 0
		clearTimeout(this.timer)
	}

	handleCountryChange = value => {
		this.setState({
			error: false,
			country: { id: value, label: countries.getName(value, this.props.language) },
			org: {
				...this.state.org,
				country: countries.getName(value, this.props.language) ? value : ''
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
	snackBarClose = () => {
		this.setState({ openSnackBar: false })
		this.redirect = setTimeout(async => {
			this.props.history.push(`/org/${this.state.org.id}`)
		}, 1e3)
	}
	handleUpdateOrg = () => {
		clearTimeout(this.timer)
		this.timer = setTimeout(async () => {
			if (this.handleValidation()) {
				return updateOrg(this.state.org).then(rs => rs ?
					this.setState({ created: true, creating: false, openSnackBar: true }) :
					this.setState({ created: false, creating: false, error: true, errorMessage: this.props.t("orgs.validation.networkError") })
					, 2e3)
			}
			else {
				this.setState({
					creating: false,
					error: true,
				})
			}
		})

	}

	goToOrg = () => {
		this.props.history.push('/org/' + this.props.match.params.id)
	}
	handleOrgChange = e => {
		this.setState({
			selectedOrg: e.target.value,
			org: {
				...this.state.org,
				org: e.target.value
			}
		})
	}
	renderOrgs = () => {
		const { classes, t } = this.props
		const { orgs, selectedOrg } = this.state

		return <FormControl className={ classes.formControl }>
			<InputLabel FormLabelClasses={ { root: classes.label } } color={ "primary" } htmlFor="select-multiple-chip">
				{ t("orgs.fields.parentOrg") }
			</InputLabel>
			<Select
				fullWidth={ false }
				color={ "primary" }
				value={ selectedOrg !== null ? selectedOrg : "" }
				onChange={ this.handleOrgChange }
				renderValue={ value => value.name }
			>
				{/* { accessLevel.apisuperuser ? <MenuItem key={ 99 } value={ noOrg }>{ t("orgs.fields.topLevelOrg") }</MenuItem> : null } */ }

				{ orgs ? orgs.map(org => (
					<MenuItem
						key={ org.id }
						value={ org }
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
									id={ "title" }
									label={ t("orgs.fields.name") }
									value={ org.name }
									className={ classes.textField }
									handleChange={ this.handleChange("name") }
									margin="normal"
									noFullWidth
									error={ error }
								/>
							</ItemGrid>
						
							<ItemGrid container xs={ 12 } md={ 6 }>
								<TextF

									id={ "address" }
									label={ t("orgs.fields.address") }
									value={ org.address }
									className={ classes.textField }
									handleChange={ this.handleChange("address") }
									margin="normal"
									noFullWidth
									error={ error }
								/>
							</ItemGrid>
							<ItemGrid container xs={ 12 } md={ 6 }>
								<TextF
									id={ "postcode" }
									label={ t("orgs.fields.zip") }
									value={ org.zip }
									className={ classes.textField }
									handleChange={ this.handleChange("zip") }
									margin="normal"
									noFullWidth
									error={ error }
									type={ "number" }
									pattern="[0-9]*"
								/>
							</ItemGrid>
							<ItemGrid container xs={ 12 } md={ 6 }>
								<TextF

									id={ "city" }
									label={ t("orgs.fields.city") }
									value={ org.city }
									className={ classes.textField }
									handleChange={ this.handleChange("city") }
									margin="normal"
									noFullWidth
									error={ error }
								/>
							</ItemGrid>

							<ItemGrid container xs={ 12 } md={ 6 }>
								<TextF

									id={ "region" }
									label={ t("orgs.fields.region") }
									value={ org.region }
									className={ classes.textField }
									handleChange={ this.handleChange("region") }
									margin="normal"
									noFullWidth
									error={ error }
								/>
							</ItemGrid>
							<ItemGrid container xs={ 12 }>
								<EditOrgAutoSuggest
									t={ t }
									country={ this.state.country.label ? this.state.country.label : this.state.country.id }
									handleChange={ this.handleCountryChange }
									suggestions={
										Object.keys(countries.getNames(this.props.language)).map(
											country => ({ value: country, label: countries.getName(country, this.props.language) })) } />
							</ItemGrid>
							<ItemGrid container xs={ 12 } md={ 6 }>
								<TextF

									id={ "website" }
									label={ t("orgs.fields.url") }
									value={ org.url }
									className={ classes.textField }
									handleChange={ this.handleChange("url") }
									margin="normal"
									noFullWidth
									error={ error }
								/>
							</ItemGrid>
							<ItemGrid container xs={ 12 } md={ 6 }>
								{ this.props.userOrg.id === org.id ? null : this.renderOrgs() }
							</ItemGrid>
							<ItemGrid container xs={ 12 } md={ 6 }>
								<TextF
									id={ "cvr" }
									label={ t("orgs.fields.CVR") }
									value={ org.aux.cvr }
									className={ classes.textField }
									handleChange={ this.handleAuxChange("cvr") }
									margin="normal"
									noFullWidth
									error={ error }
								/>
							</ItemGrid>
							<ItemGrid container xs={ 12 } md={ 6 }>
								<TextF

									id={ "ean" }
									label={ t("orgs.fields.EAN") }
									value={ org.aux.ean }
									className={ classes.textField }
									handleChange={ this.handleAuxChange("ean") }
									margin="normal"
									noFullWidth
									error={ error }
								/>
							</ItemGrid>
						</form>
						<ItemGrid xs={ 12 } container justify={ 'center' }>
							<Collapse in={ this.state.creating } timeout="auto" unmountOnExit>
								<CircularLoader notCentered />
							</Collapse>
						</ItemGrid>
						<Grid container justify={ "center" }>
							<div className={ classes.wrapper }>
								<Button
									variant="contained"
									color="primary"
									className={ buttonClassname }
									disabled={ this.state.creating || this.state.created }
									onClick={ this.state.created ? this.goToOrg : this.handleUpdateOrg }>
									{ this.state.created ?
										<Fragment><Check className={ classes.leftIcon } />{ t("snackbars.redirect") }</Fragment>
										: <Fragment><Save className={ classes.leftIcon } />{ t("orgs.updateOrg") }</Fragment> }
								</Button>
							</div>
						</Grid>
					</Paper>
					<Snackbar
						anchorOrigin={ { vertical: "bottom", horizontal: "right" } }
						open={ this.state.openSnackBar }
						onClose={ this.snackBarClose }
						ContentProps={ {
							'aria-describedby': 'message-id',
						} }
						autoHideDuration={ 1500 }
						message={
							<ItemGrid zeroMargin noPadding justify={ 'center' } alignItems={ 'center' } container id="message-id">
								<Check className={ classes.leftIcon } color={ 'primary' } />
								{ t("snackbars.orgUpdated", { org: org.name }) }
							</ItemGrid>
						}
					/>
				</GridContainer>
				: <CircularLoader />
		)
	}
}
const mapStateToProps = (state) => ({
	language: state.localization.language,
	accessLevel: state.settings.user.privileges,
	userOrg: state.settings.user.org
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(createprojectStyles, { withTheme: true })(EditOrg))
