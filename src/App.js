import React from 'react';
import './App.css';
import { Container } from "react-bootstrap";
import Header from './components/Header';
import Routes from "./routes"

function App() {
  return <>
    <Header />
    <Container fluid style={{ paddingTop: 70 }}>
      <Routes />
    </Container>    
  </>
}

export default App;
