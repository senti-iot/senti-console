import React, { Component } from 'react'

import { Typography, Paper } from '@material-ui/core';
import { GridContainer, ItemG } from 'components';
import withLocalization from 'components/Localization/T';

class NotFound extends Component {
	componentDidMount = () => {
		this.props.setHeader('404.title', true)
	}

	render() {
		return (
			<GridContainer>
				<Paper style={{ width: '100%', height: 'calc(100vh - 70px' }}>
					<ItemG container justify={'center'}>
						<ItemG container xs={12} justify={'center'}>
							<Typography variant={'h2'} style={{ margin: 24 }}>
								404
							</Typography>
						</ItemG>
						<ItemG xs={12}>
							<Typography variant={'h6'} style={{ margin: 24 }}>
								{this.props.t('404.errorMessage')}
							</Typography>
						</ItemG>
					</ItemG>

				</Paper>
			</GridContainer>

		)
	}
}

export default withLocalization()(NotFound)