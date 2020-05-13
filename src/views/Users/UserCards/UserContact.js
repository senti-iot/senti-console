import React from 'react'
import { InfoCard, ItemG, Caption, Info, Link } from 'components'
import { Hidden } from '@material-ui/core'
import { pF, dateFormatter } from 'variables/functions'
import { Person, Edit, Delete, LockOpen, Email, Star, StarBorder } from 'variables/icons'
import { useHistory } from 'react-router-dom'
import Gravatar from 'react-gravatar'
import Dropdown from 'components/Dropdown/Dropdown'
import { useLocalization, useMatch, useAuth } from 'hooks'

const UserContact = props => {
	//Hooks
	const hasAccess = useAuth().hasAccess
	//Redux

	//State

	//Const
	const { user, isFav, addToFav, removeFromFav, deleteUser, classes,
		changePass, resendConfirmEmail } = props

	//useCallbacks

	//useEffects

	//Handlers

	const history = useHistory()
	const match = useMatch()
	const t = useLocalization()
	// const accessLevel = useSelector(state => state.settings.user.privileges)

	const handleDeleteUser = () => {
		deleteUser()
	}

	const renderUserGroup = () => user.role.name

	const renderTopActionPriv = () => {

		return renderTopAction()
		// if (loggedUser.uuid === user.uuid)
		// return null
	}

	const handleEdit = () => history.push({ pathname: `${match.url}/edit`, prevURL: `/management/user/${user.uuid}` })
	const renderTopAction = () => {
		return <Dropdown menuItems={
			[
				{ label: t('menus.edit'), icon: Edit, func: handleEdit, dontShow: !hasAccess(user.uuid, 'user.modify') },
				{ label: t('menus.changePassword'), icon: LockOpen, func: changePass, dontShow: !hasAccess(user.uuid, 'user.modify') },
				{ label: t('menus.userResendEmail'), icon: Email, func: resendConfirmEmail, dontShow: user.suspended !== 2 || !hasAccess(user.uuid, 'user.modify') },
				{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? Star : StarBorder, func: isFav ? removeFromFav : addToFav },
				{
					label: t('menus.delete'),
					icon: Delete,
					func: handleDeleteUser,
					dontShow: !hasAccess(user.uuid, 'user.delete')
				},

			]
		} />
	}

	const extended = user.aux ? user.aux.senti ? user.aux.senti.extendedProfile : {} : {}
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
								<Link to={{ pathname: `/management/org/${user.org.uuid}`, prevURL: `/management/user/${user.uuid}` }}>
									{user.org ? user.org.name : t('users.noOrg')}
								</Link>
							</Info>
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
							{extended.bio ? extended.bio : ` `}
						</Info>
					</ItemG>
					<ItemG xs={12} md={2}>
						<Caption>{t('users.fields.position')}</Caption>
						<Info>
							{extended.position ? extended.position : ` `}
						</Info>
					</ItemG>
					<ItemG xs={12} md={12}>
						<Caption>{t('users.fields.location')}</Caption>
						<Info>
							{extended.location ? extended.location : ` `}
						</Info>
					</ItemG>
					{extended.linkedInURL ? <ItemG xs={12} md={12}>
						<Caption>{t('users.fields.linkedInURL')}</Caption>
						<Info>

							<Link target='_blank' rel="noopener noreferrer" href={`${extended.linkedInURL}`}>
								{`${user.firstName} ${user.lastName}`}
							</Link>

						</Info>
					</ItemG> : ` `}
					{extended.twitterURL ? <ItemG xs={12} md={8}>
						<Caption>{t('users.fields.twitterURL')}</Caption>
						<Info>

							<Link target='_blank' rel="noopener noreferrer" href={`${extended.twitterURL}`}>
								{`${user.firstName} ${user.lastName}`}
							</Link>

						</Info>
					</ItemG> : ` `}
					<ItemG xs={12}>
						<Caption>{t('users.fields.birthday')}</Caption>
						<Info>
							{extended.birthday ? dateFormatter(extended.birthday) : ` `}
						</Info>
					</ItemG>
					<ItemG xs={12}>
						<Caption>{t('users.fields.newsletter')}</Caption>
						<Info>
							{extended.newsletter ? t('actions.yes') : t('actions.no')}
						</Info>
					</ItemG>
				</ItemG>
			}
		/>
	)
}

export default UserContact
