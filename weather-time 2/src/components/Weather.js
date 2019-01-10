import React from 'react';

//no state, so we remove "this." and use a stateless function rather than  class...
const Weather = props => (

        <div>
        { props.city && props.country && <h4>Location: {props.city}, {props.country}</h4>}
        { props.description && <p>☀️ Conditions: {props.description}</p>}
        { props.temperature && <p>Temperature: {props.temperature}, Max Temp: {props.temp_max}</p>}
        { props.humidity && <p>Humidity: {props.humidity}</p>}
        { props.error && <p>{props.error}</p>}
        </div>
    );

export default Weather;