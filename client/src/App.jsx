import { ErrorBoundary } from "react-error-boundary";
import { useAtomValue } from "jotai";
import { Toaster } from 'react-hot-toast';
// Routes
import Chat from './routes/Chat';
// Utils
import FallbackComponent from './utils/FallbackComponent';
// Global States
import { 
  loginStateStore } from "./store/store";
import LoginForm from "./components/LoginForm";


function App() {
  const loginState = useAtomValue(loginStateStore);
  return (
    <>
      <ErrorBoundary 
        FallbackComponent={FallbackComponent}
        >
          <div className='min-h-screen w-screen bg-custom-grey text-white text-center relative'>
            {
              !loginState ?
                <>
                  <LoginForm />
                </>
                :
                <>
                  <Chat />
                </>
            }
            <Toaster position="top-right"/>
          </div>
      </ErrorBoundary>
    </>
  )
}

export default App
