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

    waterArrayDates: undefined,
    waterArrayGageValues: undefined,
    waterArrayShrooms: undefined,
    myWaterArrayShrooms: undefined
  }

  //FUNCTIONS BELOW:
  //These functions load with initial page load.
  componentDidMount() {
    this.fetchInitialData();
  }
  
  //These functions run every time component updates.
  componentWillUpdate() {
    console.log("Loading map...");
    this.renderMap();
  }
  
  //Bundle all API data retrievals for initial load state. 
  fetchInitialData() {
    this.getRiverList();
  }
  
  //GOOGLE MAP API
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
  
  //generate a list of rivers for drop-down
  getRiverList = async (e) => {
    const river_api_call = await fetch(`https://waterservices.usgs.gov/nwis/iv/?format=json&stateCd=or&parameterCd=00060,00065&siteType=ST&siteStatus=active`, {method: "GET"});
    const data = await river_api_call.json();
    console.log("Fetching river labels from USGS...");
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
  

  //get details pertaining to selected river...
  getWater = async (e) => {
    e.preventDefault();
    const myRiver = e.target.elements.river_code.value;
    const river_api_call = await fetch(`https://waterservices.usgs.gov/nwis/iv/?sites=${myRiver}&period=P100D&parameterCd=00060,00065&siteStatus=all&format=json`, {method: "GET"});
    const data = await river_api_call.json();
     console.log("Fetching river gage data from USGS...");
     const sample_time = data.value.timeSeries[1].values[0].value;
     const riverGageArray = data.value.timeSeries[1].values[0].value;
     const chartLabelArray =[];
     const chartDataArray=[];
     var waterArrayDates = [];
     var waterArrayGageValues = [];
     var waterArrayShrooms = [];
     var newArray = [];
     console.log(data);
     for (let i=0; i<riverGageArray.length; i+=350) {
       waterArrayDates.push((sample_time[i].dateTime).substr(0,10));
       waterArrayGageValues.push(Number(riverGageArray[i].value));
       waterArrayShrooms.push(0);
       newArray.push({"date": ((sample_time[i].dateTime).substr(0,10)), "riverGage": Number(riverGageArray[i].value), "shroomValue": 0});
    };  
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
  
  //loop through pages of Mushroom Observer API GET results...
  /*
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
    this.setState({
      shroomData: data,
      shroomDates: myShroomDates,
      shroomId: myShroomId,
      waterArrayShrooms: myWaterArrayShrooms,
      myWaterArrayShrooms: myWaterArrayShrooms,
    })
    console.log("ATTENTION: ", this.state.myWaterArrayShrooms);
  } 
  */

  //ALL RENDERED DOM ELEMENTS:
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
              />
              </div>
            
            
              <div className="col-xs-9" id="map">
              </div>
            </div>
            <br />
            <br />
              <div className="row">
                 <div className="col-xs-12 myChart">
                 
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