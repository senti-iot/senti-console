import React, { Component } from 'react'
import { Icon } from 'odeum-ui'
import { arrayMove } from 'react-sortable-hoc'
// import 'react-dates/lib/css/_datepicker.css'

//Components
import DayPickerRangeControllerWrapper from '../Aux/DatePicker/DatePicker'
import CardView from './CardView'
import ListView from './ListView'
import MapView from './MapView'
import Pagination from '../Pagination/Pagination'
import ExpandedCard from '../Aux/Modal/ExpandedCard'
import NewProject from './Components/Functions/NewProject/NewProject'
import { renderPageSizeOption } from './Components/Functions/PageSize/PageSize'
import SearchComponent from './Components/Functions/Search/Search'
// Styles
import { Text } from './Components/ListView/List/ListStyles'
import {
	DropDown, DropDownContainer,
	DropDownButton, Margin, DropDownItem,
	DropDownSection, DropDownIcon, DropDownText,
	DropDownSubSection, DropDownSubItem
} from '../Aux/DropDown/DropDown'
import {
	FunctionBar, ChangeViewButtonCard,
	ChangeViewButtonMap, ChangeViewButtonList,
	ChangeViewButtonContainer, View,
} from './ViewStyles'
import moment from 'moment'
import { getAllProjects, deleteProject } from 'utils/data'
import { Button } from 'odeum-ui'
import { withTheme } from 'styled-components'
import { LoaderSmall } from 'LoginStyles'
import cookie from 'react-cookies'

class ViewContainer extends Component {

	constructor(props) {
		super(props)
		this.state = {
			// inputFocus: false,
			isLoading: true,
			view: cookie.load('View') !== undefined ? parseInt(cookie.load('View'), 10) : 1,
			pageSize: 25,
			searchString: '',
			sortOpen: false,
			pageSizeOpen: false,
			funcOpen: false,
			funcNewProject: false,
			deleteOpen: false,
			sortColumn: [],
			sortDirection: false,
			visibleColDropDown: false,
			pageOfItems: [],
			visibleColumns: [],
			dateFilter: {
				active: false,
				startDate: moment('2017-01-01'),
				endDate: moment()
			},
			items: undefined,
			checkedItems: []
		}
	}

	//#region Lifecycle Functions

	componentDidMount = () => {
		this._ismounted = true
		this.getProjects()

	}
	componentWillUnmount = () => {
		this._ismounted = false
	}
	//#endregion

	//#region Item manipulation

	getProjects = async () => {
		this.data = await getAllProjects().then(
			externalData => {
				this.data = null
				var sortColumn = Object.keys(externalData[0])[0]
				var visibleColumns = Object.keys(externalData[0]).map(c => c = { column: c, visible: c === "id" ? false : true })
				if (this._ismounted) {
					this.setState({ items: externalData, visibleColumns: visibleColumns, sortColumn: sortColumn, isLoading: false })
				}
			}
		)
	}

	filterByDate = (items) => {
		const { startDate, endDate } = this.state.dateFilter
		var arr = items
		var keys = Object.keys(arr[0])
		var filteredByDate = arr.filter(c => {
			var contains = keys.map(key => {
				var openDate = moment(c['open_date'])
				var closeDate = moment(c['close_date'])
				if (openDate.isBetween(startDate, endDate) || closeDate.isBetween(startDate, endDate)) {
					return true
				}
				else
					return false
			})
			return contains.indexOf(true) !== -1 ? true : false
		})
		return filteredByDate
	}

	filterItems = (items) => {
		const { searchString, sortDirection, sortColumn } = this.state
		const { active } = this.state.dateFilter
		var searchStr = searchString.toLowerCase()
		var arr = this.state.items
		if (active)
			arr = this.filterByDate(arr)
		if (arr[0] === undefined)
			return []
		var keys = Object.keys(arr[0])
		var filtered = arr.filter(c => {
			var contains = keys.map(key => {
				if (c[key] instanceof Date)
					return c[key]/* .toLocaleDateString() */.toLowerCase().includes(searchStr)
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

	handleCheckedItems = (checkedItems) => {
		this.setState({ checkedItems: checkedItems })
	}

	//#endregion

	//#region Visibility of columns


	handleVisibility = (visibleColDropDown) => e => {
		e.preventDefault()
		this.setState({ visibleColDropDown: visibleColDropDown })
	}
	handleColumnName = (column) => {
		var col = column.replace('_', ' ')
		return col.charAt(0).toUpperCase() + col.slice(1)
	}
	renderVisibilityOption = (label, icon, columnFunc, columnName, i) => {
		const { visibleColumns } = this.state
		return <DropDownItem key={i}>
			<DropDownIcon onClick={columnFunc}>
				<Icon icon={visibleColumns.find(c => c.column === columnName).visible ? 'visibility' : 'visibility_off'} activeColor={'#FFFFFF'} active={visibleColumns.find(c => c.column === columnName).visible ? true : false} />
			</DropDownIcon>
			<DropDownText>
				<Text>
					{label}
				</Text>
			</DropDownText>
		</DropDownItem>
	}
	renderVisibleSortOption = (sortOpen, sortDirection) => {

		return <DropDownContainer onMouseLeave={this.handleSortOpen(false)}>
			<DropDownButton onMouseEnter={this.handleSortOpen(true)} >
				<Icon icon={'visibility'} color={'#FFF'} iconSize={20} style={{ margin: 3 }} />
			</DropDownButton>
			<Margin />

			{sortOpen && <DropDown style={{ width: 150 }}>
				{this.renderDropDownSorting(sortDirection)}
				{/* {this.renderDropDownItem('Gennemfort i %', 'visibility', this.handleVisibleColumn('progress'), 'progress')}
				{this.renderDropDownItem('Oprettet', 'visibility', this.handleVisibleColumn('open_date'), 'open_date')}
				{this.renderDropDownItem('Senest aktiv', 'visibility', this.handleVisibleColumn('las'), 'seneste_reg')}
				{this.renderDropDownItem('Kontakt', 'visibility', this.handleVisibleColumn('user'), 'user')}
				{this.renderDropDownItem('Antal', 'visibility', this.handleVisibleColumn('hits'), 'hits')} */}
				{this.state.visibleColumns.map((c, i) => {
					return this.renderVisibilityOption(this.handleColumnName(c.column), 'visibility', this.handleVisibleColumn(c.column), c.column, i)
				})}
			</DropDown>
			}
		</DropDownContainer>
	}

	handleVisibleColumn = (column) => e => {
		e.preventDefault()
		var newArr = this.state.visibleColumns.map(c => c.column === column ? { column: c.column, visible: !c.visible } : c)
		this.setState({ visibleColumns: newArr })
	}

	handleActiveColumn = (col) => col === this.state.sortColumn ? true : false

	//#endregion

	//#region Paging

	handlePageSize = (size) => e => {
		e.preventDefault()
		this.setState({ pageSize: parseInt(size, 10) })
	}

	handlePageSizeOpen = (pageSizeOpen) => e => {
		e.preventDefault()
		this.setState({ pageSizeOpen: pageSizeOpen })
	}

	handlePageChange = (pageOfItems) => {
		if (this.state.pageOfItems !== pageOfItems)
			this.setState({ pageOfItems: pageOfItems })
	}
	//#endregion

	//#region Sorting and Filtering

	handleDragSort = ({ oldIndex, newIndex }) => {
		this.setState({
			visibleColumns: arrayMove(this.state.visibleColumns, oldIndex, newIndex),
		})
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
				<DropDownText onClick={this.handleSort('title')} active={this.handleActiveColumn('title')} sorting={sortDirection}>
					<Text>
						Alfabetisk
					</Text>
				</DropDownText>
			</DropDownSubItem>
			<DropDownSubItem>
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
				{/* <DropDownText onClick={this.handleSort('seneste_reg')} active={this.handleActiveColumn('seneste_reg')} sorting={sortDirection}>
					<Text>
						Senest aktiv
					</Text>
				</DropDownText> */}
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
	//Date Filter
	handleDateFilter = (startDate, endDate) => {
		this.setState({ dateFilter: { active: true, startDate: startDate, endDate: endDate } })
	}

	handleDisableDateFilter = () => {
		this.setState({ dateFilter: { ...this.state.dateFilter, active: false } })
	}

	handleSearch = (string) => {
		this.setState({ searchString: string })
	}

	//#endregion

	//#region Functions Dropdown

	handleFunctionsOpen = (funcOpen) => e => {
		e.preventDefault()
		this.setState({ funcOpen: funcOpen })
	}



	renderFunctions = (funcOpen) => {
		return <DropDownContainer onMouseLeave={this.handleFunctionsOpen(false)} >
			<DropDownButton onMouseEnter={this.handleFunctionsOpen(true)} style={{ width: 100 }}>
				Funktioner
			</DropDownButton>
			<Margin />
			{funcOpen && <DropDown>
				<DropDownItem onClick={this.handleFunctionNewProjectOpen}>Nyt Projekt</DropDownItem>
				<DropDownItem onClick={this.state.checkedItems.length > 0 ? this.handleDeleteOpen : null}>Del en Projekt</DropDownItem>
				<DropDownItem>Foj til favoritter</DropDownItem>
				<DropDownItem>Foj til Dashboard</DropDownItem>
				<DropDownItem>Export og deling</DropDownItem>
				<DropDownItem>Print som PDF</DropDownItem>
			</DropDown>}
		</DropDownContainer>
	}

	//#endregion

	//#region Delete Project

	getProjectName = (id) => {
		var name = ""
		this.state.items.map(x => x.id === id ? name = x.title : null)
		return name
	}

	deleteProjects = () => async e => {
		e.preventDefault()

		await deleteProject(this.state.checkedItems)
		var data = await getAllProjects()
		this.setState({ items: data, deleteOpen: false, checkedItems: [] })
	}

	handleDeleteOpen = () => {
		this.setState({ deleteOpen: true })
	}
	handleDeleteClose = () => {
		this.setState({ deleteOpen: false })
	}

	renderProjectNames = () => {
		var names = []
		this.state.checkedItems.map(p => {
			return names.push(this.getProjectName(p))
		})
		return names
	}
	renderDeleteProject = () => {
		return <ExpandedCard
			verticalControls={false}
			horizontalControls={false}
			width={400}
			height={300}
			cardExpand={this.state.deleteOpen}
			handleVerticalExpand={this.handleDeleteClose}>

			<div>
				<div style={{ margin: 10, overflow: 'hidden' }}>Er du sikker på, at du vil slette:
					<ul style={{ height: '250px', width: '350px', overflowY: 'auto' }}>
						{this.renderProjectNames().map((e, index) => {
							return <li key={index} style={{ fontWeight: 700 }}> {e} </li>
						})}
					</ul>
				</div>
				<div style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', justifyContent: 'center' }}>
					<Button label={"Ja"} color={this.props.theme.button.background} onClick={this.deleteProjects()} />
					<Button label={"Nej"} color={"crimson"} onClick={this.handleDeleteClose} />
				</div>
			</div>
		</ExpandedCard>
	}
	//#endregion

	//#region New Project
	handleFunctionNewProjectOpen = () => {
		this.setState({ funcNewProject: true, funcOpen: false })
	}

	handleFunctionNewProjectClose = async () => {
		this.setState({ funcNewProject: false, funcOpen: false })
		await this.getProjects()
	}

	renderFunctionNewProject = (exp) => {
		return <NewProject exp={exp} close={this.handleFunctionNewProjectClose} reset={this.state.funcNewProject} />
	}

	//#endregion

	//#region Views

	handleChangeView = (int) => (e) => {
		e.preventDefault()
		this.setState({ view: int })
		cookie.save('View', int)
		return int === 0 ? this.setState({ pageSize: 10 }) :
			int === 1 ? this.setState({ pageSize: 25 })
				: null
	}

	renderChangeViewOptions = (view) => {
		return <ChangeViewButtonContainer>
			<ChangeViewButtonCard view={view} onClick={this.handleChangeView(0)}>
				<Icon iconSize={25} icon={'view_module'} activeColor={'#FFFFFF'} active={view === 0 ? true : false} />
			</ChangeViewButtonCard>
			<ChangeViewButtonList view={view} onClick={this.handleChangeView(1)}>
				<Icon iconSize={25} icon={'list'} activeColor={'#FFFFFF'} active={view === 1 ? true : false} />
			</ChangeViewButtonList>
			<ChangeViewButtonMap view={view} onClick={this.handleChangeView(2)}>
				<Icon iconSize={25} icon={'location'} activeColor={'#FFFFFF'} active={view === 2 ? true : false} />
			</ChangeViewButtonMap>
		</ChangeViewButtonContainer>
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
					deleteProjects={this.deleteProjects}
					handleCheckedItems={this.handleCheckedItems}
					checkedItems={this.state.checkedItems}
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

	//#endregion

	render() {
		const { funcOpen, funcNewProject, isLoading } = this.state
		const { view, searchString, pageSize, pageSizeOpen, sortOpen, sortDirection, sortColumn, dateFilter } = this.state
		return <View style={{ position: 'relative' }}>
			{this.renderFunctionNewProject(funcNewProject)}
			<FunctionBar>
				{this.renderFunctions(funcOpen)}
				<DayPickerRangeControllerWrapper
					handleDateFilter={this.handleDateFilter}
					handleDisableDateFilter={this.handleDisableDateFilter}
					startDate={dateFilter.startDate}
					endDate={dateFilter.endDate}
					activeFilter={dateFilter.active}
				/>
				<SearchComponent searchString={searchString} handleSearch={this.handleSearch} />
				{/* {renderSearchOption(searchString, this.handleFocusInput, inputFocus, this.createInputRef, this.handleSearch)} */}
				{renderPageSizeOption(view, pageSize, pageSizeOpen, this.handlePageSizeOpen, this.handlePageSize)}
				{this.renderVisibleSortOption(sortOpen, sortDirection)}
				{this.renderChangeViewOptions(view)}
				{this.renderDeleteProject()}

			</FunctionBar>
			{!isLoading ? <React.Fragment>
				{this.renderView(pageSize, view, sortColumn, sortDirection)}
				{view !== 2 ? <Pagination items={this.filterItems(this.state.items)} onChangePage={this.handlePageChange} pageSize={pageSize} /> : null}
			</React.Fragment>
				: <LoaderSmall />}


		</View >

	}
}

export default withTheme(ViewContainer)