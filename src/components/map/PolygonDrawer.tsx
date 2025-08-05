
import { useMapEvents, Polyline, Marker } from 'react-leaflet';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { addPolygon, fetchPolygonData } from '../../store/slices/polygonsSlice';
import { toggleDrawing, setSelectedPolygon } from '../../store/slices/mapSlice';
import { LatLng, divIcon } from 'leaflet';
import { useState } from 'react';
import { message } from 'antd';

/**
 * A component that handles user interaction for drawing polygons and
 * now also renders the visual feedback for the in-progress drawing.
 */
export function PolygonDrawer() {
  const dispatch = useAppDispatch();
  const { isDrawing } = useAppSelector((state) => state.map);
  const [points, setPoints] = useState<LatLng[]>([]);

  useMapEvents({
   
    click(e) {
      
      if (!isDrawing) return;

      const newPoint = e.latlng;

      // Check if the user is closing the polygon by clicking near the start point.
      if (points.length > 2 && newPoint.distanceTo(points[0]) < 500) {
        if (points.length > 12) {
          message.error('A polygon cannot have more than 12 points.');
          return;
        }

        const newPolygonId = `poly_${new Date().getTime()}`;
        const newPolygonData = {
          id: newPolygonId,
          points: [...points, points[0]].map(p => [p.lat, p.lng] as [number, number]),
          dataSource: 'open-meteo' as const,
          rules: [],
          color: '#808080',
        };

        dispatch(addPolygon(newPolygonData));
        dispatch(fetchPolygonData(newPolygonId));
        dispatch(toggleDrawing(false));
        dispatch(setSelectedPolygon(newPolygonId));
        setPoints([]); 
        message.success('Polygon created successfully!');
      } else {
        if (points.length >= 12) {
          message.error('A polygon cannot have more than 12 points. Click the first point to close the shape.');
          return;
        }
        setPoints([...points, newPoint]);
      }
    },
  });

  // Create a custom circular icon for the drawing vertices.
  const markerIcon = divIcon({
    className: 'custom-div-icon',
    html: `<div style='background-color:#1677ff;width:10px;height:10px;border-radius:50%;border: 2px solid white;box-shadow: 0 0 5px rgba(0,0,0,0.5);'></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });

  // This is the new part: Render the visual feedback.
  // It only renders when isDrawing is true and at least one point has been placed.
  return (
    <>
      {isDrawing && points.length > 0 && (
        <>
          
          <Polyline positions={points} color="#1677ff" dashArray="5, 10" weight={2} />
          
          
          {points.map((point, index) => (
            <Marker key={index} position={point} icon={markerIcon} />
          ))}
        </>
      )}
    </>
  );
}