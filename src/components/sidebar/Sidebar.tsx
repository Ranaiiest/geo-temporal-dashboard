
import { Button, Divider, List, Typography, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { toggleDrawing, setSelectedPolygon } from '../../store/slices/mapSlice';
import { removePolygon } from '../../store/slices/polygonsSlice';
import { RulesEngine } from './RulesEngine';

const { Title, Text } = Typography;

export function Sidebar() {
  const dispatch = useAppDispatch();
  
  const { isDrawing, selectedPolygonId } = useAppSelector((state) => state.map);
  const polygons = useAppSelector((state) => state.polygons.polygons);
  
  // Find the full data object for the currently selected polygon.
  const selectedPolygon = polygons.find(p => p.id === selectedPolygonId);

  const handleAddPolygonClick = () => {
    
    dispatch(toggleDrawing());
  };

  const handleSelectPolygon = (id: string) => {
    dispatch(setSelectedPolygon(id));
  };

  const handleDeletePolygon = (id: string) => {
    dispatch(removePolygon(id));
    
    if (selectedPolygonId === id) {
        dispatch(setSelectedPolygon(null));
    }
  };

  return (
    <div style={{ padding: '1.5rem', color: 'white' }}>
      <Title level={4} style={{ color: 'white', marginTop: 0 }}>Controls</Title>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddPolygonClick}
        block
        ghost={isDrawing} 
      >
        {isDrawing ? 'Cancel Drawing' : 'Add New Polygon'}
      </Button>
      {isDrawing && <Text type="secondary" style={{display: 'block', textAlign: 'center', marginTop: '8px'}}>Click on the map to add points.</Text>}
      
      <Divider style={{ borderColor: 'rgba(255,255,255,0.2)' }} />

      <Title level={5} style={{ color: 'white' }}>Polygons</Title>
      <List
        itemLayout="horizontal"
        dataSource={polygons}
        renderItem={(item, index) => (
          <List.Item
            style={{ 
                padding: '12px 8px', 
                cursor: 'pointer', 
                borderLeft: selectedPolygonId === item.id ? '4px solid #1677ff' : '4px solid transparent',
                background: selectedPolygonId === item.id ? 'rgba(22, 119, 255, 0.1)' : 'transparent',
                transition: 'background 0.3s, border-left 0.3s',
            }}
            onClick={() => handleSelectPolygon(item.id)}
            actions={[
                <Popconfirm
                    title="Delete this polygon?"
                    description="This action cannot be undone."
                    onConfirm={(e) => {
                        e?.stopPropagation();
                        handleDeletePolygon(item.id);
                    }}
                    onCancel={(e) => e?.stopPropagation()}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={(e) => e.stopPropagation()} 
                    />
                </Popconfirm>
            ]}
          >
            <List.Item.Meta
              title={<Text style={{color: 'white'}}>Polygon {index + 1}</Text>}
              description={<Text style={{color: item.color, fontWeight: 'bold'}}>
                {item.currentValue !== undefined ? `${item.currentValue.toFixed(2)} °C` : 'No data'}
              </Text>}
            />
          </List.Item>
        )}
        locale={{ emptyText: <Text type="secondary" style={{textAlign: 'center', display: 'block', padding: '20px 0'}}>No polygons drawn yet.</Text>}}
      />

      <Divider style={{ borderColor: 'rgba(255,255,255,0.2)' }} />

     
      {selectedPolygon ? (
        <RulesEngine key={selectedPolygon.id} polygon={selectedPolygon} />
      ) : (
        <Text type="secondary" style={{textAlign: 'center', display: 'block'}}>Select a polygon to edit its rules.</Text>
      )}
    </div>
  );
}