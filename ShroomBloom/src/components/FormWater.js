import React, { Component } from 'react';


//no state, so we remove "this." and use a stateless function rather than  class...
class FormWater extends Component {
    render() {
        
        const { riverList, riverCodes, riverSourceInfo } = this.props;
        const newArray = [];

        const riverSourceInfoList = riverSourceInfo.map(name => {
            return (
                <option value={name.siteCode[0].value}>{name.siteName}</option>
            )
        });
        
        
        

        return (
            <div>
            <form onSubmit={this.props.getWater}>
                <br />
                <br />


                <select name="river_code" class="formButton">
                <input type="text" placeholder="Search.." id="myInput" onkeyup="filterFunction()"></input>
                <option value="" selected disabled hidden>Choose River</option>
                  {riverSourceInfoList}
                </select>
                <br />
                <br />
                <span>   </span>
                <button class="formButton">River Conditions</button>
                <br />
            </form>
            <br />
            <button onClick={this.props.getShroomsButton} class="formButton">Shrooms</button>
            </div>
        );
    }    
}

export default FormWater;