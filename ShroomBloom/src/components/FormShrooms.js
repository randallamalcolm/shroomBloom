import React from 'react';

//no state, so we remove "this." and use a stateless function rather than  class...
const FormShrooms = props => (
        
            <form onSubmit={props.getShrooms}>
            <br />
                <button class="formButton">Shrooms!</button>
            </form>
        );


export default FormShrooms;
