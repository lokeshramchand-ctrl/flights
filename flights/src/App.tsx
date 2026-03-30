import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Timeline from './pages/Timeline';
import Chat from './Chat/App';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Timeline />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/timeline" element={<Timeline />} />
      </Routes>
    </Router>
  );
}

export default App;
