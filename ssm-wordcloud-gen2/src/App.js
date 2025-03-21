import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Main.tsx';
import WordCloud from './pages/WordCloud.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/WordCloud" element={<WordCloud />} />
      </Routes>
    </Router>
  );
}

export default App;

