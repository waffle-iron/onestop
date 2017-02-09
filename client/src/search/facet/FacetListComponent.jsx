import React from 'react'
import styles from './facet.css'
import _ from 'lodash'
import Collapse, { Panel } from 'rc-collapse'

class FacetList extends React.Component {
  constructor(props) {
    super(props)
    this.updateStoreAndSubmitSearch = this.updateStoreAndSubmitSearch.bind(this)
    this.facetMap = props.facetMap
    this.selectedFacets = props.selectedFacets
    this.science = props.science
    this.locations = props.locations
    this.toggleFacet = props.toggleFacet
    this.submit = props.submit
    this.changePath = props.changePath
    this.state = this.getDefaultState()
  }

  getDefaultState() {
    return {
      altHeader: {
        "science": "Data Theme"
      },
      allCategoryMap: {}
    }
  }

  componentWillUpdate(nextProps) {
    this.facetMap = nextProps.facetMap
    this.selectedFacets = nextProps.selectedFacets
    this.science = nextProps.science
    this.locations = nextProps.locations
  }

  componentWillReceiveProps(nextProps) {
    if(!_.isEqual(this.facetMap, nextProps.facetMap)) {

      const parsedMap = {}
      _.map(nextProps.facetMap, (terms, category) => {
        if (!_.isEmpty(terms)) { // Don't load categories that have no results
          let categoryMap = {}

          if(category === 'science' || category === 'locations') {
            categoryMap = this.buildHierarchyMap(category, terms)
          }
          else {
            Object.keys(terms).map( term => {
              const name = term.split(' > ')
              categoryMap[name[0]] = {
                count: terms[term].count,
                children: {},
                parent: null,
                term: term
              }
            })
          }

          parsedMap[category] = categoryMap
        }
      })

      this.setState({
        allCategoryMap: parsedMap
      })
    }
  }

  updateStoreAndSubmitSearch(e) {
    const {name, value} = e.target.dataset
    const selected = e.target.checked

    this.toggleFacet(name, value, selected)
    this.submit()
  }

  toTitleCase(str){
    return _.startCase(_.toLower((str.split(/(?=[A-Z])/).join(" "))))
  }

  isSelected(category, facet) {
    return this.selectedFacets[category]
    && this.selectedFacets[category].includes(facet)
    || false
  }

  buildHierarchyMap(category, terms) {
    console.log(category)

    var createChildrenHierarchy = (map, hierarchy, term, value) => {
      const lastTerm = hierarchy.pop()
      if(!_.isEmpty(hierarchy)) {
        let i;
        for(i = 0; i < hierarchy.length; i++) {
          // Since hierarchical strings are received in alphabetical order, this traversal
          // down the nested object won't error out
          map = map[hierarchy[i]].children = map[hierarchy[i]].children || {}
        }
      }

      map = map[lastTerm] = value
      return map
    }

    let categoryMap = {}

    Object.keys(terms).map( term => {
      let hierarchy = term.split(' > ')
      const parentTerm = hierarchy[hierarchy.length - 2]
      const value = {
        count: terms[term].count,
        children: {},
        parent: parentTerm ? parentTerm : null,
        term: term
      }

      createChildrenHierarchy(categoryMap, hierarchy, term, value)
    })

    console.log(categoryMap)
    return categoryMap
  }

  renderDownButton(category, term, hasChildren) {
    if (hasChildren) {
      return <i id={`${term}`} onClick={() => this.changePath(category, term)} className={`fa fa-chevron-down`}></i>
    }
  }

  render() {
    let facets = []
    let self = this
    _.forOwn(this.state.allCategoryMap, (categoryMap, category) => {

      let rows = []
      _.forOwn(_.get(categoryMap, self[category], categoryMap), (value, name) => {
        let input = {
          className: styles.checkFacet,
          'data-name': category,
          'data-value': value.term,
          id: `${category}-${value.term}`,
          type: 'checkbox',
          onChange: self.updateStoreAndSubmitSearch,
          checked: self.isSelected(category, value.term)
        }
        rows.push(<div className={styles.shiftedContent} key={`${category}-${value.term}`}>
          <input {...input}/>
          <span className={styles.facetLabel} title={`${value.term}`}>{name}</span>
          <div className={`${styles.count} ${styles.numberCircle}`}>{`(${value.count})`}</div>
          <div className={styles.button}>{self.renderDownButton(category, value.term, !_.isEmpty(value.children))}</div> {/*FIXME perform check ONCE here -- no div if no children*/}
        </div>)
      })

      facets.push(
        <Panel header={`${self.state.altHeader[category.toLowerCase()] || self.toTitleCase(category)}`} key={`${category}`}>
          {rows}
        </Panel>
      )
    })

    return <div>
      <div className={`${styles.facetContainer}`}>
        <form className={`pure-form ${styles.formStyle}`}>
          <span className={'pure-menu-heading'}>Categories</span>
          <Collapse defaultActiveKey="0">
            {facets}
          </Collapse>
        </form>
      </div>
    </div>
  }

}
export default FacetList
