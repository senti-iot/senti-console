import React, { Component } from 'react'
import { InfoCard, ItemG, DateFilterMenu } from 'components';
import { IconButton } from '@material-ui/core';
import { Add, Visibility, Clear, EventNote } from 'variables/icons';
import { connect } from 'react-redux'

class ProjectDataPanel extends Component {
	render() {
		const { t, periods } = this.props
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
						{periods.length < 5 && <ItemG>
							<DateFilterMenu
								icon={<Add />}
								t={t}
							/>
						</ItemG>}
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
const mapStateToProps = (state) => ({
	periods: state.dateTime.periods
})


export default connect(mapStateToProps)(ProjectDataPanel)
