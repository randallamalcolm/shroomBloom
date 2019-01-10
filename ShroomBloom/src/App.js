import React from 'react';
import Titles from './components/Titles';
import FormWater from './components/FormWater';
import FormShrooms from './components/FormShrooms';
import FormWeather from './components/FormWeather';
import Weather from './components/Weather';
import Water from './components/Water';
import Shrooms from './components/Shrooms';
import Banner from './components/Banner';
import ChartWater from './components/ChartWater';
import ChartShrooms from './components/ChartShrooms';



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
    riverData: undefined,
    riverGageData: undefined,
    riverLabels: undefined,
    riverCodes: [],
    riverList: [],
    riverSourceInfo: [],

    riverDatesAndShroomCount: undefined,
    shroomData: undefined,
    shroomDates: undefined,
    shroomId: undefined,
    myShroomData: undefined,

    waterArrayDates: undefined,
    waterArrayGageValues: undefined,
    waterArrayShrooms: undefined,
    myWaterArrayShrooms: undefined
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
    //console.log("Received myRiver: ", myRiver);
    //const city = e.target.elements.city.value;
    //const country = e.target.elements.country.value;
    const river_api_call = await fetch(`https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${myRiver}&period=P100D&parameterCd=00060,00065&siteStatus=all`, {method: "GET"});
    const data = await river_api_call.json();
     console.log("Fetching river gage data from USGS..."),
     console.log(data);
     const sample_time = data.value.timeSeries[1].values[0].value;
     const riverGageArray = data.value.timeSeries[1].values[0].value;
     var count = 0;
     var totalHeight = 0;
     //const myCount = 0;
     const chartLabelArray =[];
     const chartDataArray=[];

     //console.log("My river gage array looks like this: ", riverGageArray);
     //console.log("My array length is: ", riverGageArray.length);
    var waterArrayDates = [];
    var waterArrayGageValues = [];
    var waterArrayShrooms = [];


    var newArray = [];
     for (let i=0; i<riverGageArray.length; i++) {
       waterArrayDates.push((sample_time[i].dateTime).substr(0,10));
       waterArrayGageValues.push(Number(riverGageArray[i].value));
       waterArrayShrooms.push(0);
       newArray.push({"date": ((sample_time[i].dateTime).substr(0,10)), "riverGage": Number(riverGageArray[i].value), "shroomValue": 0});
    };  
    console.log("NEW ARRAY: ", newArray);
     for (let i=1; i < riverGageArray.length; i++) {
       const then = Number(riverGageArray[i-1].value);
       const now = Number(riverGageArray[i].value);
       count++;
       chartLabelArray.push((sample_time[i].dateTime).substr(0,10));
       chartDataArray.push(Number(riverGageArray[i].value));
       totalHeight += now;
       var heightAverage = totalHeight / count;
       /*console.log(i, now, sample_time[i].dateTime);

        if ((now - then) > (heightAverage * .06)) {
        console.log(
           "Then: ", then,
           "Now: ", now,
           "Difference: ", (now - then), 
           "Count: ", count,
           "Total Height: ", totalHeight,
           "Height Ave: ", heightAverage,
           "Date: ", sample_time[i-1].dateTime,
         );
         return console.log("River climb beginning on ", sample_time[i-1].dateTime, heightAverage);
       }*/    
     }
     this.setState({
     //water state
     river_name: data.value.timeSeries[0].sourceInfo.siteName,
     sample_time: data.value.timeSeries[1].values[0].value[0].dateTime,
     gageHeight: data.value.timeSeries[1].values[0].value[0].value,
     minus3gageHeight: data.value.timeSeries[1].values[0].value[0].value,
     latitude: data.value.timeSeries[1].sourceInfo.geoLocation.geogLocation.latitude,
     longitude: data.value.timeSeries[1].sourceInfo.geoLocation.geogLocation.longitude,
     error: "",
     riverData: data,
     riverLabels: chartLabelArray,
     riverGageData: chartDataArray,
     riverDatesAndShroomCount: newArray,

     waterArrayDates,
     waterArrayGageValues,
     waterArrayShrooms,
     });
     //this.getShrooms();
  } 



  getRiverList = async (e) => {
    const river_api_call = await fetch(`https://waterservices.usgs.gov/nwis/iv/?format=json&stateCd=or&parameterCd=00060,00065&siteType=ST&siteStatus=active`, {method: "GET"});
    const data = await river_api_call.json();
    console.log("Fetching river list from USGS...");
    const myRiverList = [];
    const myRiverCodes = [];
    const myRiverSourceInfo = [];
    const myIndexArray = data.value.timeSeries;
    for (let i = 0; i < myIndexArray.length; i++) {
      myRiverSourceInfo.push(myIndexArray[i].sourceInfo);
      myRiverList.push(myIndexArray[i].sourceInfo.siteName);
      myRiverCodes.push(myIndexArray[i].sourceInfo.siteCode[0].value);
    };
    this.setState({
      riverList: myRiverList,
      riverCodes: myRiverCodes,
      riverSourceInfo: myRiverSourceInfo,
      })
    
  } 

  getChartData() {
    this.setState
  }

  getShroomsButton = async (e) => {
    const shroom_api_call = await fetch(`https://mushroomobserver.org/api/observations?children_of=boletus&format=json&detail=high&date=2018`);
    const data = await shroom_api_call.json();
    console.log("Fetching getShroomsButton pushed, data: ", data);
    console.log("PAGE COUNT", data.number_of_pages);
    var newArray = [];
    for (let i = 1; i <= data.number_of_pages; i++) {
      const shroom_api_call = await fetch(`https://mushroomobserver.org/api/observations?children_of=boletus&format=json&detail=high&date=2018&page=${i}`);
      const data = await shroom_api_call.json();
      var myIndexArray = data.results;
      for (let j=0; j<myIndexArray.length; j++) {
      newArray.push({"date": myIndexArray[j].date, "Species": myIndexArray[j].consensus.name, "shroomValue": 1});
    };  
    newArray.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.date) + new Date(a.date);
    });
      console.log("Fetching getShroomsButton pushed, data: ", i);
    }

    /*
    var newArray = [];
     for (let i=0; i<myIndexArray.length; i++) {
       newArray.push({"date": myIndexArray[i].date, "Species": myIndexArray[i].consensus.name, "shroomValue": 1});
    };  
    newArray.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.date) + new Date(a.date);
    });
    */
    console.log("My crazy new array: ", newArray);
    this.setState({
      myShroomData: data,
    })
  }

  getShrooms = async (e) => {
    var latitude = this.state.latitude;
    var longitude = this.state.longitude;
    const shroom_api_call = await fetch(`https://mushroomobserver.org/api/observations?children_of=boletus&format=json&date=2018&north=${latitude+4}&south=${latitude-4}&east=${longitude+4}&west=${longitude-4}&detail=high`);
    const data = await shroom_api_call.json();
    console.log("Fetching data from Mushroom Observer...", data);
    const myIndexArray = data.results;
    const shroomObject = {};
    const myShroomDates =[];
    const myShroomId=[];
    for (let i = 0; i < myIndexArray.length; i++) {
      console.log(myIndexArray[i].consensus.name, " sited ", myIndexArray[i].date, "@", myIndexArray[i].location.name);
      myShroomDates.push(myIndexArray[i].date);
      myShroomId.push(-(myIndexArray[i].id));
    }
    myShroomDates.sort((a,b)=> b-a);
    
  
    var myWaterArrayShrooms = [];
    
    /*
    for (let i = 0; i < myShroomDates.length; i++) {
      for (let j = 0; j < this.state.waterArrayDates.length; j++) {
        console.log(myShroomDates[i], this.state.waterArrayDates[j]);
        if (myShroomDates[i] === this.state.waterArrayDates[j]) {
          this.setState({waterArrayShrooms[j]: waterArrayShrooms[j]++});
          console.log(this.state.waterArrayShrooms[j]);
        };
      };    
    };
    */ 

    for (let i=0; i<this.state.waterArrayShrooms.length; i++) {
        myWaterArrayShrooms.push(this.state.waterArrayShrooms[i]);
    }

    for (let i = 0; i < myShroomDates.length; i++) {
      for (let j = 0; j < this.state.waterArrayDates.length; j++) {
        console.log(myShroomDates[i], this.state.waterArrayDates[j]);
        if (myShroomDates[i] === this.state.waterArrayDates[j]) {
          console.log("MATCH!", myShroomDates[i], this.state.waterArrayDates[j]);
          myWaterArrayShrooms[j]++;
          console.log(myWaterArrayShrooms[j]);
        };
      };    
    }; 
    
    console.log("ATTENTION: ", this.state.waterArrayShrooms);
    //console.log("arrayWaterDates: ", arrayWaterDates);
    
    console.log(myShroomDates);
    this.setState({
      shroomData: data,
      shroomDates: myShroomDates,
      shroomId: myShroomId,
      waterArrayShrooms: myWaterArrayShrooms,
      myWaterArrayShrooms: myWaterArrayShrooms,
    })
    console.log("ATTENTION 2: ", this.state.myWaterArrayShrooms);
  } 

  /*
  getFish = async (e) => {
    const shroom_api_call = await fetch(`https://mushroomobserver.org/api/observations?children_of=boletus&format=json&date=2016-2018&north=${latitude+2}&south=${latitude-2}&east=${longitude+2}&west=${longitude-2}&detail=high`);
    const data = await shroom_api_call.json();
    console.log("Fetching data from Fish Passage Center...", data);
  } 
  */ 

  componentDidUpdate() {
    console.log("Loading map...");
    this.renderMap();
  }

  fetchInitialData() {
    this.getRiverList();
  }

  componentDidMount() {
    this.fetchInitialData();
  }

  /*fetchData() {
    fetch: ('https://randomuser.me/api/?results=50&nat=us,dk,fr,gb')
    .then(response => response.json())
    .then(parsedJSON => console.log(parsedJSON.results))
    .catch(error => console.log('parsing failed', error))
  }*/

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

  myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

  

  render() {
    return (

      <div>
      <div className="wrapper">
        <div className="main">
          <div className="container">

            <div className="row">
                 <div className="col-xs-12">
                 <Titles />
                 </div>
            </div>
            <div className="row">
            <div className="col-xs-3 form-container">
              <FormWater getWater={this.getWater}
                         getRiverList={this.getRiverList}
                         riverList={this.state.riverList}
                         riverCodes={this.state.riverCodes}
                         riverSourceInfo={this.state.riverSourceInfo}
                         getShroomsButton={this.getShroomsButton}
              />
                <Water river_name={this.state.river_name}
                          sample_time={this.state.sample_time}
                          gageHeight={this.state.gageHeight}
                          minus3gageHeight={this.state.minus3gageHeight}
                          latitude={this.state.latitude}
                          longitude={this.state.longitude}
                />
              </div>
            
            
              <div className="col-xs-9" id="map">
              </div>
            </div>
            <br />
            <br />
              <div className="row">
                 <div className="col-xs-12 myChart">
                 
                 <ChartShrooms myShroomData={this.state.myShroomData}
                               
                 />
                 
                 <ChartWater riverData={this.state.riverData} 
                        riverGageData={this.state.riverGageData} 
                        riverLabels={this.state.riverLabels}
                        shroomData={this.state.shroomData}
                        shroomDates={this.state.shroomDates}
                        riverDatesAndShroomCount={this.state.riverDatesAndShroomCount}
                        waterArrayDates={this.state.waterArrayDates}
                        waterArrayGage={this.state.waterArrayGageValues}
                        waterArrayShrooms={this.state.waterArrayShrooms}
                        myWaterArrayShrooms={this.state.myWaterArrayShrooms}
                        
                 /> 
                 </div>

            </div>
          </div>
        </div>
      </div>
    </div>

        /*<div className="wrapper">
            <div className="container">
              
                <div className="row">
                  <br />
                  <div className="col-xs-12">
                  <Titles/>
                </div>

                <div className="row">
                
                  <div className="col-xs-1">
                  </div>

                   <div className="col-xs-5 form-container" align="center">
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
                </div>
            </div>
            
        
            <div className="col-xs-7 form-container" id="map">
            </div> 

            <div className="col-xs-4">
              <Chart riverData={this.state.riverData} 
                     riverGageData={this.state.riverGageData} 
                     riverLabels={this.state.riverLabels}
              />
            </div>
            
            <div className="col-xs-1">
            </div>
          </div>    
    </div>
    </div>
    */
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