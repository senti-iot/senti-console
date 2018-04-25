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
import ExpandedCard from '../Card/ExpandedCard'
import NewProject from './Components/Functions/NewProject'
import { renderPageSizeOption } from './Components/PageSize/PageSize'
import SearchComponent from './Components/Search/Search'
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
	ChangeViewButtonContainer, View,
} from './ViewStyles'
import moment from 'moment'
import { getAllProjects, deleteProject } from 'utils/data'
import { Button } from 'odeum-ui'
import { withTheme } from 'styled-components'

class ViewContainer extends Component {
	constructor(props) {
		super(props)
		// var settings = JSON.parse(window.localStorage.getItem('visibleColumns')) || undefined
		this.state = {
			// inputFocus: false,
			view: 1,
			pageSize: 25,
			searchString: '',
			sortOpen: false,
			pageSizeOpen: false,
			funcOpen: false,
			funcNewProject: false,
			deleteOpen: false,
			sortColumn: []/* settings ? settings[settings.findIndex(c => c.visible === true)].column :  */,
			sortDirection: false,
			visibleColDropDown: false,
			pageOfItems: [],
			visibleColumns: [],
			dateFilter: {
				active: false,
				startDate: moment('2015-01-01'),
				endDate: moment()
			},
			items: undefined,
			checkedItems: []
		}
	}
	async componentDidMount() {
		this.data = await getAllProjects().then(
			externalData => {
				this.data = null
				var sortColumn = Object.keys(externalData[0])[0]
				var visibleColumns = Object.keys(externalData[0]).map(c => c = { column: c, visible: true })
				this.setState({ items: externalData, visibleColumns: visibleColumns, sortColumn: sortColumn })
			}
		)
		// this.getProjects()
	}
	getProjects = () => {
		this.data = getAllProjects().then(
			externalData => {
				console.log('externalData', externalData)
				// var sortColumn = Object.keys(externalData[0])[0]
				// var visibleColumns = Object.keys(externalData[0]).map(c => c = { column: c, visible: true })
				// this.setState({ items: externalData, visibleColumns: visibleColumns, sortColumn: sortColumn })
				// this.data = null
			}
		)
		// var data = await getAllProjects()
	}
	componentWillUnmount() {

	}

	deleteProjectNames = (id) => {
		var name = ""
		this.state.items.map(x => x.id === id ? name = x.title : null)
		return name
	}
	projectNames = () => {
		var names = []
		this.state.checkedItems.map(p => {
			return names.push(this.deleteProjectNames(p))
		})
		return names
	}
	deleteProjects = () => async e => {
		e.preventDefault()

		await deleteProject(this.state.checkedItems)

		var data = await getAllProjects()
		this.setState({ items: data, deleteOpen: false, checkedItems: [] })
	}

	onCheckedItems = (checkedItems) => {
		this.setState({ checkedItems: checkedItems })
	}

	filterByDate = (items) => {
		const { startDate, endDate } = this.state.dateFilter
		// console.log(startDate.getTime(), endDate.getTime())
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

	changeView = (int) => (e) => {
		e.preventDefault()
		this.setState({ view: int })
		return int === 0 ? this.setState({ pageSize: 10 }) :
			int === 1 ? this.setState({ pageSize: 25 })
				: null
	}

	//#region Handlers

	/**
	 * Date Filtering
	 */
	handleDateFilter = (startDate, endDate) => {
		this.setState({ dateFilter: { active: true, startDate: startDate, endDate: endDate } })
	}

	handleDisableDateFilter = () => {
		this.setState({ dateFilter: { ...this.state.dateFilter, active: false } })
	}

	/**
	 * Dragging and sorting List Columns
	 */
	handleDragSort = ({ oldIndex, newIndex }) => {
		this.setState({
			visibleColumns: arrayMove(this.state.visibleColumns, oldIndex, newIndex),
		})
	}

	/**
	 * 'Eye' Button dropdown handler
	 */
	/* 	handleVisibility = (visibleColDropDown) => e => {
			e.preventDefault()
			this.setState({ visibleColDropDown: visibleColDropDown })
		} */

	/**
	 * Visible Columns handler
	 */
	handleVisibleColumn = (column) => e => {
		e.preventDefault()
		var newArr = this.state.visibleColumns.map(c => c.column === column ? { column: c.column, visible: !c.visible } : c)
		this.setState({ visibleColumns: newArr })
		// window.localStorage.setItem('visibleColumns', JSON.stringify(newArr))
	}

	/**
	 * Search string handler for the input inside ./Components/Search/Search.js
	 */

	handleSearch = (string) => {
		this.setState({ searchString: string })
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



	handleDeleteOpen = () => {
		this.setState({ deleteOpen: true })
	}

	handleFunctionNewProject = (open) => async e => {
		e.preventDefault()
		if (open)
			this.setState({ funcNewProject: open, funcOpen: false })
		else {
			this.setState({ funcNewProject: open, funcOpen: false })
			await this.getProjects()
		}
	}

	renderFunctionNewProject = (exp) => {
		return <ExpandedCard
			horizontalControls={false}
			verticalControls={false}
			cardExpand={exp}
			handleVerticalExpand={this.handleFunctionNewProject} >
			<NewProject close={this.handleFunctionNewProject} />
		</ExpandedCard>
	}
	renderFunctions = (funcOpen) => {
		return <DropDownContainer onMouseLeave={this.handleFunctionsOpen(false)} >
			<DropDownButton onMouseEnter={this.handleFunctionsOpen(true)} style={{ width: 100 }}>
				Funktioner
			</DropDownButton>
			<Margin />
			{funcOpen && <DropDown>
				<DropDownItem onClick={this.handleFunctionNewProject(true)}>Nyt Projekt</DropDownItem>
				<DropDownItem onClick={this.state.checkedItems.length > 0 ? this.handleDeleteOpen : null}>Del en Projekt</DropDownItem>
				<DropDownItem>Foj til favoritter</DropDownItem>
				<DropDownItem>Foj til Dashboard</DropDownItem>
				<DropDownItem>Export og deling</DropDownItem>
				<DropDownItem>Print som PDF</DropDownItem>
			</DropDown>}
		</DropDownContainer>
	}

	renderDropDownItem = (label, icon, columnFunc, columnName) => {
		// const { visibleColumns } = this.state
		return <DropDownItem>
			<DropDownIcon onClick={columnFunc}>
				{/* <Icon icon={visibleColumns.find(c => c.column === columnName).visible ? 'visibility' : 'visibility_off'} activeColor={'#FFFFFF'} active={visibleColumns.find(c => c.column === columnName).visible ? true : false} /> */}
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

	renderVisibleSortOption = (sortOpen, sortDirection) => {

		return <DropDownContainer onMouseLeave={this.handleSortOpen(false)}>
			<DropDownButton onMouseEnter={this.handleSortOpen(true)} >
				<Icon icon={'visibility'} color={'#FFF'} iconSize={20} style={{ margin: 3 }} />
			</DropDownButton>
			<Margin />

			{sortOpen && <DropDown style={{ width: 150 }}>
				{this.renderDropDownSorting(sortDirection)}
				{this.renderDropDownItem('Gennemfort i %', 'visibility', this.handleVisibleColumn('progress'), 'progress')}
				{this.renderDropDownItem('Oprettet', 'visibility', this.handleVisibleColumn('open_date'), 'open_date')}
				{this.renderDropDownItem('Senest aktiv', 'visibility', this.handleVisibleColumn('seneste_reg'), 'seneste_reg')}
				{/* {this.renderDropDownItem('Kontakt', 'visibility', this.handleVisibleColumn('user'), 'user')} */}
				{this.renderDropDownItem('Antal', 'visibility', this.handleVisibleColumn('hits'), 'hits')}
			</DropDown>
			}
		</DropDownContainer>
	}

	renderChangeViewOptions = (view) => {
		return <ChangeViewButtonContainer>
			<ChangeViewButtonCard view={view} onClick={this.changeView(0)}>
				<Icon iconSize={25} icon={'view_module'} activeColor={'#FFFFFF'} active={view === 0 ? true : false} />
			</ChangeViewButtonCard>
			<ChangeViewButtonList view={view} onClick={this.changeView(1)}>
				<Icon iconSize={25} icon={'list'} activeColor={'#FFFFFF'} active={view === 1 ? true : false} />
			</ChangeViewButtonList>
			<ChangeViewButtonMap view={view} onClick={this.changeView(2)}>
				<Icon iconSize={25} icon={'location'} activeColor={'#FFFFFF'} active={view === 2 ? true : false} />
			</ChangeViewButtonMap>
		</ChangeViewButtonContainer>
	}

	//#endregion
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
					onCheckedItems={this.onCheckedItems}
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

	render() {
		const { funcOpen, funcNewProject } = this.state
		const { view, searchString, pageSize, pageSizeOpen, sortOpen, sortDirection, sortColumn, dateFilter } = this.state
		return this.state.items ? <View style={{ position: 'relative' }}>
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

				<ExpandedCard
					verticalControls={false}
					horizontalControls={false}
					width={400}
					height={300}
					cardExpand={this.state.deleteOpen}
					handleVerticalExpand={() => e => { e.preventDefault(); this.setState({ deleteOpen: false }) }}>

					<div>
						<div style={{ margin: 10, overflow: 'hidden' }}>Er du sikker på, at du vil slette:
							<ul style={{ height: '250px', width: '350px', overflowY: 'auto' }}>
								{this.projectNames().map(e => {
									return <li style={{ fontWeight: 700 }}> {e} </li>
								})}
							</ul>
						</div>
						<div style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', justifyContent: 'center' }}>
							<Button label={"Ja"} color={this.props.theme.button.background} onClick={this.deleteProjects()} />
							<Button label={"Nej"} color={"crimson"} onClick={e => { e.preventDefault(); this.setState({ deleteOpen: false }) }} />
						</div>
					</div>
				</ExpandedCard>
			</FunctionBar>
			{this.renderView(pageSize, view, sortColumn, sortDirection)}
			{view !== 2 ? <Pagination items={this.filterItems(this.state.items)} onChangePage={this.handlePageChange} pageSize={pageSize} /> : null}

		</View > : null

	}
}

export default withTheme(ViewContainer)