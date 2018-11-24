import React, {Component} from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'

class BuyForm extends Component {
  handleChange = evt => {
    this.props.handleChange(evt.target.name, evt.target.value)
  }

  render() {
    return (
      <React.Fragment>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <TextField
              required
              id="ticker"
              name="ticker"
              label="Ticker"
              fullWidth
              autoComplete="ticker"
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="share"
              name="quantity"
              label="Quantity"
              fullWidth
              autoComplete="quantity"
              onChange={this.handleChange}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

export default BuyForm
