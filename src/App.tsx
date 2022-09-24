import { Route, Routes } from 'react-router-dom'
import EditorWraped from './pages/EditorWraped';

// Checkout Context
import { CheckoutProvider } from "./context/CheckoutContext";

function App() {
  return (
    <CheckoutProvider>
      <div className="App">
        <Routes>
          <Route path="/:id" element={<EditorWraped />} />
          {/* <Route path="*" element={<Navigate to="/1" />}/> */}
        </Routes>
      </div>
    </CheckoutProvider>
  );
}

export default App;
