import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import './App.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [csv, setCsv] = useState(null)
  const [headers, setHeaders] = useState([])
  const [data, setData] = useState([])
  const [totalGas2023, setTotalGas2023] = useState(0)
  const [totalGas2024, setTotalGas2024] = useState(0)
  const [totalElectricity2023, setTotalElectricity2023] = useState(0)
  const [totalElectricity2024, setTotalElectricity2024] = useState(0)

  const setFile = (e) => {
    console.log(e.target.files[0])
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      setCsv(text)
    }
    reader.readAsText(file)

  }

  useEffect(() => {
    if (csv) {
      const rows = csv.split('\n')
      const headers = rows[0].split(',')
      setHeaders(headers)
      const data = []
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(',')
        data.push(row)
      }
      setData(data)
    }
  }
    , [csv])
  useEffect(() => {
    if (data) {
      console.log(data)
      // data is an array of arrays
      // each array is a row
      // each row is an array of strings
      // we need rows[2] and rows[4]
      const te2023 = data.map(row => {
        if (row[0].endsWith('2023')) return parseFloat(row[2])
        return 0;
      })
        .reduce((acc, curr) => acc + curr, 0)
      console.log('total electricity 2023...', te2023)

         const te2024 = data.map(row => {
        if (row[0].endsWith('2024')) return parseFloat(row[2])
        return 0;
      })
        .reduce((acc, curr) => acc + curr, 0)
      console.log('total electricity 2024...', te2024)

      const tg2023 = data.map(row => {
        if (row[0].endsWith('2023')) return parseFloat(row[4])
        return 0;
      }
      )
        .reduce((acc, curr) => acc + curr, 0)
      console.log('total gas 2023...', tg2023)

      const tg2024 = data.map(row => {
        if (row[0].endsWith('2024')) return parseFloat(row[4])
        return 0;
      }
      )
        .reduce((acc, curr) => acc + curr, 0)
      console.log('total gas 2024...', tg2024)

      setTotalGas2023(tg2023)
      setTotalGas2024(tg2024)
      setTotalElectricity2023(te2023)
      setTotalElectricity2024(te2024)
    }
  }, [data])

  return (
    <>
      <div className="App">
        <h1>CSV Viewer</h1>
        <input type="file" onChange={e => setFile(e)} />
      </div>
      {data.length && (
        <>
        <div id='table'>
          <h2>CSV Data</h2>
          <table>
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} style={{ color: 'black', backgroundColor: rowIndex % 2 === 0 ? '#f2f2f2' : '#ffffff' }}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div id='chart'>
            <Line
              data={{
                labels: data.slice(0,16).map(row => row[0].match(/([A-Z])\w+/g)[0]),
                datasets: [
                  {
                    label: 'Electricity 2023',
                    data: data.slice(0,12).map(row => parseFloat(row[2])),
                    borderColor: 'rgba(75,192,192,1)',
                    backgroundColor: 'rgba(75,192,192,0.2)',
                  },
                  {
                    label: 'Electricity 2024-25',
                    data: data.slice(12,29).map(row => parseFloat(row[2])),
                    borderColor: 'rgb(83, 75, 192)',
                    backgroundColor: 'rgba(75,192,192,0.2)',
                  },
                  {
                    label: 'Gas 2023',
                    data: data.slice(0,12).map(row => parseFloat(row[4])),
                    borderColor: 'rgba(255,99,132,1)',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                  },
                  {
                    label: 'Gas 2024-25',
                    data: data.slice(12,29).map(row => parseFloat(row[4])),
                    borderColor: 'rgb(237, 255, 99)',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                  },
                ],
              }}
              options={{
                // scales: {
                //   y: {
                //     beginAtZero: true,
                //   },
                // },
              }}
            />  
        </div>
        <div>
          {totalGas2024 && totalGas2023 && (
            <div>
              <h5>Total Gas 2023: {totalGas2023.toFixed(2)} Kwh</h5>
              <h5>Total Gas 2024: {totalGas2024.toFixed(2)} Kwh</h5>
              <h5>a difference of {(totalGas2024-totalGas2023).toFixed(2)} Kwh which @ 6.372p per Kwh is            £{(((totalGas2024-totalGas2023)*6.372)/100).toFixed(2)} or {-(100-((totalGas2024/totalGas2023)*100)).toFixed(2)}%</h5>
              <h5>Total Electricity 2023: {totalElectricity2023.toFixed(2)} Kwh</h5>
              <h5>Total Electricity 2024: {totalElectricity2024.toFixed(2)} Kwh</h5>
                <h5> a difference of {(totalElectricity2024-totalElectricity2023).toFixed(2)} Kwh which @ 26.215p per Kwh is £{(((totalElectricity2024-totalElectricity2023)*26.215)/100).toFixed(2)} or {-(100-((totalElectricity2024/totalElectricity2023)*100)).toFixed(2)}%</h5>
            </div>
          )}
        </div>
        </>
      )}
    
    </>
  )
}
export default App
