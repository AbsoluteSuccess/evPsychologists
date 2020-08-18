import React from 'react';
import {getFromStorage} from '../../utils/storage';
import {Link} from 'react-router-dom';
import './Main.css';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {isLoading: true,
      token: '',
      reviews: [],
      reviewsError: '',
      info: []};

    this.fetchReviews = this.fetchReviews.bind(this);
  }

  fetchReviews() {
    fetch(`api/review/ave`)
    .then(res => res.json())
    .then(json => {
      if(json.success) {
        this.setState({isLoading: false,
          info: json.result});
      }
    }); 
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
            this.setState({token});
            this.fetchReviews();
          } else {
            this.setState({isLoading: false});
          }
        })
    } else {
      this.setState({isLoading: false});
    }
  }

  render(){
    const {isLoading,
      token,
      reviewsError,
      info} = this.state;
    
    if(isLoading) {
      return (<div className="main" id="small-main"><h3>Loading...</h3></div>);
    }
    if(reviewsError) {
      return (<div className="main" id="small-main"><h3>{reviewsError}</h3></div>);
    }
    if(!token) {
      return (<div className="main" id="small-main">
              <h2>You must be signed in to have access to this website!</h2><br/><br/>
              <div><Link className="link-main" id="no-token" to="/signin">Sign in</Link> or <Link className="link-main" id="no-token" to="signup">Sign up</Link></div>
            </div>);
    } 
    
    return (<ul>
      <li className="psychologist" id="li">
        <h3>Temirlan Yechshanov</h3> 
        <div className="main-ave">{info[0].ave} / 5.00</div>
        <div className="main-reviews">{info[0].reviews} reviews</div>
        <Link to="temirlan-yechshanov">
          <button className="signin" id="navigate-main">Navigate to page</button>
        </Link>
      </li>
      <li className="psychologist" id="li">
        <h3>Rufiya Omarova</h3>
        <div className="main-ave">{info[1].ave} / 5.00</div>
        <div className="main-reviews">{info[1].reviews} reviews</div>
        <Link to="rufiya-omarova">
          <button className="signin" id="navigate-main">Navigate to page</button>
        </Link>
      </li>
      <li className="psychologist" id="li">
        <h3>Nazira Saugabayeva</h3>
        <div className="main-ave">{info[2].ave} / 5.00</div>
        <div className="main-reviews">{info[2].reviews} reviews</div>
        <Link to="nazira-saugabayeva">
          <button className="signin" id="navigate-main">Navigate to page</button>
        </Link>
      </li>
      <li className="psychologist" id="li">
        <h3>Alina Zhanmurzina</h3>
        <div className="main-ave">{info[3].ave} / 5.00</div>
        <div className="main-reviews">{info[3].reviews} reviews</div>
        <Link to="alina-zhanmurzina">
          <button className="signin" id="navigate-main">Navigate to page</button>
        </Link>
      </li>
      <li className="psychologist" id="li">
        <h3>Olga Zhuravleva</h3>
        <div className="main-ave">{info[4].ave} / 5.00</div>
        <div className="main-reviews">{info[4].reviews} reviews</div>
        <Link to="olga-zhuravleva">
          <button className="signin" id="navigate-main">Navigate to page</button>
        </Link>
      </li>
      <li className="psychologist" id="li">
        <h3>Natalya Nesterenko</h3>
        <div className="main-ave">{info[5].ave} / 5.00</div>
        <div className="main-reviews">{info[5].reviews} reviews</div>
        <Link to="natalya-nesterenko">
          <button className="signin" id="navigate-main">Navigate to page</button>
        </Link>
      </li>
    </ul>);
  }
}

export default Main;