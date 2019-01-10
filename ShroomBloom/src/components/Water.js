import React from 'react';



//no state, so we remove "this." and use a stateless function rather than  class...
const Water = props => (
            <div class="form-text">
            <br />
                { props.river_name && <p>{props.river_name}</p>}
                { props.gageHeight && (props.gageHeight > props.minus3gageHeight) && <h4><span>⬆️ </span>This river has RISEN {(props.gageHeight - props.minus3gageHeight).toPrecision(1)} ft. in the past three days.</h4>}
                { props.gageHeight && (props.gageHeight < props.minus3gageHeight) && <h4><span>⬇️ </span>This river has FALLEN {(props.minus3gageHeight - props.gageHeight).toPrecision(1)} ft. in the past three days.</h4>}
                {/*{ props.sample_time && <p>Sample Time: {props.sample_time}</p>}*/}
                <div >
                { props.gageHeight&& <p>Gage Height Today: {props.gageHeight} (ft)</p>}
                { props.minus3gageHeight && <p>Gage Height Three Days Ago(ft) (ft): {props.minus3gageHeight}</p>}
                </div>
                {/*{ props.latitude && <p>Latitude: {props.latitude}, Longitude: {props.longitude}</p>}*/}               
            </div>
        );
    


export default Water;