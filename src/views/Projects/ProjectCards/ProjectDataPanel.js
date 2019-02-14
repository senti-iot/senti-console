import React, { Component } from 'react'
import { InfoCard, ItemG } from 'components';
import { IconButton } from '@material-ui/core';
import { Add, Visibility, Clear, EventNote } from 'variables/icons';

class ProjectDataPanel extends Component {
	render() {
		const { t } = this.props
		return (
			<InfoCard
				title={t('collections.cards.data') + ' Control Panel'}
				avatar={<EventNote />}
				noExpand
				noMargin
				noPadding
				content={null}
				topAction={
					<ItemG container>
						<ItemG>
							<IconButton>
								<Add />
							</IconButton>
						</ItemG>
						<ItemG>
							<IconButton>
								<Visibility />
							</IconButton>
						</ItemG>
						<ItemG>
							<IconButton>
								<Clear />
							</IconButton>
						</ItemG>
					</ItemG>
				}
			/>
		)
	}
}

export default ProjectDataPanel
