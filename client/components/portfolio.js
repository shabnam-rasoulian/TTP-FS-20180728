import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import axios from 'axios'
import {fetchPortfolio, fetchPortfolios, me, sellTransaction} from '../store'
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
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'

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
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      selectedQuantity: 0
    }
    this.intervalSet = null
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSend = this.handleSend.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.loadPortfolios(this.props.user.id)
    this.intervalSet = setInterval(() => {
      this.props.loadPortfolios(this.props.user.id)
    }, 10000)
  }

  componentWillUnmount() {
    if (this.intervalSet) {
      clearInterval(this.intervalSet)
    }
  }

  handleChange(evt) {
    this.setState({selectedQuantity: Number(evt.target.value)})
  }

  handleClickOpen(ticker) {
    this.props.loadPortfolio(this.props.user.id, ticker)
    this.setState({open: true})
  }

  handleCancel() {
    this.setState({open: false})
  }

  async handleSend() {
    this.setState({open: false})
    try {
      const res = await axios.get(
        `https://api.iextrading.com/1.0/stock/market/batch?symbols=${
          this.props.selected.ticker
        }&types=price&range=1m&last=1`
      )
      const price = res.data[this.props.selected.ticker].price
      this.props.sell(
        this.props.user.id,
        this.props.selected.ticker,
        this.state.selectedQuantity,
        price
      )
      this.setState({selectedQuantity: 0})
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const {classes, isFetching, portfolios, user, selected} = this.props
    if (isFetching) {
      return <CircularIndeterminate />
    }
    return portfolios.length === 0 ? (
      <React.Fragment>
        <CssBaseline />
        <Typography component="h6" variant="h6" className={classes.root}>
          You have no portfolio!
        </Typography>
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
              Portfolio: ${(
                user.balance +
                portfolios.reduce(
                  (acc, portfolio) =>
                    acc + portfolio.quantity * portfolio.price,
                  0
                )
              ).toFixed(2)}
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
                  <TableCell>{}</TableCell>
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
                      <TableCell>
                        <Button
                          size="small"
                          color="secondary"
                          variant="outlined"
                          onClick={() => this.handleClickOpen(portfolio.ticker)}
                        >
                          Sell
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <Dialog open={this.state.open} aria-labelledby="form-dialog-title">
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Number of shares"
                  fullWidth
                  onChange={this.handleChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleCancel} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={this.handleSend}
                  color="primary"
                  disabled={
                    this.state.selectedQuantity > selected.quantity ||
                    this.state.selectedQuantity === 0
                  }
                >
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
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
    isFetching: state.portfolios.isFetching,
    selected: state.portfolios.selected
  }
}

const mapDispatch = dispatch => {
  return {
    loadPortfolios(userId) {
      dispatch(fetchPortfolios(userId))
      dispatch(me())
    },
    loadPortfolio(userId, ticker) {
      dispatch(fetchPortfolio(userId, ticker))
    },
    sell(userId, ticker, quantity, price) {
      dispatch(sellTransaction(userId, ticker, quantity, price)).then(() => {
        dispatch(me())
        dispatch(fetchPortfolios(userId))
      })
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
