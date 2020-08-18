import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import Warning from '@material-ui/icons/Warning'
import amber from '@material-ui/core/colors/amber';
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux';
import { ItemG } from 'components'
import { closeIsBeta } from 'redux/serviceWorkerRedux'
import { Close } from 'variables/icons'
import { lightGreen } from '@material-ui/core/colors'

const IconWarn = styled(Warning)`
	color: #ffffff;
	font-size: 24px;
	opacity: 0.9;
	margin-right: 8px;
`
const UpdateSnackbar = styled(SnackbarContent)`
	background: ${amber[700]};
`
const SuccessButton = styled(Button)`
	color: #ffffff;
	padding: 8px;
	background :#4caf50;
	&:hover {
    	background: ${lightGreen[500]};
  	}
`
const RefreshButton = styled(Button)`
	color: #ffffff;
	background :${amber[700]};
	&:hover {
    	background: ${amber[500]};
  	}
`
const Message = styled.span`
	max-width: 800px;
	color: #ffffff;
	display: flex;
	align-items: center;
`

function NewContent(props) {
	const dispatch = useDispatch()
	// const history = useHistory()
	const serviceWorkerUpdated = useSelector(s => s.serviceWorkerReducer.serviceWorkerUpdated)
	const isBeta = useSelector(s => s.serviceWorkerReducer.isBeta)
	const handleClose = () => {
		window.location.reload()
	};
	const handleBetaClose = () => {
		dispatch(closeIsBeta())
	}
	const handleGoToApp = () => {
		window.location.href = 'https://app.senti.cloud'
	}
	return (
		<>
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
						{'Update Available'}
					</Message>}
					action={<RefreshButton size="small" onClick={handleClose}>
					REFRESH</RefreshButton>}
				>
				</UpdateSnackbar>
			</Snackbar>
			<Snackbar
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				open={isBeta}
			>
				<UpdateSnackbar
					message={
						<ItemG container>
							<ItemG xs={1} container justify={'center'} alignItems={'center'}>
								<IconWarn />
							</ItemG>
							<ItemG xs container alignItems={'center'} >
								<Message>
									{`You are running on the \`beta\` version of Senti!`}
								</Message>
								<Message>
							Please consider switching to the stable version at https://app.senti.cloud
								</Message>
							</ItemG>
							<ItemG >
								<SuccessButton size="small" onClick={handleGoToApp}>
									Go to App
								</SuccessButton>
								<RefreshButton onClick={handleBetaClose}>
									<Close />
								</RefreshButton>
							</ItemG>
						</ItemG>
					}
					// action={

					// }
				>
				</UpdateSnackbar>
			</Snackbar>
		</>

	);
}

export default NewContent