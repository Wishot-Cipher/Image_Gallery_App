import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import PrivateRoute from './components/Authentication/PrivateRoute';
import Gallery from './pages/Gallery';
import Login from './pages/Login';
import Register from './pages/Register';
import { DndProvider, MultiBackend } from 'react-dnd-multi-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { TouchTransition, MouseTransition } from 'react-dnd-multi-backend';

const HTML5toTouch = {
  backends: [
    {
      id: "html5",
      backend: HTML5Backend,
      transition: MouseTransition,
    },
    {
      id: "touch",
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      transition: TouchTransition,
      preview:true
    },
  ],
};

const App = () => {
  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Gallery />} />
      </Routes>
    </DndProvider>
  );
};

export default App;
