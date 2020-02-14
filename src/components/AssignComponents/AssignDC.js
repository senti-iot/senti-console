import { AppBar, Button, Dialog, Divider, IconButton, List, ListItem, ListItemText, Toolbar, Typography, Hidden } from '@material-ui/core';
import { Close } from 'variables/icons';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';
import { getAllCollections } from 'variables/dataCollections';
import { ItemG, CircularLoader, SlideT } from 'components';
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import { assignDeviceToCollection } from 'variables/dataCollections';
import assignStyles from 'assets/jss/components/assign/assignStyles';
import { useLocalization } from 'hooks'

// @Andrei
const AssignDC = React.memo(props => {
	const t = useLocalization()
	const classes = assignStyles()
	const [collections, setCollections] = useState([])
	const [selectedCollections, setSelectedCollections] = useState([])
	const [filters, setFilters] = useState({ keyword: '' })
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		collections: [],
	// 		selectedCollections: [],
	// 		filters: {
	// 			keyword: '',
	// 		},
	// 	}
	// }
	//#region LifeCycle
	// componentDidMount = async () => {
	// 	this._isMounted = 1
	// }
	useEffect(() => {
		const asyncFunc = async () => {
			if (props.open === true) {
				await getAllCollections().then(rs => setCollections(rs))
			}
		}
		asyncFunc()
	}, [props.open])

	// componentDidUpdate = async (prevProps, prevState) => {
	// 	if (prevProps.open !== this.props.open && this.props.open === true) {
	// 		await getAllCollections().then(rs => rs ? this.setState({ collections: rs }) : this.setState({ collections: [] }))
	// 	}
	// }

	// componentWillUnmount = () => {
	// 	this._isMounted = 0
	// }

	//#endregion

	//#region External

	const assignCollection = async () => {
		const { deviceId } = props

		await assignDeviceToCollection({ id: selectedCollections, deviceId }).then(rs => {
			props.handleClose(true)
		})
	}
	//#endregion

	//#region Handlers

	const handleClick = (e, pId) => {
		e.preventDefault()
		setSelectedCollections(pId)
		// this.setState({ selectedCollections: pId })
	}
	const handleFilterKeyword = value => {
		setFilters({ ...filters, keyword: value })
		// this.setState({
		// 	filters: {
		// 		...this.state.filters,
		// 		keyword: value
		// 	}
		// })
	}
	const isSelectedFunc = id => selectedCollections === (id) ? true : false
	//#endregion

	// const { collections, filters } = this.state
	const { open } = props;
	const appBarClasses = cx({
		[' ' + classes['primary']]: 'primary'
	});
	return (

		<Dialog
			fullScreen
			open={open}
			onClose={() => props.handleClose(false)}
			TransitionComponent={SlideT}
		>
			<AppBar className={classes.appBar + appBarClasses}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={2} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={() => props.handleClose(false)}
									aria-label='CloseCollection'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('collections.pageTitle')}
								</Typography>
							</ItemG>
							<ItemG xs={8}>
								<Search
									fullWidth
									open={true}
									focusOnMount
									suggestions={collections ? suggestionGen(collections) : []}
									handleFilterKeyword={handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
							<ItemG xs={2}>
								<Button color='inherit' onClick={assignCollection}>
									{t('actions.save')}
								</Button>
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={12} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={() => props.handleClose(false)} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('collections.pageTitle')}
								</Typography>
								<Button variant={'contained'} color='primary' onClick={assignCollection}>
									{t('actions.save')}
								</Button>
							</ItemG>
							<ItemG xs={12} container alignItems={'center'} justify={'center'}>
								<Search
									noAbsolute
									fullWidth
									open={true}
									focusOnMount
									suggestions={collections ? suggestionGen(collections) : []}
									handleFilterKeyword={handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<List>
				{collections ? filterItems(collections, filters).map((p, i) => (
					<Fragment key={i}>
						<ListItem button
							onClick={e => handleClick(e, p.id)}
							classes={{ root: isSelectedFunc(p.id) ? classes.selectedItem : null }}>
							<ListItemText
								primaryTypographyProps={{ className: isSelectedFunc(p.id) ? classes.selectedItemText : null }}
								secondaryTypographyProps={{ classes: { root: isSelectedFunc(p.id) ? classes.selectedItemText : null } }}
								primary={p.name} secondary={`${t('collections.fields.id')}: ${p.id}`} />
						</ListItem>
						<Divider />
					</Fragment>
				)
				) : <CircularLoader />}
			</List>
		</Dialog>

	);
})

AssignDC.propTypes = {
	classes: PropTypes.object.isRequired,
	deviceId: PropTypes.number.isRequired,
};

export default AssignDC