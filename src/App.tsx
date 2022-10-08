import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import ReactGA from 'react-ga'
import EditorWraped from './pages/EditorWraped';
import Editor from './pages/Editor';

// Checkout Context
import { CheckoutProvider } from "./context/CheckoutContext";
import { useEffect, useState } from 'react';

function App() {
  const { pathname, search } = useLocation()
  const [roomName, setRoomName] = useState('')

  useEffect(() => {
    ReactGA.pageview(`${pathname}${search}`)
  }, [pathname, search])

  useEffect(() => {
    let currentUrl = (window.location.href).split('/')
    console.log(currentUrl);

    if (currentUrl[4] === undefined) {
      let newRoomName = `unify-product-${new Date().getTime()}`
      setRoomName(newRoomName)
    } else {
      setRoomName(currentUrl[5]);
    }
  }, [])

  return (
    <CheckoutProvider>
      <div className="App">
        <Routes>
          <Route path="/:id" element={<EditorWraped roomName={roomName} />} />
          <Route path="/:id/:audioid/:roomname" element={<EditorWraped roomName={roomName} />} />
          {/* <Route path="/:id" element={<Editor />} /> */}
          <Route path="/:id" element={<Navigate to="/1" />} />
        </Routes>
      </div>
    </CheckoutProvider>
  );
}

export default App;
