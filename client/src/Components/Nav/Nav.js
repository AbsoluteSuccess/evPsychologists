import React from 'react';
import './Nav.css';
import {Link} from 'react-router-dom';
import {getFromStorage} from '../../utils/storage';
 
class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isLoading: true,
          token: '',
          username: ''}

        this.logout = this.logout.bind(this);
      }
    
      componentDidMount() {
        const obj = getFromStorage('the_main_app');    
        if(obj && obj.token) {
          const {token} = obj;
          //Verify token
          fetch(`/api/account/verify?token=${token}`)
            .then(res => res.json())
            .then(json => {
              if(json.success) {
                this.setState({token,
                  isLoading: false,
                  username: json.username});
              } else {
                this.setState({isLoading: false});
              }
            })
        } else {
          this.setState({isLoading: false});
        }
      }
      

    logout() {
        this.setState({isLoading: true});
        const obj = getFromStorage('the_main_app');    
        if(obj && obj.token) {
            const {token} = obj;
            //Verify token
            fetch(`/api/account/logout?token=${token}`)
             .then(res => res.json())
             .then(json => {
                if(json.success) {
                    this.setState({token: '',
                        isLoading: false
                    })
                    window.location = '/';
                } else {
                    this.setState({isLoading: false});
                }
            })
        } else {
            this.setState({isLoading: false});
        }
    }

    toggle() {
      const navbarLinks = document.getElementsByClassName('nav-links')[0];
      navbarLinks.classList.toggle('active');
      const navbar = document.getElementsByClassName('navbar')[0];
      navbar.classList.toggle('active1');
    }

    render() {
        const {isLoading,
          token,
          username} = this.state;
        if(isLoading) {
            return <nav></nav>;
        }
        if(!token) {
            return (
                <nav className="navbar">
                    <Link className="link" to="/">
                      <span className="brand" >Evaluate Psychologists</span>
                    </Link>
                    <div className="toggle-button" onClick={this.toggle}>
                      <span className="bar"></span>
                      <span className="bar"></span>
                      <span className="bar"></span>
                    </div> 
                    <ul className="nav-links">
                        <Link className="link" to="/">
                          <li>Home</li>
                        </Link>
                        <Link className="link" to="/terms">
                          <li>Terms</li>
                        </Link>
                          <li>|</li>
                        <Link className="link" to="/signin">
                            <li style={{'fontWeight': 'bold'}}>Sign in</li>
                        </Link>
                        <Link className="link" to="/signup">
                            <li><button id="signup-button">Sign up</button></li>
                        </Link>
                    </ul>
                </nav>
            );
        } 
        return (
            <nav className="navbar">
                <Link className="link" to="/">
                  <span className="brand">Evaluate Psychologists</span>
                </Link>
                <div href="#" className="toggle-button" onClick={this.toggle}>
                  <span className="bar"></span>
                  <span className="bar"></span>
                  <span className="bar"></span>
                </div>
                <ul className="nav-links">
                    <Link className="link" to="/">
                      <li>Home</li>
                    </Link>
                    <Link className="link" to="/terms">
                      <li>Terms</li>
                    </Link>
                      <li>|</li>
                      <li>{username}</li>
                    <Link className="link" to="/signin">
                      <li onClick={this.logout}>Logout</li>
                    </Link>
                </ul>
            </nav>
        );
    }
}

export default Nav;