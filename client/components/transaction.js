import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {fetchTransactions} from '../store/transaction'
import CircularIndeterminate from './progress'

class Transaction extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.loadTransactions(this.props.user.id)
  }

  render() {
    if (this.props.isFetching) {
      return <CircularIndeterminate />
    }
    const transactions = this.props.transactions
    return transactions.length === 0 ? (
      <div>No transactions!</div>
    ) : (
      <div>
        <ul>
          {transactions.map(transaction => (
            <li key={transaction.id}>{transaction.ticker}</li>
          ))}
        </ul>
      </div>
    )
  }
}

const mapState = state => {
  return {
    user: state.user,
    transactions: state.transactions.all,
    isFetching: state.transactions.isFetching
  }
}

const mapDispatch = dispatch => {
  return {
    loadTransactions(userId) {
      dispatch(fetchTransactions(userId))
    }
  }
}

const withStyleTransaction = Transaction
export default connect(mapState, mapDispatch)(withStyleTransaction)

Transaction.propTypes = {}
