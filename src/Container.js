import React from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import Discourse from './components/Discourse'
import bookList from './assets/bookList'

function Container({ location }) {
  return (
    <div>
      <section className="route-section">
        <Switch location={location}>
        <Route exact path = '/'  component={Discourse} />
        
          {bookList.map((discourseTitle)=>{
            return <Route exact path = {'/' + discourseTitle}  
            render={(props) => <Discourse {...props} discourseTitle={discourseTitle} />}
          />
          })}
        </Switch>
      </section>
    </div>
  );
  }
  
export default withRouter(Container);