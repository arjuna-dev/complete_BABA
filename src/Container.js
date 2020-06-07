import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import Discourse from './components/Discourse'
import bookList from './assets/bookList'

function Container({ location }) {
  return (
    <div>
      <section className="route-section">
        <Route location={location}>
          {bookList.map((discourseTitle)=>{
            return <Route exact path = {'/' + discourseTitle}  
            render={(props) => <Discourse {...props} discourseTitle={discourseTitle} />}
            />
          })}
          <Route exact path = '/'  component={Discourse} />
        </Route>
      </section>
    </div>
  );
  }
  
export default withRouter(Container);