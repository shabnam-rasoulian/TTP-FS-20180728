import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const styles = theme => ({
  listItem: {
    padding: `${theme.spacing.unit}px 0`
  },
  total: {
    fontWeight: '700'
  },
  title: {
    marginTop: theme.spacing.unit * 2
  }
})

function Review(props) {
  const {classes, balance, price, ticker, quantity} = props
  console.log('Price is ', price)
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Confirm
      </Typography>
      <List disablePadding>
        <ListItem className={classes.listItem}>
          <ListItemText primary="Ticker" />
          <Typography variant="subtitle1" className={classes.total}>
            {ticker}
          </Typography>
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemText primary="Shares" />
          <Typography variant="subtitle1" className={classes.total}>
            {quantity}
          </Typography>
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemText primary="Total cost" />
          <Typography variant="body2" align="right">
            ${(quantity * price).toFixed(2)}
            <Typography variant="caption">
              ({quantity}
              {` `} x {` `}
              ${price.toFixed(2)})
            </Typography>
          </Typography>
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemText primary="Available fund" />
          <Typography variant="body2" align="right">
            ${(balance - quantity * price).toFixed(2)}
            <Typography variant="caption">
              (${balance}
              {` `} - {` `}
              ${(quantity * price).toFixed(2)})
            </Typography>
          </Typography>
        </ListItem>
      </List>
    </React.Fragment>
  )
}

Review.propTypes = {
  classes: PropTypes.object.isRequired,
  ticker: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired
}

const mapState = state => {
  return {
    balance: state.user.balance
  }
}

export default connect(mapState, null)(withStyles(styles)(Review))
