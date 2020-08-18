import React from 'react';
import {getFromStorage} from '../../utils/storage';
import './Psychologist.css';
import {Link} from 'react-router-dom';

class Psychologist extends React.Component {
    constructor(props) {
        super(props);
        
        const psychologists = ["temirlan-yechshanov",
            "rufiya-omarova",
            "nazira-saugabayeva",
            "alina-zhanmurzina",
            "olga-zhuravleva",
            "natalya-nesterenko"];
    
        let name = this.props.match.params.psychologist;
        const found = psychologists.find(el => el === name);

        if(found) {
            name = name.charAt(0).toUpperCase() + name.substring(1);
            for(let i = 0; i < name.length; i++) {
                if(name.charAt(i) === '-') {
                    name = name.substring(0, i) + ' ' + name.substring(i + 1, name.length);
                    name = name.substring(0, i + 1) + name.charAt(i + 1).toUpperCase() + name.substring(i + 2, name.length);
                    break;
                }
            }
        }

        this.state = {psychologist: name,
            isLoading: true,
            review: '',
            error: '',
            reviews: [],
            notFound: found ? false : true,
            token: '',
            username: '',
            checked: false,
            reviewsError: '',
            grade: -1,
            selectVal: ''};
        
        this.onTexboxChangeReview = this.onTexboxChangeReview.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onCheckboxChange = this.onCheckboxChange.bind(this);
        this.fetchReviews = this.fetchReviews.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
    }

    onTexboxChangeReview(event) {
        this.setState({review: event.target.value,
            error: ''});
    }

    onCheckboxChange(event) {
        this.setState({checked: !this.state.checked});
    }

    onSelectChange(event) {
        this.setState({selectVal: event.target.value});
    }

    calculateAve() {
        const {reviews, psychologist} = this.state;
        let total = 0, n = 0;
        reviews.forEach(el => {
            if(el.psychologist === psychologist) {
                total += el.grade;
                n++;
            }
        });
        n === 0 ? this.setState({grade: 0, isLoading: false}) : this.setState({grade: total/n, isLoading: false}); 
    }

    fetchReviews() {
        fetch(`api/review?psychologist=${this.state.psychologist}`)
         .then(res => res.json())
         .then(json => {
             if(json.success) {
                this.setState({reviews: json.reviews});
                this.calculateAve();
             } else {
                this.setState({reviewsError: json.message});
             }
         });
    }

    componentDidMount() {
        const obj = getFromStorage('the_main_app');    
        if(obj && obj.token) { 
          const {token} = obj;

          fetch(`/api/account/verify?token=${token}`)
            .then(res => res.json())
            .then(json => {
                if(json.success) {
                this.setState({token,
                    username: json.username});
                this.fetchReviews();
                } else {
                this.setState({isLoading: false});
                }
            })
        } else {
          this.setState({isLoading: false});
        }
    }

    onSubmit() {
        const {psychologist,
            review,
            checked,
            username,
            selectVal} = this.state;
        const author = checked ? 'Anonymous' : username;
        this.setState({isLoading: true});
        fetch('/api/review', { 
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({psychologist,
                author,
                review,
                grade: selectVal})
        }).then(response => response.json())
          .then(json => {
            this.setState({error: json.message,
                isLoading: false,
                review: '',
                checked: false});
            this.fetchReviews();
          });
    }

    getDate(timeStamp) {
        const year = timeStamp.substr(0, 4);
        let month = timeStamp.substr(5, 2);
        const day = timeStamp.substr(8, 2);
        switch(month) {
            case '01':
                month = 'January';
                break;
            case '02':
                month = 'February';
                break;
            case '03':
                month = 'March';
                break;
            case '04':
                month = 'April';
                break;
            case '05':
                month = 'May';
                break;
            case '06':
                month = 'June';
                break;
            case '07':
                month = 'July';
                break;
            case '08':
                month = 'August';
                break;
            case '09':
                month = 'September';
                break;
            case '10':
                month = 'October';
                break;
            case '11':
                month = 'November';
                break;
            case '12':
                month = 'December';
                break;
            default:
        }
        return `${month} ${day}, ${year}`;
    }
 
    render(){
        const {psychologist,
            isLoading,
            review,
            error,
            notFound,
            token,
            reviews,
            grade,
            selectVal} = this.state;
        if(notFound) {
            return (<div className="main" id="small-main"><h3>Not found</h3></div>);
        }
        if(isLoading) {
            return (<div className="main" id="small-main"><h3>Loading...</h3></div>);
        }
        if(!token) {
            return (<div className="main" id="small-main">
                    <h2>You must be signed in to have access to this website!</h2><br/><br/>
                    <div><Link className="link-main" id="no-token" to="/signin">Sign in</Link> or <Link className="link-main" id="no-token" to="signup">Sign up</Link></div>
                </div>);
        }

        let errorColor;
        if(error === 'Review successfully sent')  {
          errorColor = {color: '#3069f0'};
        } else {
          errorColor = {color: '#bf2e2c'};
        }

        return (<div className="specific-psychologist">
            <h1>{psychologist} | {grade.toFixed(2)}</h1>
            <h2 id="post-your">Post your review:</h2>
            <div className="main" id="post"> 
                <input id="anonymously" name="anonymously" type="checkbox" onChange={this.onCheckboxChange}/>
                <label id="label-anonymously" htmlFor="anonymously">Post my review anonymously</label><br/>
                <textarea rows="5" cols="30" name="review" value={review} onChange={this.onTexboxChangeReview}></textarea><br/>
                <select value={selectVal} onChange={this.onSelectChange}>
                    <option value="">Select Grade</option>
                    <option value="1">1</option>
                    <option value="2">2</option> 
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select><br/>
                {(error) ? (<p className="error" style={errorColor}>{error}</p>) : (null)}
                <button onClick={this.onSubmit} className="signin" id="post-button">Submit</button>
            </div>
            <h2 id="post-your">Recent results:</h2>
            {reviews.slice(0).reverse().map(el => (<div key={el._id} className="psychologist" id="review">
                <div className="review-author">
                    <div className="review-upper">{el.author}</div>
                    <div id="date">{this.getDate(el.timeStamp)}</div>
                    <div className="review-upper" id="review-grade">Grade: {el.grade}</div>
                </div>
                <div className="review-text">{el.review}</div> 
            </div>))}
        </div>);
    }
}

export default Psychologist;