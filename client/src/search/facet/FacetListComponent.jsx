import React from 'react'
import Immutable from 'seamless-immutable'
import styles from './facet.css'
import _ from 'lodash'
import Collapse, { Panel } from 'rc-collapse'

class FacetList extends React.Component {
  constructor(props) {
    super(props)
    this.updateStoreAndSubmitSearch = this.updateStoreAndSubmitSearch.bind(this)
    this.facetMap = props.facetMap
    this.populateFacetComponent = this.populateFacetComponent.bind(this)
    this.generateFacetHierarchy = this.generateFacetHierarchy.bind(this)
    this.populateFacetSubPanel = this.populateFacetSubPanel.bind(this)
    this.selectedFacets = props.selectedFacets
    this.toggleFacet = props.toggleFacet
    this.submit = props.submit
    this.state = this.getDefaultState()
  }

  getDefaultState() {
    return {
      terms : {
        "science": "Data Theme"
      }
    }
  }

  componentWillUpdate(nextProps) {
    this.facetMap = nextProps.facetMap
    this.selectedFacets = nextProps.selectedFacets
  }

  updateStoreAndSubmitSearch(e) {
    const {name, value} = e.target.dataset
    const selected = e.target.checked

    this.toggleFacet(name, value, selected)
    this.submit()
  }

  isSelected(category, facet) {
    return this.selectedFacets[category]
    && this.selectedFacets[category].includes(facet)
    || false
  }

  generateFacetHierarchy(subCategories){
    const facetCatArray = str => str.split('>').map(x => x.trim())
    var facetHierarchy = {}
    _.forEach(subCategories, (v, k) => {
      var countAndPath = Object.assign({}, v, {path: k})
      _.merge(facetHierarchy, _.set({}, facetCatArray(k), countAndPath))
    })
    return facetHierarchy
  }

  getFacetToggle(category, subCategory, subCategories){
    const subFacetLabel = str => str.split('>').pop().trim()
    const inputElement = {
      className: styles.checkFacet,
      'data-name': category,
      'data-value': subCategory,
      id: `${category}-${subCategory}`,
      type: 'checkbox',
      onChange: this.updateStoreAndSubmitSearch,
      checked: this.isSelected(category, subCategory)
    }
    return <div key={`${category}-${subCategory}`}>
      <input {...inputElement}/>
      <span className={styles.facetLabel}>{subFacetLabel(`${subCategory}`)}</span>
      <div>{`(${subCategories[subCategory].count})`}</div>
    </div>
  }


  populateFacetComponent() {
    const self = this
    const toTitleCase = str => _.startCase(_.toLower((str.split(/(?=[A-Z])/).join(" "))))
    let facets = []
    _.forOwn(this.facetMap, (terms,category) => {
      if (!_.isEmpty(terms)) { // Don't load categories that have no results
        console.log(this.generateFacetHierarchy(terms))
        facets.push(
        	<li className={'has-children'} key={`${category}`}>
        		<input type="checkbox" name={`expand-${category}`} id={`${category}`} />
        		<label htmlFor={`${category}`}>{`${this.state.terms[category.toLowerCase()] ||
            toTitleCase(category)}`}</label>
            <ul>
              {self.populateFacetSubPanel(category, terms, this.generateFacetHierarchy(terms))}
            </ul>
          </li>
        )
      }
    })
    return facets
  }

  populateFacetSubPanel(category, subCategories, facetHierarchy) {
    var self = this
    let list = []
    const omittedValues = ['count', 'path']
    _.forOwn(_.omit(facetHierarchy, omittedValues), (v, k) => {
      const { path }  = facetHierarchy[k]
      if (_.keys(_.omit(v, omittedValues)).length) {
  			list.push( <li className={'has-children'}>
  				<input type="checkbox" name={`expand-${k}`} id={k}/>
  				<label htmlFor={k}>{self.getFacetToggle(category, path, subCategories)}</label>
          <ul>{self.populateFacetSubPanel(category, subCategories, v)}</ul>
  			</li>)
      } else {
        list.push(<li><a href="#0">{self.getFacetToggle(category, path, subCategories)}</a></li>)
      }
    })
    return list
  }

  render() {
    return <ul className={`${styles['cd-accordion-menu']}`}>
      {this.populateFacetComponent()}
    </ul>

  }

}
export default FacetList
