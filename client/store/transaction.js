import axios from 'axios'

const GET_TRANSACTIONS = 'GET_TRANSACTIONS'
const DONE_TRANSACTION = 'DONE_TRANSACTION'
const ERROR_TRANSACTION = 'ERROR_TRANSACTION'

const initialState = {
  all: [],
  isFetching: true,
  error: null
}

const getTransactions = transactions => ({type: GET_TRANSACTIONS, transactions})
const doneTransaction = transaction => ({
  type: DONE_TRANSACTION,
  transaction
})
const errTransaction = err => ({
  type: ERROR_TRANSACTION,
  err
})

export const fetchTransactions = id => async dispatch => {
  try {
    const {data: transaction} = await axios.get(`/api/transactions/${id}`)
    dispatch(getTransactions(transaction))
  } catch (err) {
    console.log(err)
    dispatch(errTransaction(err))
  }
}

export const buyTransaction = (
  userId,
  ticker,
  quantity,
  price
) => async dispatch => {
  try {
    const {data: transaction} = await axios.post(
      `/api/transactions/${userId}/buy`,
      {
        ticker,
        quantity,
        price
      }
    )
    dispatch(doneTransaction(transaction))
  } catch (err) {
    console.log(err)
    dispatch(errTransaction(err))
  }
}

export const sellTransaction = (
  userId,
  ticker,
  quantity,
  price
) => async dispatch => {
  try {
    console.log('sellTransaction')
    const {data: transaction} = await axios.post(
      `/api/transactions/${userId}/sell`,
      {
        ticker,
        quantity,
        price
      }
    )
    console.log('sellTransaction')
    dispatch(doneTransaction(transaction))
    console.log('sellTransaction')
  } catch (err) {
    console.log(err)
    dispatch(errTransaction(err))
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TRANSACTIONS:
      return {
        ...state,
        isFetching: false,
        all: action.transactions,
        error: null
      }
    case DONE_TRANSACTION:
      console.log('done transaction')
      return {...state, all: [...state.all, action.transaction], error: null}
    case ERROR_TRANSACTION:
      return {...state, error: action.err}
    default:
      return state
  }
}
