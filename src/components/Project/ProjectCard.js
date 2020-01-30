import React, { useState } from 'react'
import { IconButton, Menu, MenuItem, withStyles, Button, Typography } from '@material-ui/core'
import { ItemGrid, SmallCard } from 'components'
import regularCardStyle from 'assets/jss/material-dashboard-react/regularCardStyle'
import { MoreVert, Edit, /* PictureAsPdf, Devices, Delete, */ LibraryBooks } from 'variables/icons'
import { withRouter } from 'react-router-dom'
import { useLocalization } from 'hooks'

const ProjectCard = props => {
	const t = useLocalization()
	const [actionAnchor, setActionAnchor] = useState(null)
	const [img, /* setImg */] = useState(null)
	// constructor(props) {
	//   super(props)

	//   this.state = {
	// 	 actionAnchor: null,
	// 	 img: null
	//   }
	// }

	const handleOpenActionsDetails = event => {
		setActionAnchor(event.currentTarget)
		// this.setState({ actionAnchor: event.currentTarget });
	}

	const handleCloseActionsDetails = () => {
		setActionAnchor(null)
		// this.setState({ actionAnchor: null });
	}

	// handleEdit = () => {
	// }

	// handleDeleteProject = () => {
	// }
	const { p, classes } = props

	return (
		<SmallCard
			avatar={<LibraryBooks />}
			key={p.id}
			title={p.title}
			img={img}
			topAction={
				<ItemGrid noMargin noPadding>
					<IconButton
						aria-label='More'
						aria-owns={actionAnchor ? 'long-menu' : null}
						aria-haspopup='true'
						onClick={handleOpenActionsDetails}>
						<MoreVert />
					</IconButton>
					<Menu
						id='long-menu'
						anchorEl={actionAnchor}
						open={Boolean(actionAnchor)}
						onClose={handleCloseActionsDetails}
						PaperProps={{
							style: {
								minWidth: 200
							}
						}}>
						<MenuItem onClick={() => props.history.push(`/project/${p.id}/edit`)}>
							<Edit className={classes.leftIcon} />{t('menus.edit')}
						</MenuItem>
					</Menu>
				</ItemGrid>
			}
			content={<Typography>{p.description}</Typography>}
			rightActions={
				<Button variant={'text'} color={'primary'} onClick={() => props.history.push(`/project/${p.id}`)}>
					{t('menus.seeMore')}
				</Button>
			}
		/>
	)
}

export default withRouter(withStyles(regularCardStyle)(ProjectCard))
