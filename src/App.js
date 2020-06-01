import React from 'react';
import * as styles from './App.css';
import Container from './Container';
import { BrowserRouter} from 'react-router-dom';

function App() {

  return (
    <div className={styles.mahaContainer}>
        <BrowserRouter>
          <Container />
        </BrowserRouter>
    </div>
  );
}

export default App;
