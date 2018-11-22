import React, {Component} from 'react'
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
    return this.props.isFetching ? (
      <CircularIndeterminate />
    ) : (
      <div>
        <ul>
          {this.props.transactions.map(transaction => (
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
