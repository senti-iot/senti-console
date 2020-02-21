import React from 'react'
import { InfoCard, ItemG, Caption, Info } from 'components';
import { Hidden, Link } from '@material-ui/core';
import { pF, dateFormatter } from 'variables/functions';
import { Person, Edit, Delete, LockOpen, Email, Star, StarBorder } from 'variables/icons'
import { Link as RLink } from 'react-router-dom'
import Gravatar from 'react-gravatar'
import { useSelector } from 'react-redux'
import Dropdown from 'components/Dropdown/Dropdown';
import { useLocalization } from 'hooks'

// const mapStateToProps = (state) => ({
// 	language: state.settings.language,
// 	loggedUser: state.settings.user,
// 	accessLevel: state.settings.user.privileges
// })

// @Andrei
const UserContact = props => {
	const t = useLocalization()
	// const language = useSelector(state => state.settings.language)
	const loggedUser = useSelector(state => state.settings.user)
	const accessLevel = useSelector(state => state.settings.user.privileges)

	const deleteUser = () => {
		props.deleteUser()
	}

	const renderUserGroup = () => {
		const { user } = props
		if (user.groups[136550100000143])
			return t('users.groups.136550100000143')
		if (user.groups[136550100000211])
			return t('users.groups.136550100000211')
		if (user.groups[136550100000225])
			return t('users.groups.136550100000225')
	}
	const renderTopActionPriv = () => {
		const { user } = props
		const { apiorg } = loggedUser.privileges
		if (apiorg) {
			if (apiorg.editusers) {
				return renderTopAction()
			}
		}
		if (loggedUser.id === user.id)
			return renderTopAction()
		return null
	}
	const canDelete = () => {
		const { user } = props
		let dontShow = true
		if ((accessLevel.apisuperuser) || (accessLevel.apiorg.editusers && !user.privileges.apisuperuser)) {
			dontShow = false
		}
		if (loggedUser.id === user.id)
			dontShow = true
		return dontShow
	}
	const renderTopAction = () => {
		const { user, history, isFav, addToFav, removeFromFav } = props
		return <Dropdown menuItems={
			[
				{ label: t('menus.edit'), icon: Edit, func: () => history.push({ pathname: `${props.match.url}/edit`, prevURL: `/management/user/${user.id}` }) },
				{ label: t('menus.changePassword'), icon: LockOpen, func: props.changePass },
				{ label: t('menus.userResendEmail'), icon: Email, func: props.resendConfirmEmail, dontShow: user.suspended !== 2 },
				// { label: t('menus.confirmUser'), icon: Email, func: this.props.handleOpenConfirmDialog, dontShow: user.suspended !== 2 },
				{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? Star : StarBorder, func: isFav ? removeFromFav : addToFav },
				{
					label: t('menus.delete'),
					icon: Delete,
					func: deleteUser,
					dontShow: canDelete()
				},

			]
		} />
	}

	const { user, classes } = props
	const extended = user.aux.senti ? user.aux.senti.extendedProfile : null
	return (
		<InfoCard
			title={`${user.firstName} ${user.lastName}`}
			avatar={<Person />}
			topAction={renderTopActionPriv()}
			content={
				<ItemG container >
					<Hidden lgUp>
						<ItemG container justify={'center'}>
							{user.img ? <img src={user.img} alt='UserAvatar' className={classes.img} /> : <Gravatar size={250} default='mp' email={user.email} className={classes.img} />}
						</ItemG>
					</Hidden>
					<ItemG lg={9} md={12}>
						<ItemG>
							<Caption>{t('users.fields.email')}</Caption>
							<Info>
								<Link title={t('links.mailTo')} href={`mailto:${user.email}`}>
									{user.email}
								</Link>
							</Info>
						</ItemG>
						<ItemG>
							<Caption>{t('users.fields.phone')}</Caption>
							<Info>
								<Link title={t('links.phoneTo')} href={`tel:${user.phone}`}>
									{user.phone ? pF(user.phone) : user.phone}
								</Link>
							</Info>
						</ItemG>
						<ItemG>
							<Caption>{t('users.fields.organisation')}</Caption>
							<Info>
								<Link component={RLink} to={{ pathname: `/management/org/${user.org.id}`, prevURL: `/management/user/${user.id}` }}>
									{user.org ? user.org.name : t('users.noOrg')}
								</Link>
							</Info>
						</ItemG>
						<ItemG>
							<Caption>{t('users.fields.language')}</Caption>
							<Info>{user.aux.odeum.language === 'en' ? t('settings.languages.en') : user.aux.odeum.language === 'da' ? t('settings.languages.da') : ''}</Info>
						</ItemG>
						<ItemG>
							<Caption>{t('users.fields.accessLevel')}</Caption>
							<Info>{renderUserGroup()}</Info>
						</ItemG>
					</ItemG>
					<Hidden mdDown>
						<ItemG >
							{user.img ? <img src={user.img} alt='UserAvatar' className={classes.img} /> : <Gravatar default='mp' size={250} email={user.email} className={classes.img} />}
						</ItemG>
					</Hidden>
				</ItemG>
			}
			hiddenContent={

				<ItemG container>
					<ItemG xs={12}>
						<Caption>{t('users.fields.bio')}</Caption>
						<Info>
							{extended ? extended.bio ? extended.bio : null : null}
						</Info>
					</ItemG>
					<ItemG xs={12} md={2}>
						<Caption>{t('users.fields.position')}</Caption>
						<Info>
							{extended ? extended.position ? extended.position : null : null}
						</Info>
					</ItemG>
					<ItemG xs={12} md={9}>
						<Caption>{t('users.fields.location')}</Caption>
						<Info>
							{extended ? extended.location ? extended.location : null : null}
						</Info>
					</ItemG>
					<ItemG xs={12} md={2}>
						<Caption>{t('users.fields.linkedInURL')}</Caption>
						<Info>
							{extended ? extended.linkedInURL ?
								<Link target='_blank' rel="noopener noreferrer" href={`${extended.linkedInURL}`}>
									{`${user.firstName} ${user.lastName}`}
								</Link>
								: null : null}
						</Info>
					</ItemG>
					<ItemG xs={12} md={8}>
						<Caption>{t('users.fields.twitterURL')}</Caption>
						<Info>
							{extended ? extended.twitterURL ?
								<Link target='_blank' rel="noopener noreferrer" href={`${extended.twitterURL}`}>
									{`${user.firstName} ${user.lastName}`}
								</Link>
								: null : null}
						</Info>
					</ItemG>
					<ItemG xs={10}>
						<Caption>{t('users.fields.birthday')}</Caption>
						<Info>
							{extended ? extended.birthday ? dateFormatter(extended.birthday) : null : null}
						</Info>
					</ItemG>
					<ItemG xs={12}>
						<Caption>{t('users.fields.newsletter')}</Caption>
						<Info>
							{extended ? extended.newsletter ? t('actions.yes') : t('actions.no') : t('actions.no')}
						</Info>
					</ItemG>
				</ItemG>
			}
		/>
	)
}

export default UserContact
