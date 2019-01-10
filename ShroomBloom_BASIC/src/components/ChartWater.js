import React, {Component} from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';


class ChartWater extends Component {
    render(){
       
        const data = {
            
            //labels: this.props.riverDatesAndShroomCount, 
            labels: this.props.waterArrayDates, 
            datasets: [
                {
                    label: "Gage Height (ft)",
                    data: this.props.waterArrayGage,
                    borderColor: "#42d4f4",
                    fill: true,
                    fontColor: "red",
                    display: false,
                },
                
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
                    position: 'top',
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