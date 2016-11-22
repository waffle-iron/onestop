import React, { PropTypes } from 'react'
import _ from 'lodash'
import MapContainer from '../MapContainer'
import styles from './list.css'

class GranuleList extends React.Component {
  constructor(props) {
    super(props)
    this.results = props.results
    this.focusedIds = props.focusedIds
    this.onMouseOver = props.onMouseOver
  }

  render() {
    const rows = []
    const dataFormats = 'Data Formats TBD'
    const tags = 'Tags TBD'
    // FIXME Which granule fields are being displayed in table?

    _.forEach(this.results, (value, key) => {
      rows.push(
        <tr key={key} onMouseOver={() => this.onMouseOver(key)} onMouseLeave={() => this.onMouseOver(key)}>
          <td>{value.title}</td>
          <td>{value.modifiedDate}</td>
          <td>{dataFormats}</td>
          <td>{tags}</td>
        </tr>
      )
    })

    return <div className={`pure-g ${styles.mainWindow}`}>
          <div className={`pure-u-1 ${styles.leftTitle}`}>
            {this.props.selectedCollection.title}
          </div>
          <div className={`pure-u-1`}>
            <div className={`pure-u-5-24 ${styles.leftDescription}`}>
              {this.props.selectedCollection.description}
            </div>
            <div className={`pure-u-3-4 ${styles.rightMap}`}>
              <MapContainer />
            </div>
          </div>
          <div className={`pure-u-1`}>
            <table className={`pure-table ${styles.table}`}>
              <thead>
              <tr>
                <th>Title</th>
                <th>Date Modified</th>
                <th>Data Formats</th>
                <th>Tags</th>
              </tr>
              </thead>
              <tbody>{rows}</tbody>
            </table>
          </div>
        </div>
  }
}

export default GranuleList
