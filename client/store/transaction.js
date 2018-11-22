import axios from 'axios'

const GET_TRANSACTIONS = 'GET_TRANSACTIONS'

const initialState = {all: [], isFetching: true}

const getTransactions = transactions => ({type: GET_TRANSACTIONS, transactions})

export const fetchTransactions = id => async dispatch => {
  try {
    const {data: transactions} = await axios.get(`/api/transactions/${id}`)
    dispatch(getTransactions(transactions))
  } catch (err) {
    console.log(err)
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TRANSACTIONS:
      return {isFetching: false, all: action.transactions}
    default:
      return state
  }
}
