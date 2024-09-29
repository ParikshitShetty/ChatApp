import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from 'react-hot-toast';
import { Routes, Route } from 'react-router-dom';
// Routes
import Chat from '@/routes/Chat';
import Login from "@/routes/Login";
import Logout from "@/routes/Logout";
// Utils
import FallbackComponent from '@/components/ui/FallbackComponent';

function App() {  
  return (
    <>
      <ErrorBoundary 
        FallbackComponent={FallbackComponent}
        >
          <div className='min-h-screen w-screen bg-custom-grey text-white text-center relative'>
            <Routes>
              <Route path="/login" element={ <Login/>} />
              <Route path="/logout" element={ <Logout />} />
              <Route path="/" element={ <Chat />} />
              <Route path="*" element={ <div>Route not found</div>} />
            </Routes>
            <Toaster position="top-right"/>
          </div>
      </ErrorBoundary>
    </>
  )
}

export default App
