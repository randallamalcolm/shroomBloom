import React from 'react';

//no state, so we remove "this." and use a stateless function rather than  class...
const FormWeather = props => (
   
            <form onSubmit={props.getWeather}>
                <button class="formButton">Local Weather</button>
            </form>
        );


export default FormWeather;
