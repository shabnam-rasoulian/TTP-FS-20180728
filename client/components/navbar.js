import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {logout} from '../store'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import {withStyles} from '@material-ui/core/styles'
import {withRouter} from 'react-router'
import {Link} from 'react-router-dom'

const styles = theme => ({
  root: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  header: {
    textTransform: 'capitalize',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent'
    },
    fontFamily: 'Lobster',
    fontSize: '28pt'
  },
  toolbarMain: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`
  },
  toolbarTitle: {
    flex: 1
  }
})

const Navbar = ({classes, handleClick, isLoggedIn}) => (
  <div className={classes.root}>
    <Toolbar className={classes.toolbarMain}>
      {isLoggedIn ? (
        <div>
          <Button variant="outlined" size="small" onClick={handleClick}>
            Logout
          </Button>
        </div>
      ) : (
        <div>
          <Button variant="outlined" size="small" href="/signup">
            Sign up
          </Button>
          <Button size="small" href="/login">
            Login
          </Button>
        </div>
      )}
      <Typography
        variant="headline"
        color="inherit"
        align="center"
        noWrap
        className={classes.toolbarTitle}
      >
        <Button
          size="large"
          href="/"
          disableFocusRipple
          disableRipple
          className={classes.header}
        >
          Vestguard
        </Button>
      </Typography>
    </Toolbar>
    {isLoggedIn && (
      <Toolbar variant="dense" className={classes.toolbarSecondary}>
        <Typography color="inherit" noWrap>
          <Button
            size="small"
            disableFocusRipple
            disableRipple
            className={classes.menu}
          >
            <Link to="/transactions">Transactions</Link>
          </Button>
        </Typography>
        <Typography color="inherit" noWrap>
          <Button
            size="small"
            disableFocusRipple
            disableRipple
            className={classes.menu}
          >
            <Link to="/portfolio">Portfolio</Link>
          </Button>
        </Typography>
      </Toolbar>
    )}
  </div>
)

const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

const withStyleNavbar = withStyles(styles)(withRouter(Navbar))
export default connect(mapState, mapDispatch)(withStyleNavbar)

Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired
}
