import React, { Component } from 'react';
// Components
import GoogleMap from 'google-map-react';


export default class Map extends Component {
    constructor(props) {
        super(props);
        this.defaultCenter = { lat: 0, lng: 0 };
        this.defaultZoom = 0;
    }

    render() {
        const { center, zoom, children } = this.props;

        return (
            <div style={{ width: '600px', height: '600px' }}>
                <GoogleMap
                    bootstrapURLKeys={{
                        key: 'AIzaSyAKweXQ1Ah69jxPwrnFNQ0b4slsWkKPku4',
                        language: 'en',
                    }}
                    center={center}
                    zoom={zoom}
                    defaultCenter={this.defaultCenter}
                    defaultZoom={this.defaultZoom}
                >
                    {children}
                </GoogleMap>
            </div>
        );
    }
}