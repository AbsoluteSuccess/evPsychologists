import React, { Component } from 'react';
import {setInStorage} from '../../utils/storage';
import {Link} from 'react-router-dom';
import './Signin.css';

class Signin extends Component {
  constructor(props) {
    super(props);
 
    this.state = {isLoading: false,
      error: '',
      email: '',
      password: ''};

    this.onTexboxChangeEmail = this.onTexboxChangeEmail.bind(this);
    this.onTexboxChangePassword = this.onTexboxChangePassword.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
  }

  onTexboxChangeEmail(event) {
    this.setState({email: event.target.value});
  }

  onTexboxChangePassword(event) {
    this.setState({password: event.target.value});
  }

  onSignIn() {
    const {email,
      password} = this.state;
    this.setState({isLoading: true});
    
    fetch('/api/account/signin', { 
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify({email: email,
        password: password})
    }).then(res => res.json())
      .then(json => {
        if(json.success) {
          setInStorage('the_main_app', {token: json.token});
          this.setState({isLoading: false,
            email: '',
            password: '',
            error: ''});
          window.location = '/';
        } else {
          this.setState({error: json.message,
            isLoading: false});
        }
      });
  }

  render() {
    const {isLoading,
      error,
      email,
      password} = this.state;

    if(isLoading) {
      return (<div className="main" id="small-main"><h3>Loading...</h3></div>);
    }
 
    return (
    <div>
        <div className="main">
        <h2>Sign in</h2>
        <label>University email</label><br/>
        <input type="text" placeholder="Email" value={email} onChange={this.onTexboxChangeEmail}/><br/>
        <label>Password</label><br/>
        <input type="password" placeholder="Password" value={password} onChange={this.onTexboxChangePassword}/><br/>
        {(error) ? (<p class="error">{error}</p>) : (null)}
        <Link className="link" to="/forgot-password">
          <div id="forgot">I forgot my password</div>
        </Link>
        <button onClick={this.onSignIn} className="signin">Sign in</button>
        <div id="do-not-have">Do not have an account?</div>
        <Link className="link" to="/signup">
          <div className="link-main">Create Account</div>
        </Link>
        </div>
    </div> 
    );
  }
}

export default Signin;