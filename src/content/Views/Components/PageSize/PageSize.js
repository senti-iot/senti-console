import React from 'react'
import { DropDown, DropDownButton, DropDownContainer, Margin, DropDownItem } from '../DropDown/DropDown'
import { Icon } from 'odeum-ui'


const listPageSizes = [10, 25, 50, 75, 100]
const cardPageSizes = [10, 25, 50, 75, 100]

const renderPageSizes = (view, pageSize, handlePageSize) => {
	switch (view) {
		case 0:
			return cardPageSizes.map(o =>
				<DropDownItem style={{ minWidth: '45px' }} key={o} active={o === pageSize ? true : false} onClick={handlePageSize(o)}>{o}</DropDownItem>)
		case 1:
			return listPageSizes.map(o =>
				<DropDownItem style={{ minWidth: '45px' }} key={o} active={o === pageSize ? true : false} onClick={handlePageSize(o)}>
					{o}
				</DropDownItem>)
		default:
			return null
	}
}

export const renderPageSizeOption = (view, pageSize, pageSizeOpen, handlePageSizeOpen, handlePageSize) => {
	return <DropDownContainer onMouseLeave={handlePageSizeOpen(false)}>
		<DropDownButton onMouseEnter={handlePageSizeOpen(true)}>
			<Icon icon={'filter_list'} iconSize={25} color={'#fff'} />{pageSize}{/*  per side */}
		</DropDownButton>
		<Margin />
		<DropDown style={{ width: '100%' }}>
			{pageSizeOpen && renderPageSizes(view, pageSize, handlePageSize)}
		</DropDown>
	</DropDownContainer>
}


