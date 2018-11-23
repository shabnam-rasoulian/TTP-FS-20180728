import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {fetchPortfolios} from '../store'
import CircularIndeterminate from './progress'
import {withStyles} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

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

class Portfolio extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.loadPortfolios(this.props.user.id)
  }

  render() {
    const {classes, isFetching, portfolios} = this.props
    if (isFetching) {
      return <CircularIndeterminate />
    }
    return portfolios.length === 0 ? (
      <div>No portfolio!</div>
    ) : (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Ticker</TableCell>
              <TableCell numeric>Quantity</TableCell>
              <TableCell numeric>Total($)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {portfolios.map(portfolio => {
              return (
                <TableRow key={portfolio.id}>
                  <TableCell component="th" scope="row">
                    {portfolio.ticker}
                  </TableCell>
                  <TableCell numeric>{portfolio.quantity}</TableCell>
                  <TableCell numeric>{portfolio.quantity}</TableCell>
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
    portfolios: state.portfolios.all,
    isFetching: state.portfolios.isFetching
  }
}

const mapDispatch = dispatch => {
  return {
    loadPortfolios(userId) {
      dispatch(fetchPortfolios(userId))
    }
  }
}

const withStylePortfolio = withStyles(styles)(Portfolio)
export default connect(mapState, mapDispatch)(withStylePortfolio)

Portfolio.propTypes = {
  user: PropTypes.object.isRequired,
  portfolios: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired
}
