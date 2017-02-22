// Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
// Components
import Title from '../components/Title';
// Actions
import { signInUser } from '../../actions/userActions';

@connect((store) => {
    const title = store.app.name;
    const user = store.user;
    return {
        title,
        user,
    }
})
export default class Header extends Component {
    constructor() {
        super()
        const initState = {
            username: '',
            password: '',
        }
        this.state = initState;
    }

    componentWillMount() {
        console.log('Header Component');
    }

    changeTitle(newTitle) {
        // this.props.dispatch(updateTitle(newTitle))
    }

    updatePassword(password) {
        const newState = { ...this.state, password };
        this.setState(newState);
    }

    updateUsername(username) {
        const newState = { ...this.state, username };
        this.setState(newState);
    }

    login() {
        const { state } = this;
        const { username, password } = state;
        console.log(username, password);
        this.props.dispatch(signInUser(username, password));
    }

    signOut() {

    }

    render() {
        const style={
            background: 'cadetblue',
            padding: '5px',
        };

        const { user } = this.props;

        if (user.loading) {
            return (
                <header style={style}>
                    <p><Title title={this.props.title}/></p>
                    <p>Loading User...</p>
                </header>
            )
        }

        if (user.error) {
            return (
                <header style={style}>
                    <p><Title title={this.props.title}/></p>
                    <p>Sign in Error...</p>
                </header>
            )
        }

        return (
            <header style={style}>
                <p><Title title={this.props.title}/></p>
                <div>
                    <input type="text"
                           value={this.state.username}
                           placeholder="username"
                           onChange={(e) => this.updateUsername(e.target.value)}
                    />
                    <input type="text"
                           value={this.state.password}
                           placeholder="password"
                           onChange={(e) => this.updatePassword(e.target.value)}
                    />
                    <button onClick={this.login.bind(this)}>Login</button>
                </div>
            </header>
        )
    }
}