import React, {Component} from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Paper from '@material-ui/core/Paper'
import Stepper from '@material-ui/core/Stepper'
import Chip from '@material-ui/core/Chip'
import DoneIcon from '@material-ui/icons/Done'
import {connect} from 'react-redux'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import BuyForm from './buy-form'
import BalanceCheck from './balance-check'
import Review from './review'
import {buyTransaction} from '../store'

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 600,
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
  stepper: {
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit
  }
})

const steps = ['Order', 'Balance details', 'Confirm your order']

class Buy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeStep: 0,
      ticker: '',
      quantity: 0,
      price: 0,
      checkErr: false
    }
    this.handleNext = this.handleNext.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.setPrice = this.setPrice.bind(this)
    this.balanceCheck = this.balanceCheck.bind(this)
    this.retry = this.retry.bind(this)
    this.gotoPortfolio = this.gotoPortfolio.bind(this)
  }

  handleChange(name, value) {
    this.setState({[name]: value})
  }

  handleNext() {
    if (this.state.activeStep === 2) {
      this.props.buy(
        this.props.user.id,
        this.state.ticker,
        this.state.quantity,
        this.state.price
      )
    }
    this.setState(state => ({
      activeStep: state.activeStep + 1
    }))
  }

  handleBack() {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }))
  }

  handleReset() {
    this.setState({
      activeStep: 0
    })
  }

  setPrice(price) {
    this.setState({price})
  }

  balanceCheck(checkErr) {
    this.setState({checkErr})
  }

  retry() {
    this.setState({activeStep: 0})
  }
  gotoPortfolio() {
    this.props.history.push('/portfolio')
  }

  getStepContent(step) {
    switch (step) {
      case 0:
        return <BuyForm handleChange={this.handleChange} />
      case 1:
        return (
          <BalanceCheck
            ticker={this.state.ticker}
            quantity={this.state.quantity}
            getPrice={this.setPrice}
            onFetch={this.balanceCheck}
          />
        )
      case 2:
        return (
          <Review
            ticker={this.state.ticker}
            quantity={this.state.quantity}
            price={this.state.price}
          />
        )
      default:
        throw new Error('Unknown step')
    }
  }

  render() {
    const {classes} = this.props
    const {activeStep} = this.state

    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
              Buy
            </Typography>
            <Stepper activeStep={activeStep} className={classes.stepper}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <React.Fragment>
              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography variant="h5" gutterBottom align="center">
                    {this.props.error === null ? (
                      <Chip
                        label="Order confirmed!"
                        clickable
                        className={classes.chip}
                        color="primary"
                        onDelete={this.gotoPortfolio}
                        deleteIcon={<DoneIcon />}
                        variant="outlined"
                      />
                    ) : (
                      <Chip
                        label="Cannot confirm order. Please try again."
                        onDelete={this.retry}
                        className={classes.chip}
                        color="secondary"
                        variant="outlined"
                      />
                    )}
                  </Typography>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {this.getStepContent(activeStep)}
                  <div className={classes.buttons}>
                    {activeStep !== 0 && (
                      <Button
                        onClick={this.handleBack}
                        className={classes.button}
                      >
                        Back
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleNext}
                      className={classes.button}
                      disabled={activeStep === 1 && !this.state.checkErr}
                    >
                      {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                    </Button>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          </Paper>
        </main>
      </React.Fragment>
    )
  }
}

Buy.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapState = state => {
  return {
    user: state.user,
    error: state.transactions.error
  }
}
const mapDispatch = dispatch => ({
  buy: (userId, ticker, quantity, price) => {
    dispatch(buyTransaction(userId, ticker.toUpperCase(), quantity, price))
  }
})

export default connect(mapState, mapDispatch)(withStyles(styles)(Buy))
