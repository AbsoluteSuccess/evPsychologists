import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import Nav from './Components/Nav/Nav';
import Main from './Components/Main/Main';
import EmailVerification from './Components/EmailVerification/EmailVerification';
import Signin from './Components/Signin/Signin';
import Signup from './Components/Signup/Signup';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import Psychologist from './Components/Psychologist/Psychologist';
import Terms from './Components/Terms/Terms';

class App extends React.Component {
  render(){
    return (
      <Router>
        <Nav/>
        <Switch>
          <Route path="/" exact component={Main}/>
          <Route path="/terms" exact component={Terms}/>
          <Route path="/signin" exact component={Signin}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/signin/:token" component={EmailVerification}/>
          <Route path="/forgot-password" exact component={ForgotPassword}/>
          <Route path="/forgot-password/:token" component={ResetPassword}/>
          <Route path="/:psychologist" component={Psychologist}/>
        </Switch>
      </Router>
    );
  }
}

export default App;