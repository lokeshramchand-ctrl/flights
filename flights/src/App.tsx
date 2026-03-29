import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Timeline from './pages/Timeline';
import Chat from './pages/Chat';
import ResourceGraph from './pages/ResourceGraph';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Timeline />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/resource-graph" element={<ResourceGraph />} />
      </Routes>
    </Router>
  );
}

export default App;
