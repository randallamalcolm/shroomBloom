import React, {Component} from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';


class ChartShrooms extends Component {
    render(){
        const data = {
            
            labels: this.props.waterArray, 
            datasets: [
                {
                    label: "Mushrooms",
                    data: this.props.waterArrayShrooms,
                    borderColor: "#42d4f4",
                    fill: true
                }
            ],
            xAxis: {
                labels: {
                    fontSize: 14,
                }
            },
            scaleLabel: {
                fontSize: 18
            },
            borderWidth: 10,
        };
        
        return (
            <div className="chart">
            {this.props.waterArrayShrooms &&
            <Bar
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

export default ChartShrooms;