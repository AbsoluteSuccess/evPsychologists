import React from 'react';
import {Link} from 'react-router-dom';

class ResetPassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {password: '',
            isLoading: false,
            message: '',
            success: false,
            confirmPassword: ''};

        this.onTexboxChangePassword = this.onTexboxChangePassword.bind(this);
        this.onTexboxChangeConfirmPassword = this.onTexboxChangeConfirmPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onTexboxChangePassword(event) {
        this.setState({password: event.target.value});
    }

    onTexboxChangeConfirmPassword(event) {
        this.setState({confirmPassword: event.target.value});
    }

    onSubmit() {
        this.setState({isLoading: true});
        const {password, confirmPassword} = this.state;
        const {match: {params}} = this.props;
        fetch('/api/account/reset-password', {
            method: 'PUT',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({newPassword: password, 
                confirmPassword: confirmPassword,
                resetLink: params.token.substring(0, params.token.length - 1)})
        }).then(response => response.json())
          .then(json => {
            this.setState({isLoading: false, 
                message: json.message,
                email: '',
                success: json.success});
          });
    }

    render(){
        const {password,
            isLoading,
            success,
            message,
            confirmPassword} = this.state;

        if(isLoading) {
            return (<div className="main" id="small-main"><h3>Loading...</h3></div>);
        }
        const successful = (<div className="main" id="small-main">
            <h2>Password Reset</h2>
            <p style={{'fontWeight': 'bold', 
                color: '#484848'}}>Your password has successfully been updated</p>
            <Link className="link" to="/signin">
                <p className="link-main">Sign in</p>
            </Link>
        </div>);
        const unsuccessful = (<div className="main">
            <h2>Password Reset</h2>
            {(message) ? (<p className="error">{message}</p>) : (null)}
            <label htmlFor="email">Enter new password. At least 8 characters:</label><br/>
            <input type="password" placeholder="Password" value={password} onChange={this.onTexboxChangePassword}/><br/>
            <label htmlFor="email">Confirm password:</label><br/>
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={this.onTexboxChangeConfirmPassword}/><br/>
            <button onClick={this.onSubmit} className="signin">Submit</button>
        </div>);
        
        return success ? successful : unsuccessful;
    }
}

export default ResetPassword;