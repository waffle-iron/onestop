import { connect } from 'react-redux'
import FacetList from './FacetListComponent'
import { triggerSearch } from '../../actions/SearchRequestActions'
import { toggleFacet } from '../../actions/SearchParamActions'
import { showCollections, setHierarchyPath } from '../../actions/FlowActions'

const mapStateToProps = (state) => {
  return {
    facetMap: state.domain.results.facets,
    selectedFacets: state.behavior.search.selectedFacets,
    science: state.ui.facetHierarchies.science,
    locations: state.ui.facetHierarchies.locations
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleFacet: (category, facetName, selected) =>
      dispatch(toggleFacet(category, facetName, selected)),
    submit: () => {
      dispatch(triggerSearch())
      dispatch(showCollections())
    },
    changePath: (category, path) =>
      dispatch(setHierarchyPath(category, path))
  }
}

const FacetContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FacetList)

export default FacetContainer
