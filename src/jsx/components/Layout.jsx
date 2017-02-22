import React, { Component } from 'react';

import Footer from './Footer';
import Header from '../containers/Header';

export default class Layout extends Component {
    constructor() {
        super()
    }
    
    componentWillMount() {
        console.log('Layout Component');
    }
    
    render() {
        return(
            <div>
                <Header/>
                <h1>Layout</h1>
                <Footer/>
            </div>
        )
    }
}