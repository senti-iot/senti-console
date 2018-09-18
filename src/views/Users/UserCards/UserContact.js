import React, { Component } from 'react'
import { InfoCard, ItemGrid, Caption, Info } from 'components';
import { Hidden, Chip } from '@material-ui/core';
import UserPlaceHolder from 'assets/img/userplaceholder.png'
import { pF } from 'variables/functions';
import { Person } from '@material-ui/icons'
import { NavLink } from 'react-router-dom'
export class UserContact extends Component {
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
							{/* <ItemGrid xs>
								<ItemGrid zeroMargin noPadding container justify={'flex-start'}>
									<ItemGrid zeroMargin noPadding>
										<Caption>{t("users.fields.firstName")}</Caption>
										<Info>{user.firstName}</Info>
									</ItemGrid>
									<ItemGrid zeroMargin>
										<Caption>{t("users.fields.lastName")}</Caption>
										<Info>{user.lastName}</Info>
									</ItemGrid>
								</ItemGrid>
							</ItemGrid> */}
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
								{/* <Info>{user.accessLevel}</Info> */}
								{user.groups ? Object.keys(user.groups).map((k, i) => k > 0 ? <Chip key={i} color={"primary"} label={t(`users.groups.${k}`)} className={classes.chip} /> : null
								) : null}
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
