import { useState } from 'react'
import reactLogo from '../static/react.svg'
import viteLogo from '../static/vite.svg'
import './App.css'

import BaseLayout from './containers/BaseLayout';
import { Route, Routes, Navigate } from 'react-router-dom'

function App() {

  return (
    <Routes>
      <Route path="/" element={<BaseLayout />} >
        {/* <Route path='' element */}

      </Route>
    </Routes>
  )
}

export default App
