import React, { Component, ReactNode } from 'react';
import './App.css';
import Call from './components/Call/Call'

class App extends Component
 {
   render(): ReactNode {
    return (
      <div className="App">
        <Call></Call>
      </div>
    );
   }
    
}

export default App;
