import axios from 'axios'

const GET_PORTFOLIOS = 'GET_PORTFOLIOS'
const GET_PORTFOLIO = 'GET_PORTFOLIO'

const initialState = {all: [], isFetching: true, selected: {}}

const getPortfolios = portfolios => ({type: GET_PORTFOLIOS, portfolios})
const getPortfolio = portfolio => ({type: GET_PORTFOLIO, portfolio})

export const fetchPortfolios = id => async dispatch => {
  try {
    const {data: portfolios} = await axios.get(`/api/portfolios/${id}`)
    if (portfolios.length > 0) {
      const symbols = portfolios.map(portfolio => portfolio.ticker).join(',')
      const {data} = await axios.get(
        `https://api.iextrading.com/1.0/stock/market/batch?symbols=${symbols}&types=quote&range=1m&last=1`
      )
      portfolios.forEach(portfolio => {
        portfolio.price = data[portfolio.ticker].quote.latestPrice
        portfolio.open = data[portfolio.ticker].quote.open
      })
    }
    dispatch(getPortfolios(portfolios))
  } catch (err) {
    console.log(err)
  }
}

export const fetchPortfolio = (id, ticker) => async dispatch => {
  try {
    const {data: portfolio} = await axios.get(`api/portfolios/${id}/${ticker}`)
    dispatch(getPortfolio(portfolio))
  } catch (err) {
    console.log(err)
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PORTFOLIOS:
      return {...state, isFetching: false, all: action.portfolios}
    case GET_PORTFOLIO:
      return {...state, selected: action.portfolio}
    default:
      return state
  }
}
