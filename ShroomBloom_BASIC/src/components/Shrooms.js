import React from 'react';

//no state, so we remove "this." and use a stateless function rather than  class...
const Shrooms = props => (

        <div className="form-text">
        { props.city && props.country && <h4>Location: {props.city}, {props.country}</h4>}
        { props.description && (props.description === "clear sky") && <h1>☀️</h1>}
        { props.description && (props.description === "light rain") && <h1>🌧 </h1>}
        { props.description && <p>Conditions: {props.description}</p>}
        { props.temperature && <p>Temperature: {props.temperature}, Max Temp: {props.temp_max}</p>}
        { props.humidity && <p>Humidity: {props.humidity}</p>}
        { props.error && <p>{props.error}</p>}
        </div>
    );

export default Shrooms;