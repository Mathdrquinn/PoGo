import React, { Component } from 'react';

export default class Footer extends Component {
    constructor() {
        super()
    }

    componentWillMount() {
        console.log('Footer Component');
    }

    render() {
        const style = {
            background: 'pink',
            padding: '5px',
        };

        return (
            <footer style={style}>
                <p>The Footer</p>
            </footer>
        )
    }
}