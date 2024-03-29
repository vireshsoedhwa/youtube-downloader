import { Route, Routes, Navigate } from 'react-router-dom'

import BaseLayout from './containers/BaseLayout';
import Home from './components/Home';
import Missing from './components/Missing'
import Create from './components/Create';
import Detail from './components/Detail';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<BaseLayout />} >
          <Route path="home" element={<Home />} />
          <Route path="create" element={<Create />} />
          <Route path="detail/:id" element={<Detail />} />
          <Route path="" element={<Navigate to="/home" replace={true} />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
