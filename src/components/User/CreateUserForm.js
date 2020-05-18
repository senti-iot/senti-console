import React from 'react'
import { ItemGrid, DatePicker, Warning, Danger, TextF, DSelect, ItemG } from 'components'
import { Collapse, Button } from '@material-ui/core'
import createUserStyles from 'assets/jss/components/users/createUserStyles'
import AssignOrgDialog from 'components/AssignComponents/AssignOrgDialog'

const CreateUserForm = props => {
	//Hooks
	const classes = createUserStyles()
	//Redux

	//State

	//Const
	const { user, /*  accessLevel, */ error, errorMessage, handleChange } = props
	/* AssignOrg */
	const { openOrg, handleOpenOrg, handleCloseOrg, handleOrgChange } = props
	/* ExtendedProfile */
	const { extended, openExtended, handleExtendedBirthdayChange, handleChangeExtended, handleExtendedChange } = props
	/* Language */
	// const { handleLangChange, languages } = props
	/* Role */
	const { roles, selectedRole, handleRoleChange } = props
	/* Hooks */
	const { t } = props

	//useCallbacks

	//useEffects

	//Handlers
	const renderOrgs = () => {
		const { org } = user
		return <>
			<TextF
				margin={'normal'}
				label={t('users.fields.organisation')}
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

	}
	const renderAccess = () => {
		return <DSelect
			margin={'normal'}
			error={error}
			label={t('users.fields.accessLevel')}
			value={selectedRole}
			onChange={handleRoleChange}
			menuItems={
				roles.map(g => ({ value: g.uuid, label: g.name }))
			} />
	}
	const renderExtendedProfile = () => {
		console.log(selectedRole)
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
					inputVariant={'outline'}
					// className={classes.textField}
					onChange={handleExtendedBirthdayChange('birthday')}
				/>
			</ItemGrid>
			<ItemGrid container xs={12} >
				<DSelect
					margin={'normal'}
					error={error}
					label={t('users.fields.newsletter')}
					value={extended.newsletter}
					onChange={handleExtendedChange('newsletter')}
					menuItems={[
						{ value: true, label: t('actions.yes') },
						{ value: false, label: t('actions.no') }
					]
					} />
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
