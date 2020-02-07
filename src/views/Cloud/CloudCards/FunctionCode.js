import React from 'react'
import { InfoCard, ItemG } from 'components';
import { Code } from 'variables/icons';
// import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow';
import 'brace/theme/monokai';
import { useLocalization, useTheme } from 'hooks';
import { makeStyles } from '@material-ui/styles';

const styles = makeStyles((theme) => ({
	editor: {
		// width: 'calc(100% - 36px)',
		border: '1px solid rgba(100, 100, 100, 0.25)',
		padding: 4,
		borderRadius: 4,
		"&:hover": {
			boder: '1px solid #000'
		}
	}
}))

const FunctionCode = props => {
	//Hooks
	const t = useLocalization()
	const classes = styles()
	const theme = useTheme()
	//Redux

	//State

	//Const
	const { cloudfunction } = props

	return (
		<InfoCard
			title={t('cloudfunctions.fields.code')}
			avatar={<Code />}
			noExpand
			content={
				<ItemG container>
					<ItemG xs={12}>
						<div className={classes.editor}>
							<AceEditor
								mode={'javascript'}
								theme={theme.palette.type === 'light' ? 'tomorrow' : 'monokai'}
								onChange={() => { }}
								value={cloudfunction.js}
								highlightActiveLine={false}
								readOnly
								showPrintMargin={false}
								style={{ width: '100%' }}
								name="UNIQUE_ID_OF_DIV"
								editorProps={{ $blockScrolling: true }}
							/>
						</div>
					</ItemG>
				</ItemG>
			} />
	)
}

export default FunctionCode
