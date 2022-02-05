import React from "react";
import { Container } from "react-bootstrap"
import { AuthProvider } from "../contexts/AuthContexts";
import { BrowserRouter as Router, Routes , Route } from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from "./Login"
import PrivateRoute from "./PrivateRoute"
import AddEdit from "./AddEdit"

function App() {
  return (
  <AuthProvider>
    <Container>
        <Router>
          <AuthProvider>
            <Routes>
              <Route
                path='/dashboard'
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route path='/' element={ <Login/>} />
              <Route path={`/dashboard/add`} element = {<AddEdit/>} />
              <Route path={`/dashboard/edit/:id`} element = {<AddEdit/>} />
            </Routes>
          </AuthProvider>
        </Router>
    </Container>
  </AuthProvider>
  )
}

export default App;
