import React from 'react'
import { TextF, ItemGrid, Warning, Danger } from 'components'
import AssignOrgDialog from 'components/AssignComponents/AssignOrgDialog'
import { Collapse } from '@material-ui/core'
import EditOrgAutoSuggest from 'components/Orgs/EditOrgAutoSuggest'

const CreateOrgForm = props => {
	//Hooks

	//Redux

	//State

	//Const
	const { t, org, error, errorMessage, classes } = props
	/* Assign Org */
	const { openOrg, handleOpenOrg, handleCloseOrg, handleChangeOrg } = props
	/* Org */
	const { handleChange, handleAuxChange } = props
	/* Countries */
	const { country, handleCountryChange, countries, language } = props

	//useCallbacks

	//useEffects

	//Handlers

	const renderOrgs = () => {
		return <>
			<TextF
				label={t('orgs.fields.parentOrg')}
				value={org.org.name}
				onClick={handleOpenOrg}
				readonly
			/>
			<AssignOrgDialog
				t={t}
				noOrg
				open={openOrg}
				handleClose={handleCloseOrg}
				callBack={handleChangeOrg}
			/>
		</>
	}

	return (
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
					id={'name'}
					label={t('orgs.fields.name')}
					value={org.name}
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

					id={'website'}
					label={t('orgs.fields.url')}
					value={org.website}
					onChange={handleChange('website')}
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
					onChange={handleAuxChange('ean')}
					margin='normal'

					error={error}
				/>
			</ItemGrid>
		</form>
	)
}
CreateOrgForm.whyDidYouRender = true
export default React.memo(CreateOrgForm)
