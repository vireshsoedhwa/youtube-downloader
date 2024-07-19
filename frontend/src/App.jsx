import { useState } from 'react'
// import reactLogo from '../static/react.svg'
// import viteLogo from '../static/vite.svg'
import './App.css'
import Create from '../src/containers/Create'
import Home from '../src/containers/Home'

import BaseLayout from './containers/BaseLayout';
import { Route, Routes, Navigate } from 'react-router-dom'

function App() {

  return (
    <Routes>
      <Route path="/" element={<BaseLayout />} >
        <Route path='' element={<Home />} />
        <Route path='home' element={<Home />} />
        <Route path='create' element={<Create />} />
      </Route>
    </Routes>
  )
}

export default App
