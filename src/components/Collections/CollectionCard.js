import { Button } from '@material-ui/core';
import { Caption, Dropdown, Info, ItemG, ItemGrid, SmallCard } from 'components';
import React, { Fragment } from 'react';
import { dateFormat, dateFormatter } from 'variables/functions';
import { DataUsage, Edit } from 'variables/icons';

/**
 * Unused - Deprecation
 */
const CollectionCard = props => {
	const { d, t, history } = props

	return (
		<SmallCard
			key={d.id}
			title={d.name ? d.name : d.id}
			avatar={<DataUsage />}
			subheader={<ItemG container alignItems={'center'}>
				<Caption>{t('collections.fields.id')}:</Caption>&nbsp;{d.id}
			</ItemG>}
			topAction={
				<Dropdown menuItems={
					[
						{ label: t('menus.edit'), icon: Edit, func: () => history.push({ pathname: `/collection/${d.id}/edit`, prevURL: `/collections/grid` }) },
					]
				} />

			}
			content={<ItemGrid container>
				<ItemG xs={6}>
					<Caption>{t('collections.fields.status')}</Caption>
					<Info>{d.state ? t('collections.fields.state.active') : t('collections.fields.state.inactive')}</Info>
				</ItemG>
				{d.description ? <ItemG xs={6}>
					<Caption>{t('collections.fields.description')}:</Caption>
					<Info>{d.description}</Info>
				</ItemG> : null}
				<ItemG xs={12}>
					<Caption>{t('devices.fields.lastData')}:</Caption>
					<Info title={dateFormatter(d.latestData)}>
						{dateFormat(d.latestData)}
					</Info>
				</ItemG>
				<ItemG xs={12}>
					<Caption>{t('devices.fields.lastStats')}:</Caption>
					<Info title={dateFormatter(d.latestActivity)}>
						{dateFormat(d.latestActivity)}
					</Info>
				</ItemG>
			</ItemGrid>}
			leftActions={

				d.activeDeviceStats ? <Button variant={'text'} color={'primary'} onClick={() => { history.push({ pathname: `/device/${d.activeDeviceStats.id}`, prevURL: '/collections/grid' }) }}>
					{t('menus.seeDevice')}
				</Button> : null
			}
			rightActions={
				<Fragment>
					<Button variant={'text'} color={'primary'} onClick={() => { history.push({ pathname: `/collection/${d.id}`, prevURL: '/collections/grid' }) }}>
						{t('menus.seeMore')}
					</Button>
				</Fragment>
			}
		/>
	)
}

export default CollectionCard
