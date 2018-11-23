import axios from 'axios'

const GET_PORTFOLIOS = 'GET_PORTFOLIO'

const initialState = {all: [], isFetching: true}

const getPortfolios = portfolios => ({type: GET_PORTFOLIOS, portfolios})

export const fetchPortfolios = id => async dispatch => {
  try {
    const {data: portfolios} = await axios.get(`/api/portfolios/${id}`)
    console.log(portfolios)
    dispatch(getPortfolios(portfolios))
  } catch (err) {
    console.log(err)
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PORTFOLIOS:
      return {isFetching: false, all: action.portfolios}
    default:
      return state
  }
}
