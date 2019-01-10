import React from 'react';

//no state, so we remove "this." and use a stateless function rather than  class...
const Water = props => (
       
            <div>
                { props.river_name && <h4>River Details:</h4>}
                { props.river_name && <h3 color="Green">{props.river_name}</h3>}
                { props.sample_time && <p>Sample Time: {props.sample_time}</p>}
                { props.gageHeight&& <p>Gage Height(ft): {props.gageHeight}</p>}
                { props.latitude && <p>Latitude: {props.latitude}, Longitude: {props.longitude}</p>}               
            </div>
        );
    


export default Water;