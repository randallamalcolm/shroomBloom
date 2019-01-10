import React from 'react';

//no state, so we remove "this." and use a stateless function rather than  class...
const Titles = () => (
            <div> 
              <h1 className="title-container__title">Shroom Bloom</h1>
              <p className="title-container__subtitle">Powered by Mushroom Observer</p>
            </div>
        );


export default Titles;