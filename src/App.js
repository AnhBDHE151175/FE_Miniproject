import logo from './logo.svg';
import './App.css';
import BigLayout from './Layout/layout';
import TableContent from './Layout/Content/content';
import {createContext, useState} from 'react'

export const LoginContext = createContext();


function App() {

  const[isLogin,setIsLogin] = useState(false)

  return (
    <div className="App">
      
        <LoginContext.Provider value={{isLogin,setIsLogin}}>
          <BigLayout>
            <TableContent></TableContent>
          </BigLayout>
        </LoginContext.Provider>
    </div>
  );
}

export default App;
