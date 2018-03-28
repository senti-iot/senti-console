import React, { Component } from 'react'
import { Icon } from 'odeum-ui'
import { arrayMove } from 'react-sortable-hoc'
// import 'react-dates/lib/css/_datepicker.css'

//Components
import DayPickerRangeControllerWrapper from './Components/DatePicker/DatePicker'
import CardView from './CardView'
import ListView from './ListView'
import MapView from './MapView'
import Pagination from '../Pagination/Pagination'
import ExpandedCardItem from '../Card/EmptyExpandedCardItem'
import NewProject from './Components/Functions/NewProject'

// Styles
import { Text } from '../List/ListStyles'
import {
	DropDown, DropDownContainer,
	DropDownButton, Margin, DropDownItem,
	DropDownSection, DropDownIcon, DropDownText,
	DropDownSubSection, DropDownSubItem
} from './Components/DropDown/DropDown'
import {
	FunctionBar, ChangeViewButtonCard,
	ChangeViewButtonMap, ChangeViewButtonList,
	ChangeViewButtonContainer, Input, SearchContainer, View,
} from './ViewStyles'

export default class ViewContainer extends Component {
	constructor(props) {
		super(props)
		// var settings = JSON.parse(window.localStorage.getItem('visibleColumns')) || undefined
		this.state = {
			inputFocus: false,
			view: 1,
			pageSize: 25,
			searchString: '',
			sortOpen: false,
			pageSizeOpen: false,
			funcOpen: false,
			funcNewProject: false,
			sortColumn: /* settings ? settings[settings.findIndex(c => c.visible === true)].column :  */Object.keys(this.props.items[0])[0],
			sortDirection: false,
			visibleColDropDown: false,
			pageOfItems: [],
			visibleColumns: /*  settings ||  */Object.keys(this.props.items[0]).map(c => c = { column: c, visible: true })

		}
		this.listPageSizes = [10, 25, 50, 75, 100]
		this.cardPageSizes = [10, 25, 50, 75, 100]
	}

	componentWillUpdate = (nextProps, nextState) => {
	}

	createInputRef = (node) => {
		this.node = node
	}

	filterItems = (items) => {
		const { searchString, sortDirection, sortColumn } = this.state
		var searchStr = searchString.toLowerCase()
		var arr = this.props.items
		if (arr[0] === undefined)
			return []
		var keys = Object.keys(arr[0])
		var filtered = arr.filter(c => {
			var contains = keys.map(key => {
				if (c[key] instanceof Date)
					return c[key].toLocaleDateString().toLowerCase().includes(searchStr)
				else
					return c[key].toString().toLowerCase().includes(searchStr)
			})
			return contains.indexOf(true) !== -1 ? true : false
		})
		if (sortColumn === 'user')
			switch (sortDirection) {
				case true:
					return filtered.sort((a, b) => a[sortColumn].name > b[sortColumn].name ? -1 : a[sortColumn].name < b[sortColumn].name ? 1 : 0)
				case false:
					return filtered.sort((a, b) => a[sortColumn].name < b[sortColumn].name ? -1 : a[sortColumn].name > b[sortColumn].name ? 1 : 0)
				default:
					return filtered
			}
		else
			switch (sortDirection) {
				case true:
					return filtered.sort((a, b) => a[sortColumn] > b[sortColumn] ? -1 : a[sortColumn] < b[sortColumn] ? 1 : 0)
				case false:
					return filtered.sort((a, b) => a[sortColumn] < b[sortColumn] ? -1 : a[sortColumn] > b[sortColumn] ? 1 : 0)
				default:
					return filtered
			}
	}

	changeView = (int) => (e) => {
		e.preventDefault()
		this.setState({ view: int })
		return int === 0 ? this.setState({ pageSize: 10 }) :
			int === 1 ? this.setState({ pageSize: 25 })
				: null
	}

	//#region Handlers

	handleDragSort = ({ oldIndex, newIndex }) => {
		this.setState({
			visibleColumns: arrayMove(this.state.visibleColumns, oldIndex, newIndex),
		})
	}

	handleVisibility = (visibleColDropDown) => e => {
		e.preventDefault()
		this.setState({ visibleColDropDown: visibleColDropDown })
	}

	handleVisibleColumn = (column) => e => {
		e.preventDefault()
		var newArr = this.state.visibleColumns.map(c => c.column === column ? { column: c.column, visible: !c.visible } : c)
		this.setState({ visibleColumns: newArr })
		window.localStorage.setItem('visibleColumns', JSON.stringify(newArr))
	}

	handleSearch = (e) => {
		this.setState({ searchString: e.target.value })
	}

	handlePageSize = (size) => e => {
		e.preventDefault()
		this.setState({ pageSize: parseInt(size, 10) })
	}

	handlePageSizeOpen = (pageSizeOpen) => e => {
		e.preventDefault()
		this.setState({ pageSizeOpen: pageSizeOpen })
	}

	handleSortOpen = (sortOpen) => e => {
		e.preventDefault()
		this.setState({ sortOpen: sortOpen })
	}

	handleSort = (column) => e => {
		e.stopPropagation()
		e.preventDefault()
		if (this.state.sortColumn !== column)
			this.setState({
				sortColumn: column,
				sortDirection: false
			})
		else
			this.setState({
				sortDirection: !this.state.sortDirection
			})
	}

	handleFocusInput = () => {
		this.node.focus()
		this.setState({ inputFocus: true })
	}

	handleActiveColumn = (col) => col === this.state.sortColumn ? true : false

	handleFunctionsOpen = (funcOpen) => e => {
		e.preventDefault()
		this.setState({ funcOpen: funcOpen })
	}

	handlePageChange = (pageOfItems) => {
		if (this.state.pageOfItems !== pageOfItems)
			this.setState({ pageOfItems: pageOfItems })
	}

	//#endregion

	//#region Rendering


	renderPageSizes = (view, pageSize) => {
		switch (view) {
			case 0:
				return this.cardPageSizes.map(o =>
					<DropDownItem key={o} active={o === pageSize ? true : false} onClick={this.handlePageSize(o)}>{o}</DropDownItem>)
			case 1:
				return this.listPageSizes.map(o =>
					<DropDownItem key={o} active={o === pageSize ? true : false} onClick={this.handlePageSize(o)}>{o}</DropDownItem>)
			default:
				return null
		}
	}

	renderView = (pageSize, view, sortColumn, sortDirection) => {
		const { pageOfItems } = this.state
		switch (view) {
			case 0:
				return <CardView
					pageSize={pageSize}
					sortColumn={sortColumn}
					sortDirection={sortDirection}
					handleSort={this.handleSort}
					items={this.state.pageOfItems}
					columns={this.state.visibleColumns}
				/>
			case 1:
				return <ListView
					pageSize={pageSize}
					sortColumn={sortColumn}
					sortDirection={sortDirection}
					handleSort={this.handleSort}
					items={this.state.pageOfItems}
					columns={this.state.visibleColumns}
					onSortEnd={this.handleDragSort}
				/>
			case 2:
				return <MapView
					pageSize={pageSize}
					sortColumn={sortColumn}
					handleSort={this.handleSort}
					items={this.filterItems(pageOfItems)}
				/>
			default:
				break
		}
	}

	renderPageSizeOption = (view, pageSize, pageSizeOpen) => {
		return <DropDownContainer onMouseLeave={this.handlePageSizeOpen(false)}>
			<DropDownButton onMouseEnter={this.handlePageSizeOpen(true)}>
				{pageSize}
			</DropDownButton>
			<Margin />
			<DropDown>
				{pageSizeOpen && this.renderPageSizes(view, pageSize)}
			</DropDown>
		</DropDownContainer>
	}
	handleFunctionNewProject = () => {
		this.setState({ funcNewProject: !this.state.funcNewProject })
	}
	renderFunctionNewProject = () => {
		return <ExpandedCardItem handleVerticalExpand={this.handleFunctionNewProject} >
			<NewProject />
		</ExpandedCardItem>
	}
	renderFunctions = (funcOpen) => {
		return <DropDownContainer onMouseLeave={this.handleFunctionsOpen(false)} >
			<DropDownButton onMouseEnter={this.handleFunctionsOpen(true)} style={{ width: 100 }}>
				Funktioner
			</DropDownButton>
			<Margin />
			{funcOpen && <DropDown>
				<DropDownItem onClick={this.handleFunctionNewProject}>Nyt Projekt</DropDownItem>
				<DropDownItem>Del en Projekt</DropDownItem>
				<DropDownItem>Foj til favoritter</DropDownItem>
				<DropDownItem>Foj til Dashboard</DropDownItem>
				<DropDownItem>Export og deling</DropDownItem>
				<DropDownItem>Print som PDF</DropDownItem>
			</DropDown>}
		</DropDownContainer>
	}

	renderDropDownItem = (label, icon, columnFunc, columnName) => {
		const { visibleColumns } = this.state
		return <DropDownItem>
			<DropDownIcon onClick={columnFunc}>
				<Icon icon={icon ? icon : 'visibility'} color={'#FFFFFF'} active={visibleColumns.find(c => c.column === columnName).visible ? true : false} />
			</DropDownIcon>
			<DropDownText>
				<Text>
					{label}
				</Text>
			</DropDownText>
		</DropDownItem>
	}

	renderDropDownSorting = (sortDirection) => {
		// const { visibleColumns } = this.state
		return <DropDownSection>
			<DropDownSubSection>
				<DropDownIcon>
					<Icon icon={"sort"} color={'#FFFFFF'} />
				</DropDownIcon>
				<DropDownText>
					<Text>
						Sortering:
					</Text>
				</DropDownText>
			</DropDownSubSection>
			<DropDownSubItem>
				{/* <DropDownIcon onClick={this.handleVisibleColumn('title')}>
					<Icon icon={"visibility"}
						color={'#FFFFFF'}
						active={visibleColumns.find(c => c.column === 'title').visible ? true : false} />
				</DropDownIcon> */}
				<DropDownText onClick={this.handleSort('title')} active={this.handleActiveColumn('title')} sorting={sortDirection}>
					<Text>
						Alfabetisk
					</Text>
				</DropDownText>
			</DropDownSubItem>
			<DropDownSubItem>
				{/* <DropDownIcon onClick={this.handleVisibleColumn('open_date')}>
					<Icon icon={"visibility"} color={'#FFFFFF'} active={visibleColumns.find(c => c.column === 'open_date').visible ? true : false} />
				</DropDownIcon> */}
				<DropDownText onClick={this.handleSort('open_date')} active={this.handleActiveColumn('open_date')} sorting={sortDirection}>
					<Text>
						Dato
					</Text>
				</DropDownText>
			</DropDownSubItem>
			<DropDownSubItem>
				{/* <DropDownIcon onClick={this.handleVisibleColumn('seneste_reg')}>
					<Icon icon={"visibility"} color={'#FFFFFF'} active={visibleColumns.find(c => c.column === 'seneste_reg').visible ? true : false} />
				</DropDownIcon> */}
				<DropDownText onClick={this.handleSort('seneste_reg')} active={this.handleActiveColumn('seneste_reg')} sorting={sortDirection}>
					<Text>
						Senest aktiv
					</Text>
				</DropDownText>
			</DropDownSubItem>
			<DropDownSubItem>
				{/* <DropDownIcon onClick={this.handleVisibleColumn('progress')}>
					<Icon icon={"visibility"} color={'#FFFFFF'} active={visibleColumns.find(c => c.column === 'progress').visible ? true : false} />
				</DropDownIcon> */}
				<DropDownText onClick={this.handleSort('progress')} active={this.handleActiveColumn('progress')} sorting={sortDirection}>
					<Text>
						Antal
					</Text>
				</DropDownText>
			</DropDownSubItem>
		</DropDownSection>
	}

	renderVisibleSortOption = (sortOpen, sortDirection) => {

		return <DropDownContainer onMouseLeave={this.handleSortOpen(false)}>
			<DropDownButton onMouseEnter={this.handleSortOpen(true)} >
				<Icon icon={'visibility'} color={'#FFF'} active={true} iconSize={20} style={{ margin: 3 }} />
			</DropDownButton>
			<Margin />

			{sortOpen && <DropDown style={{ width: 150 }}>
				{this.renderDropDownSorting(sortDirection)}
				{this.renderDropDownItem('Gennemfort i %', 'visibility', this.handleVisibleColumn('progress'), 'progress')}
				{this.renderDropDownItem('Oprettet', 'visibility', this.handleVisibleColumn('open_date'), 'open_date')}
				{this.renderDropDownItem('Senest aktiv', 'visibility', this.handleVisibleColumn('seneste_reg'), 'seneste_reg')}
				{this.renderDropDownItem('Kontakt', 'visibility', this.handleVisibleColumn('user'), 'user')}
				{this.renderDropDownItem('Antal', 'visibility', this.handleVisibleColumn('hits'), 'hits')}
			</DropDown>
			}
		</DropDownContainer>
	}

	renderChangeViewOptions = (view) => {
		return <ChangeViewButtonContainer>
			<ChangeViewButtonCard view={view} onClick={this.changeView(0)}>
				<Icon iconSize={25} icon={'view_module'} color={'#FFFFFF'} active={view === 0 ? true : false} />
			</ChangeViewButtonCard>
			<ChangeViewButtonList view={view} onClick={this.changeView(1)}>
				<Icon iconSize={25} icon={'list'} color={'#FFFFFF'} active={view === 1 ? true : false} />
			</ChangeViewButtonList>
			<ChangeViewButtonMap view={view} onClick={this.changeView(2)}>
				<Icon iconSize={25} icon={'location'} color={'#FFFFFF'} active={view === 2 ? true : false} />
			</ChangeViewButtonMap>
		</ChangeViewButtonContainer>
	}

	renderSearchOption = (searchString) => {
		return <SearchContainer onClick={this.handleFocusInput} active={this.state.inputFocus}>
			<Icon icon={'search'} iconSize={20} style={{ margin: 3, paddingRight: 3, borderRight: '1px solid #cecece' }} />
			<Input innerRef={this.createInputRef} onChange={this.handleSearch} value={searchString} onBlur={() => this.state.inputFocus ? this.setState({ inputFocus: false }) : null} />
		</SearchContainer>
	}

	//#endregion

	render() {
		const { funcOpen, funcNewProject } = this.state
		const { view, searchString, pageSize, pageSizeOpen, sortOpen, sortDirection, sortColumn } = this.state
		return <View>
			{funcNewProject && this.renderFunctionNewProject()}
			<FunctionBar>
				{this.renderFunctions(funcOpen)}
				<DayPickerRangeControllerWrapper />
				{this.renderSearchOption(searchString)}
				{this.renderPageSizeOption(view, pageSize, pageSizeOpen)}
				{this.renderVisibleSortOption(sortOpen, sortDirection)}
				{this.renderChangeViewOptions(view)}
			</FunctionBar>
			{this.renderView(pageSize, view, sortColumn, sortDirection)}
			{view !== 2 ? <Pagination items={this.filterItems(this.props.items)} onChangePage={this.handlePageChange} pageSize={pageSize} /> : null}
		</View>

	}
}