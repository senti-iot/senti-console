import React, { PureComponent } from 'react'
import { ListItemContainer, ExpandButtonContainer, Text, ListCardItem, Button, ButtonContainer, ControlsContainer, Cell } from './ListStyles'
import { Icon } from 'odeum-ui'
import Checkbox from '../../../Aux/CheckBox/CheckBox'
import ExpandedCardInfo from '../../CardView/Card/ExpandedCardInfo'

export default class ListItem extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			expand: false,
			cardExpand: false
		}
	}
	closeCard = () => {
		this.setState({ cardExpand: false, expand: false })
		if (this.props.handleActiveListDrawer)
			this.props.handleActiveListDrawer(this.props.item.id, false)
	}
	openCard = () => {
		// e.preventDefault()
		this.setState({ cardExpand: true, expand: false })
		if (this.props.handleActiveListDrawer)
			this.props.handleActiveListDrawer(this.props.item.id, false)
	}
	onExpand = () => {
		this.setState({ expand: !this.state.expand })
		this.props.handleActiveListDrawer(this.props.item.id, !this.isOpen())
	}

	handleCheckedItem = (isChecked) => {
		this.props.handleCheckedItem(this.props.item.id, isChecked)
	}
	isOpen = () => {
		return this.props.drawer.id === this.props.item.id ? this.props.drawer.isOpen : false
	}

	render() {
		const { cardExpand } = this.state
		const { item, column, columnCount, isChecked } = this.props
		return (
			<React.Fragment>
				<ListCardItem>
					<Checkbox isChecked={isChecked} size={'medium'} onChange={this.handleCheckedItem} />
					<ListItemContainer selected={isChecked} columnCount={columnCount}>
						{column.map((c, cIndex) => {
							return c.visible ? <Cell key={cIndex}>
								{
									item[c.column] instanceof Date ?
										<Text title={item[c.column]/* .toLocaleDateString() */}>
											{item[c.column]/* .toLocaleDateString() */}
										</Text>
										: c.column === 'user' ? <React.Fragment>
											<img src={item[c.column].img} alt={'profilepic'} style={{ height: '26px', borderRadius: 20, marginRight: 4 }} />
											<Text title={item[c.column].name}>
												{item[c.column].name}
											</Text>
										</React.Fragment> :
											c.column === 'img' ? <Text> <img src={item[c.column]} height={30} alt={'Projekt Img'} /></Text>
												:

												<Text title={item[c.column].toString()}>{item[c.column].toString()}</Text>
								}
							</Cell> : null
						})}
					</ListItemContainer>
					<ControlsContainer>
						<ButtonContainer pose={!this.isOpen() ? 'open' : 'close'} /* horizOpen={expand} */ style={{ flexFlow: 'row nowrap', borderRadius: 0, height: 'inherit' }}>
							<Button horizOpen={this.isOpen()} onClick={this.openCard}>
								<Icon color={'#5E5E5E'} icon={'mode_edit'} iconSize={23} />
							</Button>
							<Button horizOpen={this.isOpen()}>
								<Icon color={'#5E5E5E'} icon={'share'} iconSize={23} />
							</Button>
							<Button horizOpen={this.isOpen()}>
								<Icon color={'#5E5E5E'} icon={'library_add'} iconSize={23} />
							</Button>
						</ButtonContainer>
						<ExpandButtonContainer selected={isChecked} onClick={this.onExpand}>
							<Icon icon={'more_vert'} color={'inherit'} activeColor={'#fff'} active={isChecked} iconSize={23} />
						</ExpandButtonContainer>
					</ControlsContainer>
					<ExpandedCardInfo cardExpand={cardExpand} {...this.props} handleVerticalExpand={this.closeCard} />
				</ListCardItem>
			</React.Fragment>
		)
	}
}
