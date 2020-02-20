import React from 'react'
import { ItemGrid, DatePicker, Warning, Danger, TextF, DSelect, ItemG } from 'components';
import { Collapse, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import createUserStyles from 'assets/jss/components/users/createUserStyles';
import AssignOrgDialog from 'components/AssignComponents/AssignOrgDialog';

const CreateUserForm = props => {
	//Hooks
	const classes = createUserStyles()
	//Redux

	//State

	//Const
	const { user, accessLevel, error, errorMessage, handleChange } = props
	/* AssignOrg */
	const { openOrg, handleOpenOrg, handleCloseOrg, handleOrgChange } = props
	/* ExtendedProfile */
	const { extended, openExtended, handleExtendedBirthdayChange, handleChangeExtended, handleExtendedChange } = props
	/* Language */
	const { handleLangChange, languages } = props
	/* Group */
	const { groups, selectedGroup, handleGroupChange } = props
	/* Hooks */
	const { t } = props

	//useCallbacks

	//useEffects

	//Handlers
	const renderOrgs = () => {
		const { org } = user
		return accessLevel.apiorg.editusers ?
			<>
				<TextF
					value={org.name}
					onClick={handleOpenOrg}
					readonly
				/>
				<AssignOrgDialog
					t={t}
					open={openOrg}
					handleClose={handleCloseOrg}
					callBack={handleOrgChange}
				/>
			</>
			: null
	}
	const renderLanguage = () => {
		return <DSelect
			label={t('users.fields.language')}
			onChange={handleLangChange}
			error={error}
			value={user.aux.odeum.language}
			menuItems={languages}
			margin={'normal'}
		/>
	}
	const renderAccess = () => {
		let rend = false
		if ((accessLevel.apisuperuser) || (accessLevel.apiorg.editusers)) {
			rend = true
		}
		return rend ?
			<DSelect
				margin={'normal'}
				error={error}
				label={t('users.fields.accessLevel')}
				value={selectedGroup}
				onChange={handleGroupChange}
				menuItems={
					groups.filter(g => g.show ? true : false)
						.map(g => ({ value: g.id, label: g.name }))
				} /> : null
	}
	const renderExtendedProfile = () => {
		return <Collapse in={openExtended}>
			<ItemGrid container xs={12} >
				<TextF
					id={'bio'}
					label={t('users.fields.bio')}
					value={extended.bio}
					multiline
					rows={4}
					// className={classes.textField}
					onChange={handleExtendedChange('bio')}
					error={error}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} >
				<TextF
					id={'position'}
					label={t('users.fields.position')}
					value={extended.position}
					// className={classes.textField}
					onChange={handleExtendedChange('position')}
					error={error}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} >
				<TextF
					id={'location'}
					label={t('users.fields.location')}
					value={extended.location}
					// className={classes.textField}
					onChange={handleExtendedChange('location')}
					error={error}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} >
				<TextF
					id={'recoveryEmail'}
					label={t('users.fields.recoveryEmail')}
					value={extended.recoveryEmail}
					// className={classes.textField}
					onChange={handleExtendedChange('recoveryEmail')}
					error={error}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} >
				<TextF
					id={'linkedInURL'}
					label={t('users.fields.linkedInURL')}
					value={extended.linkedInURL}
					// className={classes.textField}
					onChange={handleExtendedChange('linkedInURL')}
					error={error}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} >
				<TextF
					id={'twitterURL'}
					label={t('users.fields.twitterURL')}
					value={extended.twitterURL}
					// className={classes.textField}
					onChange={handleExtendedChange('twitterURL')}
					error={error}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} >
				<DatePicker
					label={t('users.fields.birthday')}
					format='ll'
					value={extended.birthday}
					// className={classes.textField}
					onChange={handleExtendedBirthdayChange('birthday')}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} >
				<FormControlLabel
					style={{ margin: 0 }}
					control={
						<Checkbox
							checked={extended.newsletter}
							onChange={handleExtendedChange('newsletter')}
							value="checkedB"
							color="primary"
						/>
					}
					label={t('users.fields.newsletter')}
				/>
			</ItemGrid>
		</Collapse>
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
			<ItemGrid container xs={12} >
				<TextF
					id={'firstName'}
					label={t('users.fields.firstName')}
					value={user.firstName}
					// className={classes.textField}
					onChange={handleChange('firstName')}
					// margin='normal'
					error={error}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} >
				<TextF
					id={'lastName'}
					label={t('users.fields.lastName')}
					value={user.lastName}
					// className={classes.textField}
					onChange={handleChange('lastName')}
					error={error}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} >
				<TextF
					id={'email'}
					label={t('users.fields.email')}
					value={user.email}
					// className={classes.textField}
					onChange={handleChange('email')}
					error={error}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} >
				<TextF
					id={'phone'}
					label={t('users.fields.phone')}
					value={user.phone}
					// className={classes.textField}
					onChange={handleChange('phone')}
					error={error}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} >
				{renderLanguage()}
			</ItemGrid>
			<ItemGrid container xs={12} >
				{renderOrgs()}
			</ItemGrid>
			<ItemGrid container xs={12} >
				{renderAccess()}
			</ItemGrid>
			<ItemG xs={12}>
				{renderExtendedProfile()}
			</ItemG>
			<ItemGrid container xs={12} md={12}>
				<Button style={{ margin: 8 }} color={'primary'} onClick={handleChangeExtended}>{t('actions.extendProfile')}</Button>
			</ItemGrid>
		</form>
	)
}

export default CreateUserForm
