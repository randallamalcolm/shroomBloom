import React from 'react';


//no state, so we remove "this." and use a stateless function rather than  class...
const FormWater = (props) => (
  
            <form onSubmit={props.getWater}>
                <select name="river_code">
                    <option value="" selected disabled hidden>Choose River</option>
                    <option value="14299800">Nehalem River</option>
                    <option value="14183000">Santiam River</option>
                    <option value="14046500">John Day River</option>
                    <option value="14242580">Toutle River</option>
                </select>
                <span>   </span>
                <button>Generate Report!</button>
                
            </form>
        );

export default FormWater;