import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Timeline from './Timeline/App';
import Chat from './Chat/App';
import ResourceGraph from './Resource/App';
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
