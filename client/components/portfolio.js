import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {fetchPortfolios} from '../store'
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

class Portfolio extends Component {
  componentDidMount() {
    this.props.loadPortfolios(this.props.user.id)
  }

  render() {
    const {classes, isFetching, portfolios, user} = this.props
    if (isFetching) {
      return <CircularIndeterminate />
    }
    return portfolios.length === 0 ? (
      <React.Fragment>
        <CssBaseline />
        <Typography className={classes.root}>No portfolio!</Typography>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <CssBaseline />
        <Typography className={classes.root}>
          <Paper className={classes.paper}>
            <Typography
              component="h6"
              variant="h6"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Portfolio: ${user.balance +
                portfolios.reduce(
                  (acc, portfolio) =>
                    acc + portfolio.quantity * portfolio.price,
                  0
                )}
            </Typography>
            <Typography
              component="subtitle1"
              variant="subtitle1"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Available funds: ${user.balance}
            </Typography>
          </Paper>
          <Paper className={classes.paper}>
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
                  let color
                  if (portfolio.price === portfolio.open) {
                    color = 'grey'
                  } else if (portfolio.price > portfolio.open) {
                    color = 'green'
                  } else {
                    color = 'red'
                  }
                  return (
                    <TableRow key={portfolio.id}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{color: color}}
                      >
                        {portfolio.ticker}
                      </TableCell>
                      <TableCell numeric>{portfolio.quantity}</TableCell>
                      <TableCell numeric style={{color: color}}>
                        {(portfolio.quantity * portfolio.price).toFixed(2)}
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
