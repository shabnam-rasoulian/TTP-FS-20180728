import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import Typography from '@material-ui/core/Typography'

class BalanceCheck extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFetching: true,
      price: 0,
      tickerError: false
    }
  }

  componentDidMount() {
    if (this.props.quantity % 1 > 0) {
      this.props.onFetch(false)
      return
    }
    const ticker = this.props.ticker.toUpperCase()
    axios
      .get(
        `https://api.iextrading.com/1.0/stock/market/batch?symbols=${ticker}&types=price&range=1m&last=1`
      )
      .then(res => {
        const price = res.data[ticker].price
        this.props.getPrice(price)
        const cost = price * this.props.quantity
        const balance = this.props.balance - cost
        this.props.onFetch(balance >= 0)
        this.setState({price: price, isFetching: false})
      })
      .catch(err => {
        if (err.message === "Cannot read property 'price' of undefined") {
          this.props.onFetch(false)
          this.setState({tickerError: true, isFetching: false})
        }
        console.log(err)
      })
  }

  render() {
    if (this.props.quantity % 1 > 0) {
      return (
        <Typography component="h6" variant="h6">
          Cannot trade fraction of shares!
        </Typography>
      )
    }
    if (this.state.isFetching) {
      return (
        <Typography component="h6" variant="h6">
          Fetching the price!
        </Typography>
      )
    }
    if (this.state.tickerError) {
      return (
        <Typography component="h6" variant="h6">
          Ticker is not available!
        </Typography>
      )
    }

    const cost = this.state.price * this.props.quantity
    const balance = this.props.balance - cost
    return balance < 0 ? (
      <Typography component="h6" variant="h6">
        Sorry! Not have enough fund available for this transaction!
      </Typography>
    ) : (
      <Typography>
        <Typography
          component="h6"
          variant="h6"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Total Cost: ${cost.toFixed(2)}
        </Typography>
        <Typography
          component="subtitle1"
          variant="subtitle1"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Your new balance would be ${balance.toFixed(2)}
        </Typography>
      </Typography>
    )
  }
}

const mapState = state => {
  return {
    balance: state.user.balance
  }
}

export default connect(mapState)(BalanceCheck)
