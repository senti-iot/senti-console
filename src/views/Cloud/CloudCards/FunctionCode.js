import React, { Component } from 'react'
import {  withStyles } from '@material-ui/core';
import { InfoCard, ItemG, ItemGrid } from 'components';
import { DeviceHub } from 'variables/icons';
import { red, green } from '@material-ui/core/colors';
// import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow';
import 'brace/theme/monokai';

const styles = (theme) => ({
	blocked: {
		color: red[500],
		marginRight: 8
	},
	allowed: {
		color: green[500],
		marginRight: 8
	}
})

class FunctionCode extends Component {
	render() {
		const { cloudfunction, t } = this.props
		return (
			<InfoCard
				title={t('cloudfunctions.fields.code')}
				avatar={<DeviceHub />}
				noExpand
				noPadding
				content={
					<ItemGrid container spacing={16}>
						<ItemG xs={12}>
							<div style={{ width: 'calc(100% - 16px)' }}>
								<AceEditor 
									mode={'javascript'}
									theme={this.props.theme.palette.type === 'light' ? 'tomorrow' : 'monokai'}
									onChange={() => {}}
									value={cloudfunction.js}
									readOnly
									showPrintMargin={false}
									style={{ width: '100%' }}
									name="UNIQUE_ID_OF_DIV"
									editorProps={{ $blockScrolling: true }}
								/>
							</div>
						</ItemG>
					</ItemGrid>
				} />
		)
	}
}

export default withStyles(styles)(FunctionCode)
