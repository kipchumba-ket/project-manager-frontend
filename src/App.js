import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import React, {useState } from 'react';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Projects from './pages/Projects';
import AddProject from './pages/Projects/AddProject';
import Signup from './pages/Signup';
import ProjectDetails from './pages/ProjectDetails';


function App() {
  const [loggedIn, setLoggedIn] = useState(!!JSON.parse(localStorage.getItem('loggedIn')))

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
        <Routes>
          <Route exact path='/home' element={ <Home /> } />
          <Route exact path='/projects' element={ <Projects loggedIn={loggedIn}/> }/>
          <Route exact path='/addproject' element={ <AddProject /> }/>
          <Route exact path='/login' element={ <Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} /> }/>
          <Route exact path='/signup' element={ <Signup loggedIn={loggedIn} setLoggedIn={setLoggedIn}/> }/>
          <Route exact path='/project-details' element={<ProjectDetails />} />
          <Route exact path='/add-project' element={<AddProject />}/>
          <Route path='/' element={ <Home /> } />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
