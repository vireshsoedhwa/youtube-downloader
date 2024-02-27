import { Route, Routes, Link, Outlet } from 'react-router-dom'

import BaseLayout from './containers/BaseLayout';
import Home from './components/Home';
import Missing from './components/Missing'
import Create from './components/Create';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<BaseLayout />} >
          <Route path="home" element={<Home />} />
          <Route path="create" element={<Create />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
