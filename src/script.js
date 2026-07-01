const indonesiaExtent = [
  [-10.3599874813, 95.2930261576],
  [5.47982086834, 141.03385176]
]

const popup = (feature, layer) => {
  layer.bindPopup(`
    <b>${feature.properties.Name}</b>
  `)
}

const itemMarker = (geoJsonPoint, latlng) =>
  L.circleMarker(latlng, {
    stroke: false,
    fillOpacity: 1,
    color: '#C4C4C4',
  })

const markerCluster = cluster => {
  const total = cluster.getAllChildMarkers()

  let iconSize
  if (total < 10) {
    iconSize = 24
  } else if (total < 20) {
    iconSize = 32
  } else {
    iconSize = 40
  }

	return L.divIcon({
    html: total.length,
    className: 'marker-cluster',
    iconSize: L.point(iconSize, iconSize, true)
  })
}

const mapRef = L
  .map('panel-map', {
    zoom: 5,
    maxZoom: 14,
    zoomControl: false,
    center: [-2.438, 117.949],
    maxBounds: indonesiaExtent,
  })
  .whenReady(e => {
    e.target.flyToBounds(indonesiaExtent, {
      paddingTopLeft: [0, 0]
    })
  })

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
  attribution: `Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL. | Data extracted from <a href="http://siaga.bnpb.go.id/rsrujukancovid19">BNPB Map</a>`,
}).addTo(mapRef)

const geojson = L
  .geoJSON(window.mockData, {
    onEachFeature: popup,
    pointToLayer: itemMarker,
  })

L.markerClusterGroup({ iconCreateFunction: markerCluster })
  .addLayer(geojson)
  .addTo(mapRef)
