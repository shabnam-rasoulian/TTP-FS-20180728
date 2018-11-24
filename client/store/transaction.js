import axios from 'axios'

const GET_TRANSACTIONS = 'GET_TRANSACTIONS'
const DONE_TRANSACTION = 'DONE_TRANSACTION'

const initialState = {
  all: [],
  isFetching: true
}

const getTransactions = transactions => ({type: GET_TRANSACTIONS, transactions})
const doneTransaction = transaction => ({
  type: DONE_TRANSACTION,
  transaction
})

export const fetchTransactions = id => async dispatch => {
  try {
    const {data: transactions} = await axios.get(`/api/transactions/${id}`)
    dispatch(getTransactions(transactions))
  } catch (err) {
    console.log(err)
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
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TRANSACTIONS:
      return {...state, isFetching: false, all: action.transactions}
    case DONE_TRANSACTION:
      return {...state, all: [...state.all, action.transaction]}
    default:
      return state
  }
}
