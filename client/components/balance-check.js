import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'

class BalanceCheck extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFetching: true,
      price: 0
    }
  }

  componentDidMount() {
    axios
      .get(
        `https://api.iextrading.com/1.0/stock/market/batch?symbols=${
          this.props.ticker
        }&types=price&range=1m&last=1`
      )
      .then(res => {
        const price = res.data[this.props.ticker].price
        const cost = price * this.props.shares
        const balance = this.props.balance - cost
        this.props.onFetch(balance >= 0)
        this.setState({price: price, isFetching: false})
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    if (this.state.isFetching) {
      return <div>Fetching the price!</div>
    }
    const cost = this.state.price * this.props.shares
    const balance = this.props.balance - cost
    return balance < 0 ? (
      <div>Not enough fund!</div>
    ) : (
      <div>
        This order will cost you ${cost} and your new balance is ${balance}.
        Click next to confirm your order or click back to change it.
      </div>
    )
  }
}

const mapState = state => {
  return {
    balance: state.user.balance
  }
}

export default connect(mapState)(BalanceCheck)
