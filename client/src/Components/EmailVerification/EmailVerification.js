import React from 'react';
import {setInStorage} from '../../utils/storage';

class EmailVerification extends React.Component{
    constructor(props) {
        super(props);

        this.state = {isLoading: true, 
            signinError: ''};
    }

    componentDidMount() {
        const {match: {params}} = this.props;
        fetch('/api/account/verify-email', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({token: params.token.substring(0, params.token.length - 1)})
        }).then(response => response.json())
          .then(json => {
            if(json.success) {
                const {email, password} = json;
                fetch('/api/account/signin', { 
                    method: 'POST',
                    headers: {'Content-type': 'application/json'},
                    body: JSON.stringify({email: email,
                      password: password
                    })
                  }).then(res => res.json())
                    .then(json => {
                      if(json.success) {
                        setInStorage('the_main_app', {token: json.token});
                        window.location = '/';
                      } else {
                        this.setState({signInError: json.message,
                          isLoading: false});
                      }
                    });
            } else {
                this.setState({signinError: json.message,
                    isLoading: false});
            }
          });
    }

    render(){
        const {isLoading,
            signinError} = this.state;
        
        if(isLoading) {
            return (<div className="main" id="small-main"><h3>Loading...</h3></div>);
        }

        return (
            <div className="main" id="small-main">
              <h2>Email verification</h2>
              <p style={{'fontWeight': 'bold', 
                color: '#484848'}}>{signinError}</p>
            </div>
        );
    }
}

export default EmailVerification;