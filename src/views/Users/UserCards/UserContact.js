import React, { Component } from 'react'
import { InfoCard, ItemGrid, Caption, Info } from 'components';
import { Hidden } from '@material-ui/core';
import UserPlaceHolder from 'assets/img/userplaceholder.png'
import { pF } from 'variables/functions';
import { Person } from '@material-ui/icons'
import { NavLink } from 'react-router-dom'
export class UserContact extends Component {

	renderUserGroup = () => {
		/* 	"groups": {
			"136550100000143": "Superbruger",
			"136550100000211": "Kontoansvarlig",
			"136550100000225": "Bruger"
		}, */
		const { t, user } = this.props
		console.log(user.groups[136550100000143])
		if (user.groups[136550100000143])
			return t("users.groups.136550100000143")
		if (user.groups[136550100000211])
			return t("users.groups.136550100000211")
		if (user.groups[136550100000225])
			return t("users.groups.136550100000225")
	}
	render() {
		const { t, user, classes } = this.props
		return (


			<InfoCard
				// title={t('users.headers.contact')}
				title={`${user.firstName} ${user.lastName}`}
				noExpand
				avatar={<Person />}
				content={
					<ItemGrid zeroMargin noPadding container >
						<Hidden lgUp>
							<ItemGrid container justify={'center'}>
								<img src={UserPlaceHolder} alt={"profilepicture"} className={classes.img} />
							</ItemGrid>
						</Hidden>
						<ItemGrid zeroMargin noPadding lg={9} md={12}>
							<ItemGrid>
								<Caption>{t("users.fields.email")}</Caption>
								<Info>
									<a title={t("links.mailTo")} href={`mailto:${user.email}`}>
										{user.email}
									</a>
								</Info>
							</ItemGrid>
							<ItemGrid>
								<Caption>{t("users.fields.phone")}</Caption>
								<Info>
									<a title={t("links.phoneTo")} href={`tel:${user.phone}`}>
										{user.phone ? pF(user.phone) : user.phone}
									</a>
								</Info>
							</ItemGrid>
							<ItemGrid>
								<Caption>{t("users.fields.organisation")}</Caption>
								<Info>
									<NavLink to={`/org/${user.org.id}`}>
										{user.org ? user.org.name : t("users.noOrg")}
									</NavLink>
								</Info>
							</ItemGrid>
							<ItemGrid>
								<Caption>{t("users.fields.language")}</Caption>
								{/* <Info>{user.settings.language}</Info> */}
							</ItemGrid>
							<ItemGrid>
								<Caption>{t("users.fields.accessLevel")}</Caption>
								<Info>{this.renderUserGroup()}</Info>
								{/* <Info>{user.accessLevel}</Info>
								{user.groups ? Object.keys(user.groups).map((k, i) => k > 0 ? <Chip key={i} color={"primary"} label={t(`users.groups.${k}`)} className={classes.chip} /> : null
								) : null} */}
							</ItemGrid>
						</ItemGrid>
						<Hidden mdDown>
							<ItemGrid >
								<img src={UserPlaceHolder} alt={"profilepicture"} className={classes.img} />
							</ItemGrid>
						</Hidden>
					</ItemGrid>
				}
			/>



		)
	}
}

export default UserContact
