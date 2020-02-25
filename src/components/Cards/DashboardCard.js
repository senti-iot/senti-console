import React from 'react'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import cx from 'classnames'
import { Muted, Dropdown, ITB } from 'components';
import { Share, Airplay, Edit, /* Star, LocalOffer */ } from 'variables/icons';
import dashboardCardStyles from 'assets/jss/components/dashboards/dashboardCardStyles'


const DashboardCard = props => {
	//Hooks
	const classes = dashboardCardStyles()
	//Redux

	//State

	//Const
	const { header, content, c, handleOpenDashboard, t, handleEditDashboard, handleOpenShare } = props;

	//useCallbacks

	//useEffects

	//Handlers

	return (
		<Card className={classes.card}>

			<CardMedia
				className={cx({
					[classes.media]: true,
					[classes.cardImg]: true,
					[classes[c]]: true
				})}
				// image={null}
				src={'ps'}
				title=''
			>
				<div className={classes.overlayMedia}>
					<ITB
						size={'medium'}
						icon={<Airplay />}
						label={'actions.open'}
						// buttonClass={classes.smallButton}
						style={{ color: '#fff' }}
						onClick={handleOpenDashboard}
					/>
				</div>
				<Dropdown
					buttonClassName={classes.menuButton}
					menuItems={[
						{ label: t('actions.delete'), func: props.deleteDashboard },
					]}>

				</Dropdown>

			</CardMedia>
			<CardContent classes={{ root: classes.cardContent }}>
				<Typography title={header} gutterBottom className={classes.header}>
					{header}
				</Typography>
				<Muted title={content} className={classes.content}>
					<span>
						{content}
					</span>
				</Muted>
			</CardContent>
			<CardActions>
				<ITB
					icon={<Airplay />}
					label={'actions.open'}
					buttonClass={classes.smallButton}
					onClick={handleOpenDashboard}
				/>
				<ITB
					icon={<Share />}
					label={'actions.share'}
					buttonClass={classes.smallButton}
					onClick={handleOpenShare}
				/>
				<div style={{ marginLeft: 'auto' }} />
				<ITB
					icon={<Edit />}
					label={'actions.edit'}
					buttonClass={classes.smallButton}
					onClick={handleEditDashboard} />
			</CardActions>
		</Card>
	);
}



export default DashboardCard