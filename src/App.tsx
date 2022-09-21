import { Route, Routes, Navigate } from 'react-router-dom'
import EditorWraped from './pages/EditorWraped';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/:id" element={<EditorWraped />} />
        {/* <Route path="*" element={<Navigate to="/1" />}/> */}
      </Routes>
    </div>
  );
}

export default App;
