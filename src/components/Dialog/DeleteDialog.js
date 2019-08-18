import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, List, Divider, ListItem, ListItemIcon, ListItemText, DialogActions, Button } from '@material-ui/core';

function DeleteDialog(props) {
	const { t, message, messageOpts, title, icon, single, open, data,
		dataKey, handleCloseDeleteDialog, handleDelete } = props
	return (
		<Dialog
			open={open}
			onClose={handleCloseDeleteDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>
				{t(title)}
			</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t(message, messageOpts)}
				</DialogContentText>
				{single ? null :
					<List dense={true}>
						<Divider />
						{data.map(s => {
							return <ListItem divider key={s.id}>
								<ListItemIcon>
									{icon}
								</ListItemIcon>
								<ListItemText primary={s[dataKey]} />
							</ListItem>
						})
						}
					</List>
				}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseDeleteDialog} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={handleDelete} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default DeleteDialog
