import React, { useState } from 'react';
import { Layout, Spin, Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { TimelineSlider } from './components/timeline/TimelineSlider';
import { Sidebar } from './components/sidebar/Sidebar';
import { useWindowSize } from './hooks/useWindowSize'; // Import our new hook
import './App.css';

const { Header, Sider, Content } = Layout;

const MapDashboard = React.lazy(() => 
  import('./components/map/MapDashboard').then(module => ({ default: module.MapDashboard }))
);

function App() {
  // Get the window width from our custom hook.
  const { width } = useWindowSize();
  const isMobile = width < 768; // Define our breakpoint for mobile devices.

  // State to control the visibility of the drawer on mobile.
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    // This is a small trick to tell Leaflet to resize itself after the drawer closes,
    // ensuring the map is not distorted.
    window.dispatchEvent(new Event('resize'));
  };

  const sidebarContent = <Sidebar />;

  return (
    <Layout className="app-container">
      <Header className="app-header">
        <TimelineSlider />
      </Header>
      <Layout className="app-body">
        {isMobile ? (
          // --- MOBILE LAYOUT ---
          <>
            <Button
              className="mobile-menu-button"
              type="primary"
              shape="circle"
              icon={<MenuOutlined />}
              onClick={() => setDrawerVisible(true)}
            />
            <Drawer
              title="Controls"
              placement="left"
              onClose={handleDrawerClose}
              open={drawerVisible}
              bodyStyle={{ padding: 0 }}
              width={320}
            >
              {sidebarContent}
            </Drawer>
          </>
        ) : (
          // --- DESKTOP LAYOUT ---
          <Sider width={350} className="app-sider">
            {sidebarContent}
          </Sider>
        )}
        <Content className="app-content">
          <React.Suspense 
            fallback={
                <div className="spinner-container">
                    <Spin size="large" tip="Loading Map..." />
                </div>
            }
          >
            <MapDashboard />
          </React.Suspense>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;