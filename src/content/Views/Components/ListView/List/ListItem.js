import React, { PureComponent } from 'react'
import { ListItemContainer, ExpandButtonContainer, Text, ListCardItem, Button, ButtonContainer, ControlsContainer, Cell, SmallLoaderContainer, ImgText } from './ListStyles'
import { Icon } from 'odeum-ui'
import Checkbox from '../../../../Aux/CheckBox/CheckBox'
import ExpandedCardInfo from '../../CardView/Card/ExpandedCardInfo'
import { LoaderSmall } from 'LoginStyles'
import { getUserInfo } from 'utils/data'



export default class ListItem extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			expand: false,
			cardExpand: false,
			img: true
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
	getUser = async (id) => {
		return getUserInfo(id).then(rs => rs)
	}
	renderCell = (item, c) => {
		if (item[c.column] instanceof Date) {
			return <Text title={item[c.column].toLocaleDateString()}>
				{item[c.column].toLocaleDateString()}
			</Text>
		}
		else {
			if (c.column === 'img') {
				const { img } = this.state
				return <ImgText>
					{img ?
						<SmallLoaderContainer>
							<LoaderSmall style={{ width: 15, height: 15 }} />
						</SmallLoaderContainer> : null}
					<img src={item[c.column]} height={30} width={'100%'} alt={'Projekt Img'} onLoad={() => this.setState({ img: false })} />
				</ImgText>
			}
			else {
				if (c.column === 'user') {
					return item[c.column] ?
						<React.Fragment>
							<img src={'https://d30y9cdsu7xlg0.cloudfront.net/png/17241-200.png'} alt={'profilepic'} style={{ height: '26px', borderRadius: 20, marginRight: 4 }} />
							<Text title={item[c.column].vcFirstName + ' ' + item[c.column].vcLastName}>
								{item[c.column].vcFirstName + ' ' + item[c.column].vcLastName}
							</Text>
						</React.Fragment> : null

				}
				else {
					return <Text title={item[c.column].toString()}>{item[c.column].toString()}</Text>
				}
			}
		}

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
									this.renderCell(item, c)
									// item[c.column] instanceof Date ?
									// 	<Text title={item[c.column]/* .toLocaleDateString() */}>
									// 		{item[c.column]/* .toLocaleDateString() */}
									// 	</Text>
									// 	/*: c.column === 'user' ? <React.Fragment>
									// 		<img src={item[c.column].img} alt={'profilepic'} style={{ height: '26px', borderRadius: 20, marginRight: 4 }} />
									// 		<Text title={item[c.column].name}>
									// 			{item[c.column].name}
									// 		</Text>
									// 	</React.Fragment> */ :
									// 	c.column === 'img' ?
									// 		<ImgText>
									// 			{this.state.img ?
									// 				<SmallLoaderContainer>
									// 					<LoaderSmall style={{ width: 15, height: 15 }} />
									// 				</SmallLoaderContainer> : null}
									// 			<img src={item[c.column]} height={30} width={'100%'} alt={'Projekt Img'} onLoad={() => this.setState({ img: false })} />
									// 		</ImgText>
									// 		:

									// 		<Text title={item[c.column].toString()}>{item[c.column].toString()}</Text>
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
					<ExpandedCardInfo expand={cardExpand} {...this.props} handleOverlay={this.closeCard} />
				</ListCardItem>
			</React.Fragment>
		)
	}
}
