// App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/Authentication/PrivateRoute';
import Gallery from './pages/Gallery';
import Login from './pages/Login';
import Register from './pages/Register';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Gallery />} />
      </Routes>
    </DndProvider>
  );
};

export default App;
