import React, { Component } from 'react'
import { Dialog, Button } from '@material-ui/core';
import { GridContainer, ItemG, Info } from 'components';
import DevicePDF from './DevicePDF';

class ExportModal extends Component {
	render() {
		const { open, handleClose, t } = this.props
		return (
			<Dialog
				open={open}
				onClose={handleClose}
			>
				<GridContainer>
					<ItemG xs={12}>
						<Info>{t("dialogs.exportMessage")}</Info>
					</ItemG>
					<ItemG container spacing={8} >
						<ItemG xs={3}><Button color={"primary"} variant={'contained'}>CSV</Button></ItemG>
						<ItemG xs={3}><Button color={"primary"} variant={'contained'}>JSON</Button></ItemG>
						<ItemG xs={3}><Button color={"primary"} variant={'contained'}>XLSX</Button></ItemG>
						<ItemG xs={3}><DevicePDF img={this.props.img}/></ItemG>
					</ItemG>
				</GridContainer>
			</Dialog>
		)
	}
}

export default ExportModal
