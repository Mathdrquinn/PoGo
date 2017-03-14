import React, { Component } from 'react';
import Map from './Map';
import WayFinderMarker from './WayFinderMarker';
import MonMarker from './MonMarker';

import { watchWayFinderLocations, watchPokemon } from '../../../util/firebase';

export default class Layout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            locations: [],
            pokemon: [],
        };

    }

    pushLocation(loc) {
        const state = this.state;
        const locations = state.locations.slice();
        const hitMaxCount = locations.length === 10;

        if (hitMaxCount) {
            locations.pop();
        }

        locations.unshift(loc);

        this.setState({ ...state,  locations })
    }

    pushPokemon(mon) {
        const state = this.state;
        const pokemon = state.pokemon.slice();

        pokemon.unshift(mon);

        this.setState({ ...state, pokemon })
    }
    
    componentWillMount() {
        console.log('Layout Component');
        watchWayFinderLocations((location) => {
            this.pushLocation(location);
        });

        watchPokemon((mon) => {
            this.pushPokemon(mon);
        });
    }

    renderWayFinder() {
        const { locations, pokemon } = this.state;
        const currentLocation = locations[0];

        return(
            <div>
                <h1>Layout</h1>
                <Map center={currentLocation} zoom={18}>
                    {locations.map((loc, index) => {
                        return (<WayFinderMarker lat={loc.lat} lng={loc.lng} opacity={(10-index)/10} key={loc.key}></WayFinderMarker>)
                    })}
                    {pokemon.map((mon, index) => {
                        return (<MonMarker lat={mon.lat} lng={mon.lng} number={mon.number} key={mon.key}></MonMarker>)
                    })}
                </Map>
                <div>
                    {this.state.locations.map((loc) => {
                        return (
                            <p key={loc.key}>The wayFinder was at Lat: {loc.lat} Lng: {loc.lng} at {new Date(loc.time).toDateString()}</p>
                        )
                    })}
                </div>
            </div>
        )
    }
    
    render() {
        const currentLocation = this.state.locations[0];

        if (currentLocation) {
            return this.renderWayFinder();
        }

        return(
            <div>
                <h1>Layout</h1>
                <Map center={currentLocation} zoom={18}></Map>
                <div>
                    {this.state.locations.map((loc) => {
                        return (
                            <p key={loc.key}>The wayFinder was at Lat: {loc.lat} Lng: {loc.lng} at {new Date(loc.time).toDateString()}</p>
                        )
                    })}
                </div>
            </div>
        )
    }
}