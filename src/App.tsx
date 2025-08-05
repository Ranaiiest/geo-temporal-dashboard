import React from 'react';
import { Layout, Spin } from 'antd';
import { TimelineSlider } from './components/timeline/TimelineSlider';
import { Sidebar } from './components/sidebar/Sidebar';
import './App.css';

const { Header, Sider, Content } = Layout;

const MapDashboard = React.lazy(() => 
  import('./components/map/MapDashboard').then(module => ({ default: module.MapDashboard }))
);

function App() {
  return (
    // root class to control the overall page layout
    <Layout className="app-container">
      <Header className="app-header">
        <TimelineSlider />
      </Header>
      {/* class to the body layout (sider + content) */}
      <Layout className="app-body"> 
        <Sider width={350} className="app-sider">
          <Sidebar />
        </Sider>
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