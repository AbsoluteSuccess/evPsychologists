import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      username: '',
      email: '',
      password: '',
      error: '',
      confirmPassword: ''
    };

    this.onTexboxChangeEmail = this.onTexboxChangeEmail.bind(this);
    this.onTexboxChangePassword = this.onTexboxChangePassword.bind(this);
    this.onTexboxChangeUsername = this.onTexboxChangeUsername.bind(this);
    this.onTexboxChangeConfirmPassword = this.onTexboxChangeConfirmPassword.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
  }

  onTexboxChangeUsername(event) {
    this.setState({ username: event.target.value });
  }

  onTexboxChangeEmail(event) {
    this.setState({ email: event.target.value });
  }

  onTexboxChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  onTexboxChangeConfirmPassword(event) {
    this.setState({ confirmPassword: event.target.value });
  }

  onSignUp() {
    const { username,
      email,
      password,
      confirmPassword } = this.state;
    this.setState({ isLoading: true });

    fetch('/api/account/signup', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword
      })
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            error: json.message,
            isLoading: false,
            email: '',
            password: '',
            username: '',
            confirmPassword: ''
          });
        } else {
          this.setState({
            error: json.message,
            isLoading: false
          });
        }
      });
  }
  
  render() {
    const { isLoading,
      username,
      email,
      password,
      error,
      confirmPassword } = this.state;

    if (isLoading) {
      return (<div className="main" id="small-main"><h3>Loading...</h3></div>);
    }

    let errorColor;
    if (error === 'Verification email was sent to your email. Proceed to your email to continue your registration.') {
      errorColor = { color: '#3069f0' };
    } else {
      errorColor = { color: '#bf2e2c' };
    }

    return (
      <div>
        <div className="main" id="signup-box">
          <h2 style={{ margin: 0 }}>Sign up</h2>
          <div>With this account you will write your reviews.</div><br />
          {(error) ? (<p class="error" style={errorColor}>{error}</p>) : (null)}
          <label>Username. It'll be shown on reviews.</label><br />
          <input type="text" placeholder="Username" value={username} onChange={this.onTexboxChangeUsername} /><br />
          <label>University email</label><br />
          <input type="email" placeholder="Email" value={email} onChange={this.onTexboxChangeEmail} /><br />
          <label>Password. At least 8 characters</label><br />
          <input type="password" placeholder="Password" value={password} onChange={this.onTexboxChangePassword} /><br />
          <label>Confirm your password</label><br />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={this.onTexboxChangeConfirmPassword} /><br />
          <button onClick={this.onSignUp} className="signin">Sign up</button>
          <div>By signing up, you agree to receive the emails related to your account and to be bound by the current version of the
          <Link className="link" to="/terms"><span className="link-main"> Terms and Conditions</span></Link> of Use.</div>
        </div>
      </div>
    );
  }
}

export default Signup;