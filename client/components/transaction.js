import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {fetchTransactions} from '../store'
import CircularIndeterminate from './progress'
import {withStyles} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(1000 + theme.spacing.unit * 2 * 2)]: {
      width: 1000,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3
    }
  },
  table: {
    minWidth: 700
  }
})

class Transaction extends Component {
  componentDidMount() {
    this.props.loadTransactions(this.props.user.id)
  }

  render() {
    const {classes, isFetching, transactions} = this.props
    if (isFetching) {
      return <CircularIndeterminate />
    }
    return transactions.length === 0 ? (
      <React.Fragment>
        <CssBaseline />
        <Typography component="h6" variant="h6" className={classes.root}>
          You have no transactions yet!
        </Typography>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <CssBaseline />
        <Typography className={classes.root}>
          <Paper className={classes.paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Ticker</TableCell>
                  <TableCell numeric>Quantity</TableCell>
                  <TableCell numeric>Price($)</TableCell>
                  <TableCell>Date</TableCell>
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
                      <TableCell>
                        {new Date(transaction.createdAt).toDateString()}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Paper>
        </Typography>
      </React.Fragment>
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
