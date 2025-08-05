
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css'; // Styles for the drawing tool icons.
import { useAppSelector } from '../../hooks/redux-hooks';
import { PolygonDrawer } from './PolygonDrawer';

/**
 * The main map component that aggregates all map-related functionality.
 * It displays the base map and all the polygons from the Redux store.
 */
export function MapDashboard() {
  // Default center of the map (Kolkata, India).
  const mapCenter: [number, number] = [22.5726, 88.3639];
  
  // Select the array of polygons from the Redux store.
  // This component will re-render whenever this array changes.
  const polygons = useAppSelector((state) => state.polygons.polygons);
  const selectedPolygonId = useAppSelector((state) => state.map.selectedPolygonId);

  return (
    <MapContainer
      center={mapCenter}
      zoom={12}
      scrollWheelZoom={true} // Allow zooming with the mouse wheel.
      style={{ height: '100%', width: '100%', background: '#1d232a' }}
    >
      {/* Using a dark theme for the map tiles from CartoDB to match our UI. */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {/* This is a "headless" component that handles the logic for drawing new polygons. */}
      <PolygonDrawer />
      
      {/* Render all polygons from the Redux state. */}
      {polygons.map((poly) => (
        <Polygon
          key={poly.id}
          positions={poly.points}
          pathOptions={{ 
            color: selectedPolygonId === poly.id ? '#1677ff' : poly.color, // Highlight selected polygon
            fillColor: poly.color, 
            weight: selectedPolygonId === poly.id ? 4 : 2, // Make selected polygon border thicker
            fillOpacity: 0.6 
          }}
        />
      ))}
    </MapContainer>
  );
}