import _ from 'lodash'

export const shiftCoordinate = (coordinate, rotations) => {
  if (rotations === 0) { return coordinate }
  const newX = (coordinate[0] + (360 * rotations))
  return _.concat([newX], _.slice(coordinate, 1))
}

export const shiftCoordinates = (coordinates, rotations) => {
  if (rotations === 0) { return coordinates }
  return _.map(coordinates, coordinate => shiftCoordinate(coordinate, rotations))
}

export const findMaxRotations = (coordinates) => {
  return _.chain(coordinates)
      .map(coordinate => coordinate[0])
      .map(x => Math.trunc(x / 360))
      .maxBy(rotations => Math.abs(rotations))
      .value()
}

export const recenterGeometry = (geometry) => {
  if (geometry.type.toLowerCase() !== "polygon" || geometry.coordinates.length !== 1) {
    throw Error("Can only recenter single-ring polygons")
  }

  const firstRing = geometry.coordinates[0]
  const maxRotations = findMaxRotations(firstRing)
  const newRing = shiftCoordinates(firstRing, -1 * maxRotations)
  const newCoordinates = [newRing]
  return _.assign({}, geometry, {coordinates: newCoordinates})
}

export const convertEnvelopeToPolygon = (geometry) => {
  if (geometry.type.toLowerCase() !== 'envelope') {
    return geometry
  }

  const eCoords = geometry.coordinates
  const pCoords = [
    [
      [eCoords[0][0], eCoords[0][1]],
      [eCoords[0][0], eCoords[1][1]],
      [eCoords[1][0], eCoords[1][1]],
      [eCoords[1][0], eCoords[0][1]]
    ]
  ]
  return {
    type: "Polygon",
    coordinates: pCoords
  }
}

export const convertBboxToGeoJson = (coordString) => {
  const coordArray = coordString.split(',').map(x => parseFloat(x))
  const sw = [coordArray[0], coordArray[1]]
  const nw = [coordArray[0], coordArray[3]]
  const ne = [coordArray[2], coordArray[3]]
  const se = [coordArray[2], coordArray[1]]
  const coordinates = [sw, nw, ne, se, sw]
  if (!_.every(coordinates, (p) => p[0] >= -180 && p[0] <= 180 && p[1] >= -90 && p[1] <= 90)) {
    return undefined
  }
  else {
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [coordinates],
        type: 'Polygon'
      }
    }
  }
}

export const convertGeoJsonToBbox = (geoJson) => {
  const coordinates = geoJson && geoJson.geometry && geoJson.geometry.coordinates
  return coordinates ? coordinates[0].filter((el,idx)=>[0,2].includes(idx)).toString() : ''
}
