import React, { useEffect, useState } from 'react'
import Chart from 'react-google-charts';
import { earthQuakeHistoGramColumns, EARTHQUAKE_DATA_API_URL } from '../constants';
// import { earthQuakesData } from '../constants/sampleData';
import { sendGETHttpRequest } from '../utils/httpMethods';
import { ErrorComponent } from './ErrorState';

const dateVsNumberOfEarthQuakeMapping = (features) => 
        features.reduce((result, value) => {
            const {properties} = value
            const {time} = properties;
            const date = new Date(time).toISOString().split('T')[0]
            return {...result, [date]: !result[date] ? 1: result[date]+1 }
        }, {})
    
const transformFeatureData = (features) => 
         [earthQuakeHistoGramColumns, ...Object.entries(dateVsNumberOfEarthQuakeMapping(features))]

const EarthquakeVsDate = () =>  
  {
    // Not going to change as field are constant, 
    // But it can be dynamic also, based on number of field vs color
    const histogramChartConfig = {
        title: 'Number of EarthQuake vs Day',
        legend: { position: "none" },
    };

    const [earthQuakeData, setEarthQuakeData ] = useState([]);
    const [errorState, setErrorState] = useState(false);
    const [errorReason, setErrorReason] = useState('');
    
    useEffect(() => {
        (async() => { 
            // This over here because, inside parent it can re-render static component,
            // this will help us to not render other child components
            // separate cause of concern for re-rendering
            const {features} = await sendGETHttpRequest(EARTHQUAKE_DATA_API_URL)
        console.log(features)
        if(!features){
            setErrorState(true); 
            setErrorReason('Unable to fetch EarthQuake data');
        }else{
            setEarthQuakeData(transformFeatureData(features))
        }  
        
    })()
    }, [])


    
    return (
        errorState ? <ErrorComponent errorMessage={errorReason} />
        :
      <div className="container mt-5">
        <h2>EarthQuake Vs Date</h2>
        <Chart
          width={'600px'}
          height={'320px'}
          chartType="Histogram"
          loader={<div>Loading Chart</div>}
          data={earthQuakeData}
          options={histogramChartConfig}
        />
      </div>
    )
  }

export default EarthquakeVsDate