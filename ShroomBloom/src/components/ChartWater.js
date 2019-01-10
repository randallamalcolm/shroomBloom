import React, {Component} from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';


class ChartWater extends Component {
    render(){
 
       var dates = [];
       for (let i=0; i < this.props.riverDatesAndShroomCount; i++) {
           dates.push(this.props.riverDatesAndShroomCount[i].date);
       }
        const data = {
            
            labels: this.props.riverLabels, 
            datasets: [
                {
                    label: "Gage Height",
                    data: this.props.riverGageData,
                    borderColor: "#42d4f4",
                    fill: true,
                    fontColor: "red",
                },
                /*
                {
                    label: "ShroomBloom",
                    data: this.props.shroomId,
                    borderColor: "red",
                    fill: true,
                    fontColor: "red",
                },
                */

            ],
        };
        
        return (
            <div className="chart">
            {this.props.riverLabels &&
            <Line
            data={data}
            width={800}
            height={400}
            options={{
                maintainAspectRatio: true,
                display: true,
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 50,
                        bottom: 20
                    },
                },    
                legend: {
                    display: true,
                    position: 'left',
                    labels: {
                        fontColor: 'black',
                        fontSize: 14,
                        scaleLabel: {
                            fontSize: 18
                        },
                    }
                },
                
            }}
        />
            }
            </div>
        );
    }
}

export default ChartWater;