import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

function HotelMap({ lat = -1.286389, lng = 36.817223, hotelName = "Hotel" }) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© OpenStreetMap contributors'
      />
      <Marker position={[lat, lng]}>
        <Popup>{hotelName}</Popup>
      </Marker>
    </MapContainer>
  )
}

export default HotelMap