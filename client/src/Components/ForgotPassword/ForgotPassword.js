import React from 'react';
import './ForgotPassword.css';

class ForgotPassword extends React.Component {
    constructor(props) {
        super(props);

        this.state={email: '',
            message: '',
            isLoading: false};

        this.onTexboxChangeEmail = this.onTexboxChangeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onTexboxChangeEmail(event) {
        this.setState({email: event.target.value});
    }

    onSubmit() {
        const {email} = this.state; 
        this.setState({isLoading: true});
        fetch('/api/account/forgot-password', {
            method: 'PUT',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({email: email})
        }).then(response => response.json())
         .then(json => {
            this.setState({isLoading: false, 
                message: json.message,
                email: ''});
         });
    }

  render(){
    const {isLoading,
        message,
        email} = this.state;

    if(isLoading) {
        return (<div className="main" id="small-main"><h3>Loading...</h3></div>);
    }

    let errorColor;
    if(message === 'Email has been sent, kindly follow the instructions.')  {
      errorColor = {color: '#3069f0'};
    } else {
      errorColor = {color: '#bf2e2c'};
    }

    return (
        <div className="main" id="forgot-box">
            <h2>Request password reset</h2>
            {(message) ? (<p className="error" style={errorColor}>{message}</p>) : (null)}
            <label htmlFor="email">Enter the university email:</label><br/>
            <input type="email" placeholder="Email" value={email} onChange={this.onTexboxChangeEmail}/><br/>
            <button onClick={this.onSubmit} className="signin" id="request-password">Request password reset</button>
        </div>
    );
  }
}

export default ForgotPassword;
