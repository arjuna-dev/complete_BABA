import React from 'react';
import * as styles from './App.css';
import Container from './Container';
import { Route, BrowserRouter} from 'react-router-dom';

function App() {

  return (
    <div className={styles.mahaContainer}>
        <BrowserRouter>
          <Container />
        </BrowserRouter>
      {/* <Discourse discourseTitle="How_Should_Human_Beings_Live_In_This_World.html"></Discourse> */}
    </div>
  );
}

export default App;
