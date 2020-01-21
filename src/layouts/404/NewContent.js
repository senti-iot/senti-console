import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import Warning from '@material-ui/icons/Warning'
import amber from '@material-ui/core/colors/amber';
import styled from 'styled-components'
import { useSelector } from 'react-redux';

const IconWarn = styled(Warning)`
	color: #ffffff;
	font-size: 16px;
	opacity: 0.9;
	margin-right: 8px;
`
const UpdateSnackbar = styled(SnackbarContent)`
	background: ${amber[700]};
`
const RefreshButton = styled(Button)`
	color: #ffffff;
	background :${amber[700]};
	&:hover {
    	background: ${amber[500]};
  	}
`
const Message = styled.span`
	color: #ffffff;
	display: flex;
	align-items: center;
`

function NewContent(props) {
	const serviceWorkerUpdated = useSelector(s => s.serviceWorkerReducer.serviceWorkerUpdated)
	const handleClose = () => {
		window.location.reload()
	};
	return (

		<Snackbar
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}
			open={serviceWorkerUpdated}
		>
			<UpdateSnackbar
				message={<Message>
					<IconWarn />
					{props.installing ? 'Caching application ...' : 'Update Available'}
				</Message>}
				action={<RefreshButton size="small" onClick={handleClose}>
					REFRESH</RefreshButton>}
			>
			</UpdateSnackbar>
		</Snackbar>
	);
}

export default NewContent