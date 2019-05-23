import React, { Component } from 'react'
import { Button, withStyles, Slide } from '@material-ui/core';
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import { Grid, Paper } from '@material-ui/core'
import { GridContainer, ItemGrid, TextF, DSelect } from 'components'
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow';
import 'brace/theme/monokai';
/**
* @augments {Component<{	t:Function.isRequired,	collection:object.isRequired,	handleChangeDevice:Function.isRequired,	handleCloseDevice:Function.isRequired,	handleOpenDevice:Function.isRequired,	open:boolean.isRequired,	devices:array.isRequired,	device:object.isRequired,	handleCreate:Function.isRequired,	handleChange:Function.isRequired,>}
*/
class CreateFunctionForm extends Component {
	constructor(props) {
		super(props)

		this.state = {
			filters: {
				keyword: ''
			}
		}
	}

	transition = (props) => {
		return <Slide direction='up' {...props} />;
	}
	handleFilterKeyword = value => {
		this.setState({
			filters: {
				keyword: value
			}
		})
	}

	renderType = () => {
		const { t, cloudfunction, handleChange } = this.props
		return <DSelect
			margin={'normal'}
			label={t('cloudfunctions.type')}
			value={cloudfunction.type}
			onChange={handleChange('type')}
			menuItems={[
				{ value: 0, label: t('cloudfunctions.fields.types.jsfunction') },
				// { value: 1, label: t('cloudfunctions.fields.types.external') },
			]}
		/>
	}
	
	render() {
		const { t, handleChange, cloudfunction, classes, handleCreate, handleCodeChange, goToRegistries } = this.props
		return (
			<GridContainer>
				<Paper className={classes.paper}>
					<form className={classes.form}>
						<Grid container>
							<ItemGrid xs={12}>
								<TextF
									id={'functionName'}
									label={t('collections.fields.name')}
									handleChange={handleChange('name')}
									value={cloudfunction.name}
									autoFocus
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								<TextF
									id={'functionName'}
									label={t('collections.fields.description')}
									handleChange={handleChange('description')}
									value={cloudfunction.description}
									autoFocus
								/>
							</ItemGrid>
							<ItemGrid xs={12}>
								{this.renderType()}
							</ItemGrid>
							<ItemGrid xs={12}>
								{cloudfunction.type === 0 ? 
									<div className={classes.editor}>
										<AceEditor 
											mode={'javascript'}
											theme={this.props.theme.palette.type === 'light' ? 'tomorrow' : 'monokai'}
											onChange={handleCodeChange('js')}
											value={cloudfunction.js}
											showPrintMargin={false}
											style={{ width: '100%' }}
											name="createCloudFunction"
											editorProps={{ $blockScrolling: true }}
										/>
									</div> : null
								}
							</ItemGrid>
					
							<ItemGrid container style={{ margin: 16 }}>
								<div className={classes.wrapper}>
									<Button
										variant='outlined'
										onClick={goToRegistries}
										className={classes.redButton}
									>
										{t('actions.cancel')}
									</Button>
								</div>
								<div className={classes.wrapper}>
									<Button onClick={handleCreate} variant={'outlined'} color={'primary'}>
										{t('actions.save')}
									</Button>
								</div>
							</ItemGrid> 
						
						</Grid>
					</form>
				</Paper>
			</GridContainer>
		)
	}
}


export default withStyles(createprojectStyles, { withTheme: true })(CreateFunctionForm)