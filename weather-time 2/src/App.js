import React from 'react';
import Titles from './components/Titles';
import FormWater from './components/FormWater';
import FormWeather from './components/FormWeather';
import Weather from './components/Weather';
import Water from './components/Water';
import Banner from './components/Banner'



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
    latitude: undefined,
    longitude: undefined,

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
    const river_api_call = await fetch(`https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${myRiver}&parameterCd=00060,00065&siteStatus=all`);
    const data = await river_api_call.json();
     console.log("FETCHING DATA from USGS..."),
     console.log(data);
     this.setState({
     //water state
     river_name: data.value.timeSeries[0].sourceInfo.siteName,
     sample_time: data.value.timeSeries[1].values[0].value[0].dateTime,
     gageHeight: data.value.timeSeries[1].values[0].value[0].value,
     latitude: data.value.timeSeries[1].sourceInfo.geoLocation.geogLocation.latitude,
     longitude: data.value.timeSeries[1].sourceInfo.geoLocation.geogLocation.longitude,
     error: "",
     });
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
      zoom: 15
    });
  }

  

  render() {
    return (
      <div align="center">
        <Banner />
        <Titles />
        {/*<Form getWeather={this.getWeather} />
        <Weather 
          temperature={this.state.temperature}
          city={this.state.city}
          temp_max={this.state.temp_max}
          country={this.state.country}
          humidity={this.state.humidity}
          description={this.state.description} 
          error={this.state.error}
        />*/}
        <FormWater getWater={this.getWater} />
        <Water river_name={this.state.river_name}
         sample_time={this.state.sample_time}
         gageHeight={this.state.gageHeight}
         latitude={this.state.latitude}
         longitude={this.state.longitude}
        />
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
        <div id="map"></div>
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