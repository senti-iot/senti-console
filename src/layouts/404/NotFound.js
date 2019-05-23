import React, { Component } from 'react'

import { Typography, Paper, Button } from '@material-ui/core';
import { GridContainer, ItemG } from 'components';
import withLocalization from 'components/Localization/T';
import Img404 from 'assets/img/404/404.svg'
class NotFound extends Component {
	componentDidMount = () => {
		this.props.setHeader('404.title', true, '', '')
	}

	render() {
		const { location, t } = this.props
		let prevURL = location.prevURL ? location.prevURL : ""
		return (
			<GridContainer>
				<Paper style={{ width: '100%', height: 'calc(100vh - 70px' }}>
					<ItemG container justify={'center'}>
						<ItemG container xs={12} justify={'center'}>
							<img src={Img404} alt={'404'} style={{ marginTop: 24 }}/>
						</ItemG>
						<ItemG container justify={'center'} xs={12} variant={'title'} style={{ margin: 24 }}>
							<Typography>{prevURL}</Typography>
						</ItemG>
						<ItemG container justify={'center'} xs={12}>
							<Typography variant={'h6'} style={{ marginTop: 24 }}>
								{t('404.errorMessage')}
							</Typography>
						</ItemG>
						<ItemG container justify={'center'} xs={12}>
							<Typography variant={'h6'}>
								{t('404.contactSupport')}
							</Typography>
						</ItemG>
						<ItemG container justify={'center'} xs={12}>
							<Button style={{ marginTop: 124 }} variant={'outlined'} color={'primary'} onClick={() => this.props.history.push('/')}>
								{t('404.goHome')}
							</Button>
						</ItemG>
					</ItemG>

				</Paper>
			</GridContainer>

		)
	}
}

export default withLocalization()(NotFound)