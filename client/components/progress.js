import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = theme => ({
  progress: {
    marginTop: theme.spacing.unit * 40,
    marginLeft: theme.spacing.unit * 110
  }
})

function CircularIndeterminate(props) {
  const {classes} = props
  return (
    <div>
      <CircularProgress
        className={classes.progress}
        size={200}
        color="primary"
        thickness={2}
      />
    </div>
  )
}

CircularIndeterminate.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(CircularIndeterminate)
