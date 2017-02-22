import React, { Component } from 'react';

export default class Title extends Component {
    constructor() {
        super()
    }

    componentWillMount() {
        console.log('Title Component');
    }

    render() {
        const style = {
            color: 'blue',
        };

        return (
            <span style={style}>{this.props.title}</span>
        );
    }
}