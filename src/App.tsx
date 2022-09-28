import { Route, Routes, useLocation } from 'react-router-dom'
import ReactGA from 'react-ga'
import EditorWraped from './pages/EditorWraped';
import Editor from './pages/Editor';

// Checkout Context
import { CheckoutProvider } from "./context/CheckoutContext";
import { useEffect } from 'react';

function App() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    ReactGA.pageview(`${pathname}${search}`)
  }, [pathname, search])

  return (
    <CheckoutProvider>
      <div className="App">
        <Routes>
          <Route path="/:id" element={<EditorWraped />} />
          {/* <Route path="/:id" element={<Editor />} /> */}
          {/* <Route path="*" element={<Navigate to="/1" />}/> */}
        </Routes>
      </div>
    </CheckoutProvider>
  );
}

export default App;
