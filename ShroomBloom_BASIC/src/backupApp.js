import React from 'react';
import Titles from './components/Titles';
import FormWater from './components/FormWater';
import FormShrooms from './components/FormShrooms';
import FormWeather from './components/FormWeather';
import Weather from './components/Weather';
import Water from './components/Water';
import Shrooms from './components/Shrooms';
import Banner from './components/Banner';
import Chart from './components/Chart';



const API_KEY = "51b8adf4b7d97d20789533ec66be747d";

class App extends React.Component {
  state = {
    //WEATHER STATE
    temperature: undefined,
    city: undefined,
    temp_max: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    error: undefined,
    
    //RIVER STATE
    river_name: undefined,
    sample_time: undefined,
    gageHeight: undefined,
    minus3gageHeight: undefined,
    latitude: undefined,
    longitude: undefined,

  }
  
  getWeather = async (e) => {
    e.preventDefault();
    const latitude = this.state.latitude;
    const longitude = this.state.longitude;
    const start = 1538158750;
    const end = 1538158750;
    const api = "51b8adf4b7d97d20789533ec66be747d";
    const api_call = await fetch(`http://history.openweathermap.org/data/2.5/history/city?lat=${latitude}&lon=${longitude}&appid=51b8adf4b7d97d20789533ec66be747d&type=hour&start=${start}&end=${end}`);
    const data = await api_call.json();
    if (latitude && longitude) {
      console.log("FETCHING DATA from OpenWeather..."),
      console.log(data);
     this.setState({
      temperature: data.main.temp,
      temp_max: data.main.temp_max,
      city: data.name,
      country: data.sys.country,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      error: ""
    });
  } else {
    this.setState({
      temperature: undefined,
      temp_max: undefined,
      city: undefined,
      country: undefined,
      humidity: undefined,
      description: undefined,
      error: "Please select a river."
   });
  }
  }

  
  getWeather = async (e) => {
    e.preventDefault();
    const latitude = this.state.latitude;
    const longitude = this.state.longitude;
    const api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=51b8adf4b7d97d20789533ec66be747d&units=imperial`);
    const data = await api_call.json();
    if (latitude && longitude) {
      console.log("FETCHING DATA from OpenWeather..."),
      console.log(data);
     this.setState({
      temperature: data.main.temp,
      temp_max: data.main.temp_max,
      city: data.name,
      country: data.sys.country,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      error: ""
    });
  } else {
    this.setState({
      temperature: undefined,
      temp_max: undefined,
      city: undefined,
      country: undefined,
      humidity: undefined,
      description: undefined,
      error: "Please select a river."
   });
  }
  }
  

  getWater = async (e) => {
    e.preventDefault();
    const myRiver = e.target.elements.river_code.value;
    //const city = e.target.elements.city.value;
    //const country = e.target.elements.country.value;
    const river_api_call = await fetch(`https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${myRiver}&period=P110D&parameterCd=00060,00065&siteStatus=all`);
    const data = await river_api_call.json();
     console.log("FETCHING DATA from USGS..."),
     console.log(data);
     const sample_time = data.value.timeSeries[1].values[0].value;
     const riverGageArray = data.value.timeSeries[1].values[0].value;
     var count = 0;
     var totalHeight = 0;
     //const myCount = 0;
     
     console.log("My river gage array looks like this: ", riverGageArray);
     console.log("My array length is: ", riverGageArray.length);
     for (let i=29; i < riverGageArray.length; i++) {
       const then = Number(riverGageArray[i-28].value);
       const now = Number(riverGageArray[i].value);
       count++;
       totalHeight += now;
       var heightAverage = totalHeight / count;
       console.log(i, now, sample_time[i].dateTime);
       if ((now - then) > (heightAverage * .06)) {
        console.log(
           "Then: ", then,
           "Now: ", now,
           "Difference: ", (now - then), 
           "Count: ", count,
           "Total Height: ", totalHeight,
           "Height Ave: ", heightAverage,
           "Date: ", sample_time[i-28].dateTime,

         );
         return console.log("River climb beginning on ", sample_time[i-28].dateTime, heightAverage);

       }
       
     }
     

     this.setState({
     //water state
     river_name: data.value.timeSeries[0].sourceInfo.siteName,
     sample_time: data.value.timeSeries[1].values[0].value[0].dateTime,
     gageHeight: data.value.timeSeries[1].values[0].value[280].value,
     minus3gageHeight: data.value.timeSeries[1].values[0].value[0].value,
     latitude: data.value.timeSeries[1].sourceInfo.geoLocation.geogLocation.latitude,
     longitude: data.value.timeSeries[1].sourceInfo.geoLocation.geogLocation.longitude,
     error: "",
     });
  } 

  
    getShrooms = async (e) => {
    e.preventDefault();
    console.log("FETCHING DATA from Mushroom Observer...");
    const latitude = this.state.latitude;
    const longitude = this.state.longitude;
    const api_call = await fetch(`https://bison.usgs.gov/api/search.jsonp?params=resourceID%3A(%22318%2C1902%22+)%3BproviderID%3A(%22318%22+)%3BbasisOfRecord%3A(specimen)`);
    const data = await api_call.json();
    if (latitude && longitude) {
      console.log("Successfully!!! FETCHING DATA from Mushroom Observer..."),
      console.log(data);
  }
  }


  componentDidUpdate() {
    console.log("LOADING MAP!");
    this.renderMap()
  }

  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBVjkvnmk3zfwOBs05NpxnElDdb2g_RmQs&callback=initMap")
    window.initMap = this.initMap
  }

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: this.state.latitude, lng: this.state.longitude},
      zoom: 14
    });
  }

  

  render() {
    return (

      
        <div className="wrapper">
            <div className="container">
              
              <div className="row">
              <div className="col-xs-1"></div>
                <div className="col-xs-4 title-container">
                </div>
                
                <div className="col-xs-7 form-container">
                <Titles/>
                <FormWater getWater={this.getWater} />
                <Water river_name={this.state.river_name}
                sample_time={this.state.sample_time}
                gageHeight={this.state.gageHeight}
                minus3gageHeight={this.state.minus3gageHeight}
                latitude={this.state.latitude}
                longitude={this.state.longitude}
                />
               <br />
               <FormWeather getWeather={this.getWeather}/>
               <Weather latitude={this.state.latitude}
              longitude={this.state.longitude}
              temperature={this.state.temperature}
              temp_max={this.state.temp_max}
              city={this.state.city}
              country={this.state.country}
              humidity={this.state.humidity}
              description={this.state.description}
              error={this.state.error}
               />
               <FormShrooms getShrooms={this.getShrooms}/>
               <Chart />
              </div>
             
            </div>
          </div>
          <div className="col-xs-7" id="map">
                </div>
                <div className="col-xs-1"></div>
        </div>
  
    );
  }
}

//<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"
//async defer></script>

function loadScript(url) {
  var index = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}

export default App;