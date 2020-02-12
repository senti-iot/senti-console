import React, { useEffect, Fragment, useState } from 'react'
import FilterInput from 'components/Table/FilterInput'
import FilterCard from 'components/Table/FilterCard'
import { useSelector, useDispatch } from 'react-redux'
import { MenuItem, MenuList, ClickAwayListener, Paper, Popper, Grow } from '@material-ui/core'
import { addFilter, editFilter as reduxEditFilter, removeFilter, changeEH } from 'redux/appState'
import { useLocalization } from 'hooks'

// const mapStateToProps = (state) => ({
// 	chips: state.appState.filters,
// 	eH: state.appState.EH
// })


// const mapDispatchToProps = (dispatch) => ({
// 	addFilter: (filter, type) => dispatch(addFilter(filter, type)),
// 	editFilter: (filter, type) => dispatch(editFilter(filter, type)),
// 	removeFilter: (filter, type) => dispatch(removeFilter(filter, type)),
// 	disableEH: () => dispatch(changeEH(false)),
// 	enableEH: () => dispatch(changeEH(true))
// })

// @Andrei
// there are some issues - lines 139, 169, 209, 215, 324, 333
const FilterToolbar = props => {
	const t = useLocalization()
	const dispatch = useDispatch()
	const chips = useSelector(state => state.appState.filters)
	const eH = useSelector(state => state.appState.EH)

	let input
	let chip

	const [/* openMenu */, setOpenMenu] = useState(false)
	const [actionAnchor, setActionAnchor] = useState(null)
	const [focusedMenu, setFocusedMenu] = useState(-1)
	const [error, setError] = useState(false)
	const [openFilterCard, setOpenFilterCard] = useState(false)
	const [editFilter, setEditFilter] = useState(null) // added
	const [editChip, setEditChip] = useState(null) // added
	// constructor(props) {
	// 	super(props)
	// 	this.state = {
	// 		openMenu: false,
	// 		actionAnchor: null,
	// 		focusedMenu: -1,
	// 		error: false,
	// 		openFilterCard: false
	// 	}
	// }

	useEffect(() => {
		window.addEventListener('keydown', handleWindowKeyPress, false)

		return () => {
			// window.removeEventListener('keydown', handleMenuFav, false)
			window.removeEventListener('keydown', handleWindowKeyPress, false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentWillUnmount = () => {
	// 	window.removeEventListener('keydown', this.handleMenuNav, false)
	// 	window.removeEventListener('keydown', this.handleWindowKeyPress, false)
	// }

	useEffect(() => {
		if (eH) {
			window.addEventListener('keydown', handleWindowKeyPress, false)
		}
		else {
			window.removeEventListener('keydown', handleWindowKeyPress, false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eH])
	// componentDidUpdate = (prevProps, prevState) => {
	// 	if (this.props.eH) {
	// 		window.addEventListener('keydown', this.handleWindowKeyPress, false)
	// 	}
	// 	else { 
	// 		window.removeEventListener('keydown', this.handleWindowKeyPress, false)
	// 	}
	// }

	// componentDidMount = () => {
	// 	window.addEventListener('keydown', this.handleWindowKeyPress, false)
	// }

	const handleClick = e => {
		window.removeEventListener('keydown', handleWindowKeyPress, false)
		if (actionAnchor === null) {
			setActionAnchor(chip)
			// this.setState({ actionAnchor: this.chip });
			window.addEventListener('keydown', handleMenuNav, false)
			// this.input.focus()
		}
		else {
			window.addEventListener('keydown', handleWindowKeyPress, false)
			setActionAnchor(null)
			// this.setState({ actionAnchor: null })
		}
	}
	const handleBlur = () => {
		window.removeEventListener('keydown', handleMenuNav, false)
		window.addEventListener('keydown', handleWindowKeyPress, false)
	}
	const handleFocus = () => {
		window.addEventListener('keydown', handleMenuNav, false)
		window.removeEventListener('keydown', handleWindowKeyPress, false)
	}
	const handleClose = () => {
		window.addEventListener('keydown', handleWindowKeyPress, false)
		setActionAnchor(null)
		// this.setState({ actionAnchor: null })
	}
	const handleWindowKeyPress = e => {
		// const { actionAnchor, openFilterCard } = this.state
		if (actionAnchor === null && e.keyCode === 70 && !openFilterCard) {
			e.preventDefault()
			handleClick()
		}
	}
	const onBeforeAdd = (chip) => {
		if (typeof chip === 'string')
			if (chip.length >= 2)
				return true
			else {
				setError(true)
				// this.setState({ error: true })
				setTimeout(() => {
					setError(false)
					// this.setState({ error: false })
				}, 500);
				return false
			}
		else {
			return true
		}
	}
	// as a replacement for setState callbacks below
	useEffect(() => {
		if (editFilter || editChip) {
			dispatch(changeEH(false))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editFilter, editChip])

	const handleDoubleClick = chip => {
		const { filters, reduxKey } = props
		let allChips = chips[reduxKey]
		let editChipp = allChips[allChips.findIndex(c => c.id === chip.id)]
		let editFilterr = filters[filters.findIndex(f => {
			return f.key === editChip.key && f.type === editChip.type
		})]
		setEditFilter(editFilterr)
		setEditChip(editChipp)
		// this.setState({ editFilter: editFilter, editChip }, () => { this.props.disableEH()})
	}
	const handleMenuNav = e => {
		if (actionAnchor !== null) {
			const { filters } = props
			// const { focusedMenu, actionAnchor } = this.state
			switch (e.keyCode) {
				case 13:
					const ft = filters[focusedMenu]
					if (ft) {
						setActionAnchor(null)
						setFocusedMenu(-1)
						setOpenFilterCard(true)
						// how to rewrite [ft.name]: true ??
					}
					// this.setState({ [ft.name]: true, actionAnchor: null, focusedMenu: -1, openFilterCard: true })
					break;
				case 40: //keyboard down
					setFocusedMenu(focusedMenu === filters.length - 1 ? 0 : focusedMenu + 1)
					// this.setState({ focusedMenu: focusedMenu === filters.length - 1 ? 0 : focusedMenu + 1 })
					break;
				case 38: //keyboard up
					setFocusedMenu(focusedMenu === 0 ? filters.length - 1 : focusedMenu - 1)
					// this.setState({ focusedMenu: focusedMenu === 0 ? filters.length - 1 : focusedMenu - 1 })
					break;
				case 27:
					window.addEventListener('keydown', handleWindowKeyPress, false)
					setActionAnchor(null)
					setFocusedMenu(-1)
					// this.setState({ actionAnchor: null, focusedMenu: -1 })
					break;
				default:
					if (actionAnchor !== null) {
						setActionAnchor(null)
						// this.setState({ actionAnchor: null })
					}
					break;
			}
			e.stopPropagation()
		}
		else {
			if (e.keyCode === 40)
				handleClick()
			if (e.keyCode === 27) {
				input.blur()
				handleBlur()
			}
		}
	}
	const handleAdd = (displayValue, value, key, type, icon, name) => {
		const { reduxKey } = props
		if (onBeforeAdd(value)) {
			setOpenFilterCard(false)
			// how to rewrite [name]: false ??
			// this.setState({ [name]: false, openFilterCard: false })
			dispatch(addFilter({ value, key, type: type ? type : null, icon, displayValue: displayValue }, reduxKey))
		}
	}

	// setState callback replacement for the function below
	useEffect(() => {
		if (!editFilter && !editChip) {
			dispatch(changeEH(false))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editFilter, editChip])
	const handleEdit = (displayValue, value, key, type, icon, id) => {
		const { reduxKey } = props
		dispatch(reduxEditFilter({ id, value, key, type: type ? type : null, icon, displayValue: displayValue }, reduxKey))
		setEditFilter(false)
		setEditChip(null)
		// this.setState({ editFilter: false, editChip: null }, () => dispatch(changeEH(false)))
	}
	const handleDelete = (deletedChip) => {
		const { reduxKey } = props
		dispatch(removeFilter(deletedChip, reduxKey))
	}
	const handleMenuItem = ft => {
		setOpenMenu(false)
		setOpenFilterCard(true)
		// how to rewrite [ft]: true ?
		// this.setState({ [ft]: true, openMenu: false, openFilterCard: true })
	}

	const isSelected = id => focusedMenu === id ? true : false

	const { reduxKey, filters } = props
	// const { actionAnchor, editChip, editFilter } = this.state
	return (
		<ClickAwayListener onClickAway={handleClose}>
			<Fragment>
				<FilterInput
					onBlur={handleBlur}
					inputRef={ref => input = ref}
					chipRef={ref => chip = ref}
					value={chips[reduxKey]}
					onBeforeAdd={(chip) => onBeforeAdd(chip)}
					onBeforeDelete={handleClose}
					handleDoubleClick={handleDoubleClick}
					onFocus={handleFocus}
					onAdd={(displayValue, value, key) => handleAdd(displayValue, value, key)}
					onDelete={(deletedChip, i) => handleDelete(deletedChip, i)}
					handleClick={handleClick}
					dataSourceConfig={{ id: 'id', text: 'displayValue', value: 'displayValue' }}
					placeholder={t('actions.search')}
					fullWidth
					t={t}
				/>
				<Popper
					open={actionAnchor ? true : false}
					anchorEl={actionAnchor}
					placement="bottom-start"
					transition
					disablePortal
					modifiers={{
						hide: {
							enabled: false
						},
						flip: {
							enabled: false,
						},
						preventOverflow: {
							enabled: false,
							boundariesElement: 'scrollParent',
						}
					}}
					onClose={() => setActionAnchor(null)}
					style={{ zIndex: 1028, marginTop: 8 }}
				>
					{({ TransitionProps }) => (
						<Grow {...TransitionProps} timeout={350} style={{
							position: "absolute",
							top: 0
						}}>
							<Paper onClick={e => e.stopPropagation()} >
								<MenuList>
									{filters ? filters.map((ft, i) =>
										ft.hidden ? null :
											<MenuItem selected={isSelected(i)} key={i} onClick={() => handleMenuItem(ft.name)}>
												{ft.name}
											</MenuItem>
									) : null}
								</MenuList>
							</Paper>
						</Grow>)}
				</Popper>
				{editFilter ? <FilterCard
					open={editFilter ? true : false}
					anchorEl={input}
					title={editFilter.name}
					type={editFilter.type}
					options={editFilter.options}
					content={editFilter.content}
					hidden={editFilter.hidden}
					edit
					value={editChip.value}
					handleButton={(displayValue, value, icon) => { handleEdit(displayValue, value, editFilter.key, editFilter.type, icon, editChip.id) }}
					handleClose={() => {
						// this.setState({ editFilter: false, editChip: null })
						setEditFilter(false)
						setEditChip(null)
					}}
				/> : null}
				{filters ? filters.map((ft, i) => {
					return <FilterCard
						resetError={() => setError(false)}
						error={error}
						key={i}
						open={this.state[ft.name]} // TODO
						anchorEl={input}
						title={ft.name}
						hidden={ft.hidden}
						type={ft.type}
						options={ft.options}
						content={ft.content}
						handleButton={(displayValue, value, icon) => { handleAdd(displayValue, value, ft.key, ft.type, icon, ft.name) }}
						handleClose={() => {
							// this.setState({ [ft.name]: false, openFilterCard: false })
							setOpenFilterCard(false)
						}}
					/>
				}) : null}
			</Fragment>
		</ClickAwayListener>
	)
}

export default FilterToolbar
