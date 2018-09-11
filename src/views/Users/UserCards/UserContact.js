import React, { Component } from 'react'
import { InfoCard, ItemGrid, Caption, Info } from 'components';
import { Hidden } from '@material-ui/core';
import UserPlaceHolder from 'assets/img/userplaceholder.jpg'

export class UserContact extends Component {
	render() {
		const { t, user, classes } = this.props
		return (
		
				
			<InfoCard
				title={t('users.headers.contact')}
				noExpand
				content={
					<ItemGrid zeroMargin noPadding container >
						<Hidden lgUp>
							<ItemGrid container justify={'center'}>
								<img src={UserPlaceHolder} alt={"profilepicture"} className={classes.img} />
							</ItemGrid>
						</Hidden>
						<ItemGrid zeroMargin noPadding lg={9} md={12}>
							<ItemGrid xs>
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
							</ItemGrid>
							<ItemGrid>
								<Caption>{t("users.fields.email")}</Caption>
								<Info>{user.email} </Info>
							</ItemGrid>
							<ItemGrid>
								<Caption>{t("users.fields.phone")}</Caption>
								<Info>{user.phone} </Info>
							</ItemGrid>
							<ItemGrid>
								<Caption>{t("users.fields.organisation")}</Caption>
								<Info>{user.org ? user.org.name : t("users.noOrg")} </Info>
							</ItemGrid>
							<ItemGrid>
								<Caption>{t("users.fields.language")}</Caption>
								{/* <Info>{user.settings.language}</Info> */}
							</ItemGrid>
							<ItemGrid>
								<Caption>{t("users.fields.accessLevel")}</Caption>
								<Info>{user.accessLevel}</Info>
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
