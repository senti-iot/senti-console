import React, { useEffect, useState, useRef } from 'react'
import FilterInput from 'components/Table/FilterInput'
import FilterCard from 'components/Table/FilterCard'
import { useSelector, useDispatch } from 'react-redux'
import { MenuItem, MenuList, ClickAwayListener, Paper, Popper, Grow } from '@material-ui/core'
import { addFilter, editFilter as reduxEditFilter, removeFilter, changeEH } from 'redux/appState'
import { useLocalization } from 'hooks'

const FilterToolbar = props => {
	//Hooks
	const t = useLocalization()
	const dispatch = useDispatch()

	//Redux
	const chips = useSelector(state => state.appState.filters)
	/**
	 * TODO
	 * unused
	 * eH - eventHandler - hooks to the window so that all the handlers are passed to the filtertoolbar
	 */
	const eH = useSelector(state => state.appState.EH)

	//State
	const [actionAnchor, setActionAnchor] = useState(null)
	// const [focusedMenu, setFocusedMenu] = useState(-1)
	const [error, setError] = useState(false)
	const [openFilterCard, setOpenFilterCard] = useState(false)
	const [editFilter, setEditFilter] = useState(null) // added
	const [editChip, setEditChip] = useState(null) // added
	const [state, setState] = useState({})

	//Const
	const { reduxKey, filters } = props

	let inputRef = useRef(null)
	let chipRef = useRef(null)

	//useCallbacks

	//useEffects

	useEffect(() => {
		// window.addEventListener('keydown', handleWindowKeyPress, false)
		return () => {
			window.removeEventListener('keydown', handleWindowKeyPress, false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (eH) {
			// window.addEventListener('keydown', handleWindowKeyPress, false)
		}
		else {
			// window.removeEventListener('keydown', handleWindowKeyPress, false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eH])

	//Handlers


	const handleBlur = () => {
		// window.removeEventListener('keydown', handleMenuNav, false)
		// window.addEventListener('keydown', handleWindowKeyPress, false)
	}

	const handleFocus = () => {
		handleClose()
		// window.addEventListener('keydown', handleMenuNav, false)
		// window.removeEventListener('keydown', handleWindowKeyPress, false)
	}

	const handleClose = () => {
		// console.log('Did this')
		// console.trace()
		// window.addEventListener('keydown', handleWindowKeyPress, false)
		if (actionAnchor) {
			setActionAnchor(null)
		}
	}

	const onBeforeAdd = (chip) => {
		if (typeof chip === 'string')
			if (chip.length >= 2)
				return true
			else {
				// setError(true)
				// setTimeout(() => {
				// 	setError(false)
				// }, 500);
				return false
			}
		else {
			return true
		}
	}


	const handleDoubleClick = chip => {
		let allChips = chips[reduxKey]
		let findChip = allChips[allChips.findIndex(c => c.id === chip.id)]
		let editFilterr = filters[filters.findIndex(f => {
			return f.key === findChip.key && f.type === findChip.type
		})]
		setEditFilter(editFilterr)
		setEditChip(findChip)
		dispatch(changeEH(false))
	}

	// const handleMenuNav = e => {
	// 	if (actionAnchor !== null) {
	// 		switch (e.keyCode) {
	// 			case 13:
	// 				const ft = filters[focusedMenu]
	// 				if (ft) {
	// 					setState({ ...state, [ft.name]: true })
	// 					setActionAnchor(null)
	// 					setFocusedMenu(-1)
	// 					setOpenFilterCard(true)
	// 				}
	// 				break

	// 			case 40: //keyboard down
	// 				let nFocusedMenu = focusedMenu === (filters.length - 1) ? 0 : focusedMenu + 1
	// 				setFocusedMenu(nFocusedMenu)
	// 				break
	// 			case 38: //keyboard up
	// 				setFocusedMenu(focusedMenu === 0 ? filters.length - 1 : focusedMenu - 1)
	// 				break
	// 			case 27:
	// 				// window.addEventListener('keydown', handleWindowKeyPress, false)
	// 				setActionAnchor(null)
	// 				setFocusedMenu(-1)
	// 				break
	// 			default:
	// 				if (actionAnchor !== null) {
	// 					setActionAnchor(null)
	// 				}
	// 				break
	// 		}
	// 		e.stopPropagation()
	// 	}
	// 	else {
	// 		if (e.keyCode === 40)
	// 			handleClick()
	// 		if (e.keyCode === 27) {
	// 			//TODO
	// 			inputRef.current.blur()
	// 			handleBlur()
	// 		}
	// 	}
	// }
	const handleClick = e => {
		// window.removeEventListener('keydown', handleWindowKeyPress, false)
		if (actionAnchor === null) {
			setActionAnchor(chipRef)
			// window.addEventListener('keydown', handleMenuNav, false)
			// inputRef.current.focus()
		}
		else {
			// window.addEventListener('keydown', handleWindowKeyPress, false)
			setActionAnchor(null)
		}
	}
	const handleWindowKeyPress = e => {
		if (actionAnchor === null && e.keyCode === 70 && !openFilterCard) {
			e.preventDefault()
			handleClick()
		}
	}

	const handleAdd = (displayValue, value, key, type, icon, name, filterType) => {
		if (onBeforeAdd(value)) {
			setState({ ...state, [name]: false })
			setOpenFilterCard(false)
			setActionAnchor(null)
			dispatch(addFilter({ value, key, type: type ? type : "", icon, displayValue: displayValue, filterType }, reduxKey))
		}
	}

	const handleEdit = (displayValue, value, key, type, icon, id, filterType) => {
		dispatch(reduxEditFilter({ id, value, key, type: type, icon, displayValue: displayValue, filterType: filterType }, reduxKey))
		setEditFilter(false)
		setEditChip(null)
		dispatch(changeEH(false))
	}

	const handleChangeFilterType = (chip, filterType) => {
		dispatch(reduxEditFilter({ ...chip, filterType: filterType }, reduxKey))
		dispatch(changeEH(false))
	}
	const handleDelete = (deletedChip) => {
		dispatch(removeFilter(deletedChip, reduxKey))
	}

	const handleMenuItem = ft => {
		setState({ ...state, [ft]: true })
		setOpenFilterCard(true)
	}

	// const isSelected = id => focusedMenu === id ? true : false

	return (
		<ClickAwayListener onClickAway={handleClose}>
			<div style={{ width: '100%' }}>
				<FilterInput
					onBlur={handleBlur}
					inputRef={r => inputRef = r}
					chipRef={r => chipRef = r}
					chips={chips[reduxKey]}
					onBeforeAdd={(chip) => onBeforeAdd(chip)}
					// onBeforeDelete={handleClose}
					handleDoubleClick={handleDoubleClick}
					onFocus={handleFocus}
					onAdd={(displayValue, value, key, type, filterType) => {
						handleAdd(displayValue, value, key, type, null, null, filterType)
					}}
					onDelete={(deletedChip, i) => handleDelete(deletedChip, i)}
					handleClick={handleClick}
					dataSourceConfig={{ id: 'id', text: 'displayValue', value: 'displayValue' }}
					handleChangeFilterType={handleChangeFilterType}
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
											<MenuItem key={i} onClick={() => handleMenuItem(ft.name)}>
												{ft.name}
											</MenuItem>
									) : null}
								</MenuList>
							</Paper>
						</Grow>)}
				</Popper>

				{editFilter ? <FilterCard
					open={editFilter ? true : false}
					anchorEl={inputRef.current}
					title={editFilter.name}
					type={editFilter.type}
					options={editFilter.options}
					content={editFilter.content}
					hidden={editFilter.hidden}
					edit
					pValue={editChip.value}
					pFilterType={editChip.filterType}
					handleButton={(displayValue, value, icon, filterType) => { handleEdit(displayValue, value, editFilter.key, editFilter.type, icon, editChip.id, filterType) }}
					handleClose={() => {
						setEditFilter(false)
						setEditChip(null)
					}}
				/> : null}
				{(filters && inputRef) ? filters.map((ft, i) => {
					return <FilterCard
						resetError={() => setError(false)}
						error={error}
						key={i}
						open={state[ft.name]}
						anchorEl={inputRef.current}
						title={ft.name}
						hidden={ft.hidden}
						type={ft.type}
						options={ft.options}
						content={ft.content}
						handleButton={(displayValue, value, icon, filterType) =>  handleAdd(displayValue, value, ft.key, ft.type, icon, ft.name, filterType)}
						handleClose={() => {
							setState({
								...state,
								[ft.name]: false
							})
							setOpenFilterCard(false)
						}}
					/>
				}) : null}
			</div>
		</ClickAwayListener>
	)
}

export default FilterToolbar
