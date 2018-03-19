import React from 'react'
import { ButtonPanel, LinkButton } from 'odeum-ui'
import {
	AlignCenter,
	HomepageHeader,
	HomepageTagLine,
	HomepageButonsContainer,
	LinkTo,
	HomepageButtonSpacer,
	HomepageFlexContainer,
	HomepageBox,
	HomepageSectionHeader,
	HomepageSection,
} from './HomepageStyles'

const Homepage = () => {
	return (
		<div>
			<AlignCenter>
				<HomepageHeader>Senti Project</HomepageHeader>
				<HomepageTagLine>A NodeJS API and React components for building Help Indexes for ODEUM Code Apps</HomepageTagLine>
				<HomepageButonsContainer>
					<ButtonPanel wrap={'wrap'}>

						<LinkButton label={'Get Help'} icon={'help'} route={'/help/'} color={'#13A085'} />
						<HomepageButtonSpacer />
						<LinkButton label={'Form demo'} icon={'assignment'} route={'/form/formlist'} />
						<HomepageButtonSpacer />
						<LinkButton label={'Tutorial'} icon={'code'} route={'/help/tutorial'} />

					</ButtonPanel>
				</HomepageButonsContainer>

			</AlignCenter>

			<HomepageFlexContainer>

				<HomepageBox width={1 / 3} ml={40} mr={40}>
					<HomepageSectionHeader>Declarative API</HomepageSectionHeader>
					<HomepageSection>ODEUM Code Help exhibits a simple NodeJS API for CRUD based persistance of help items and help indexes for an ODEUM Code App.</HomepageSection>
					<HomepageSection>Create, Read, Update and Delete help items for a specific App ID and access the API through React components.</HomepageSection>
				</HomepageBox>

				<HomepageBox width={1 / 3} ml={40} mr={40}>
					<HomepageSectionHeader>React components</HomepageSectionHeader>
					<HomepageSection>ODEUM Code Help implements React components for creating, listing, editing and deleting help items for a designated ODEUM Web App.</HomepageSection>
					<HomepageSection>Get ODEUM Code Help before your neighbor calls for help somewhere else.</HomepageSection>
				</HomepageBox>

				<HomepageBox width={1 / 3} ml={40} mr={40}>
					<HomepageSectionHeader>Simple Form Setup</HomepageSectionHeader>
					<HomepageSection>Using our simple Form component you'll be on track with creating forms in minutes. Check it out in this <LinkTo to={'/form/formdemo'}>Form Demo</LinkTo>. The Form component includes form field validation you configure very easily.</HomepageSection>
					<HomepageSection>Creating fast and simple forms in React has never been easier.</HomepageSection>
				</HomepageBox>

			</HomepageFlexContainer>
		</div>
	)
}

export default Homepage
