import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {fetchTransactions} from '../store'
import CircularIndeterminate from './progress'
import {withStyles} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = {
  root: {
    width: '50%',
    overflowX: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  table: {
    minWidth: 700
  }
}

class Transaction extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.loadTransactions(this.props.user.id)
  }

  render() {
    const {classes, isFetching, transactions} = this.props
    if (isFetching) {
      return <CircularIndeterminate />
    }
    return transactions.length === 0 ? (
      <Typography className={classes.root}>No portfolio!</Typography>
    ) : (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Ticker</TableCell>
              <TableCell numeric>Quantity</TableCell>
              <TableCell numeric>Price($)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map(transaction => {
              return (
                <TableRow key={transaction.id}>
                  <TableCell component="th" scope="row">
                    {transaction.tradeType}
                  </TableCell>
                  <TableCell>{transaction.ticker}</TableCell>
                  <TableCell numeric>{transaction.quantity}</TableCell>
                  <TableCell numeric>{transaction.price}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Paper>
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

const withStyleTransaction = withStyles(styles)(Transaction)
export default connect(mapState, mapDispatch)(withStyleTransaction)

Transaction.propTypes = {
  user: PropTypes.object.isRequired,
  transactions: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  loadTransactions: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}
