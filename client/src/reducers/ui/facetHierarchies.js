import Immutable from 'seamless-immutable'
import _ from 'lodash'
import { LOCATION_CHANGE } from 'react-router-redux'
import { CLEAR_FACETS } from '../../actions/SearchRequestActions'
import { SET_HIERARCHY_PATH } from '../../actions/FlowActions'

const initialState = Immutable({
  science: [],
  locations: []
})

const facetHierarchies = (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return Immutable.replace(state, initialState)

    case CLEAR_FACETS:
      return Immutable.replace(state, initialState)

    case SET_HIERARCHY_PATH:
      return Immutable.set(state, action.category, changePath(action.term))

    default:
      return state
  }
}

const changePath = (term) => {
  const newPath = _.replace(term, / > /g, '*children*').split('*') // Splitting around space char will split some terms erroneously
  newPath.push('children')
  return newPath
}

export default facetHierarchies