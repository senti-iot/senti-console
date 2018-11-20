import React, { Component } from 'react'
import { InfoCard, ItemGrid, Caption, Info } from 'components';
import { Hidden } from '@material-ui/core';
import { pF } from 'variables/functions';
import { Person, Edit, Delete, LockOpen, Email, Star, StarBorder } from 'variables/icons'
import { Link } from 'react-router-dom'
import Gravatar from 'react-gravatar'
import { connect } from 'react-redux'
import Dropdown from 'components/Dropdown/Dropdown';
class UserContact extends Component {

	deleteUser = () => {
		this.props.deleteUser()
	}

	renderUserGroup = () => {
		const { t, user } = this.props
		if (user.groups[136550100000143])
			return t('users.groups.136550100000143')
		if (user.groups[136550100000211])
			return t('users.groups.136550100000211')
		if (user.groups[136550100000225])
			return t('users.groups.136550100000225')
	}
	renderTopActionPriv = () => {
		const { loggedUser, user } = this.props
		const { apiorg } = loggedUser.privileges
		if (apiorg) {
			if (apiorg.editusers) {
				return this.renderTopAction()
			}
		}
		if (loggedUser.id === user.id)
			return this.renderTopAction()
		return null
	}
	canDelete = () => {
		const { accessLevel, user, loggedUser } = this.props
		let dontShow = true
		if ((accessLevel.apisuperuser) || (accessLevel.apiorg.editusers && !user.privileges.apisuperuser)) {
			dontShow = false
		}
		if (loggedUser.id === user.id)
			dontShow = true
		return dontShow
	}
	renderTopAction = () => {
		const { t, classes, user, history, isFav, addToFav, removeFromFav } = this.props
		return <Dropdown menuItems={
			[
				{ label: t('menus.edit'), icon: <Edit className={classes.leftIcon} />, func: () => history.push({ pathname: `${this.props.match.url}/edit`, prevURL: `/management/user/${user.id}`  }) },
				{ label: t('menus.changePassword'), icon: <LockOpen className={classes.leftIcon} />, func: this.props.changePass },
				{ label: t('menus.userResendEmail'), icon: <Email className={classes.leftIcon} />, func: this.props.resendConfirmEmail, dontShow: user.suspended !== 2 },
				{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? <Star className={classes.leftIcon} /> : <StarBorder className={classes.leftIcon} />, func: isFav ? removeFromFav : addToFav },
				{
					label: t('menus.delete'),
					icon: <Delete className={classes.leftIcon} />,
					func: this.deleteUser,
					dontShow: this.canDelete()
				},

			]
		}/>
	}
	render() {
		const { t, user, classes } = this.props
		// const { actionAnchor } = this.state
		return (
			<InfoCard
				title={`${user.firstName} ${user.lastName}`}
				noExpand
				avatar={<Person />}
				topAction={this.renderTopActionPriv()}
				content={
					<ItemGrid zeroMargin noPadding container >
						<Hidden lgUp>
							<ItemGrid container justify={'center'}>
								{user.img ? <img src={user.img} alt='UserAvatar' className={classes.img} /> : <Gravatar size={250} default='mp' email={user.email} className={classes.img} />}
							</ItemGrid>
						</Hidden>
						<ItemGrid zeroMargin noPadding lg={9} md={12}>
							<ItemGrid>
								<Caption>{t('users.fields.email')}</Caption>
								<Info>
									<a title={t('links.mailTo')} href={`mailto:${user.email}`}>
										{user.email}
									</a>
								</Info>
							</ItemGrid>
							<ItemGrid>
								<Caption>{t('users.fields.phone')}</Caption>
								<Info>
									<a title={t('links.phoneTo')} href={`tel:${user.phone}`}>
										{user.phone ? pF(user.phone) : user.phone}
									</a>
								</Info>
							</ItemGrid>
							<ItemGrid>
								<Caption>{t('users.fields.organisation')}</Caption>
								<Info>
									<Link to={{ pathname: `/management/org/${user.org.id}`, prevURL: `/management/user/${user.id}` }}>
										{user.org ? user.org.name : t('users.noOrg')}
									</Link>
								</Info>
							</ItemGrid>
							<ItemGrid>
								<Caption>{t('users.fields.language')}</Caption>
								<Info>{user.aux.odeum.language === 'en' ? t('settings.languages.en') : user.aux.odeum.language === 'da' ? t('settings.languages.da') : ''}</Info>
							</ItemGrid>
							<ItemGrid>
								<Caption>{t('users.fields.accessLevel')}</Caption>
								<Info>{this.renderUserGroup()}</Info>
							</ItemGrid>
						</ItemGrid>
						<Hidden mdDown>
							<ItemGrid >
								{user.img ? <img src={user.img} alt='UserAvatar' className={classes.img} /> : <Gravatar default='mp' size={250} email={user.email} className={classes.img} />}
							</ItemGrid>
						</Hidden>
					</ItemGrid>
				}
			/>



		)
	}
}
const mapStateToProps = (state) => ({
	language: state.settings.language,
	loggedUser: state.settings.user,
	accessLevel: state.settings.user.privileges
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(UserContact)
