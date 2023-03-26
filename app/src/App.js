import { Route, Routes, Link, Outlet } from 'react-router-dom'

import Missing from './components/Missing'
import Create from './components/Create';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Create />} >
          {/* public routes */}
          {/* <Route path="create" element={<Create />} /> */}
          {/* missing */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
      {/* <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1> */}
    </>
  );
}

export default App;
