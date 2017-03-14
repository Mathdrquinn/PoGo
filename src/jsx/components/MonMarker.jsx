import React, { Component } from 'react';

export default class MonMarker extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const size = 20;
        const { lat, lng, number, name } = this.props;
        const source = `http://veekun.com/dex/media/pokemon/dream-world/${number}.svg`;

        const style = {
            display: 'inline-block',
            position: 'relative',
            left: `-${size / 2}px`,
            top: `-${size / 2}px`,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            backgroundColor: '#AA0000',
            border: '3px solid #FFFFFF',
            boxSizing: 'border-box',
            boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.8)',
        };
        const imageStyle = {
            width: `${size}px`,
            height: `${size}px`,
        };

        return (
            <div style={style} lat={lat} lng={lng}>
                <img style={imageStyle} src={source} alt={name}/>
            </div>
        );
    }
}