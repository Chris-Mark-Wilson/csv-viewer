import { useState,useEffect } from 'react'

import './App.css'

function App() {
  const [csv,setCsv]=useState(null)
  const [headers,setHeaders]=useState([])
  const [data,setData]=useState([])

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

  useEffect(()=>{
    if(csv){
      const rows = csv.split('\n')
      const headers = rows[0].split(',')
      setHeaders(headers)
      const data = []
      for(let i=1;i<rows.length;i++){
        const row = rows[i].split(',')
        data.push(row)
      }
      setData(data)
    }
  }
  ,[csv])

  return (
    <>
    <div className="App">   
      <h1>CSV Viewer</h1>
      <input type="file" onChange={e=>setFile(e)}/>
      </div>
      {csv && (
  <div>
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
          <tr key={rowIndex} style={{ color:'black',backgroundColor: rowIndex % 2 === 0 ? '#f2f2f2' : '#ffffff' }}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
    </>
  )
}
 export default App
