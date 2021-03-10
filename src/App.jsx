// import { useEffect } from 'react';
// import axios from 'axios';
import './App.css';
import CSVReader from './components/parse'
// import './components/Papa';

function App() {

  // useEffect(() => {
  //   async function fetchData() {
  //     // const response = await fetch('../layers.csv');
  //     const response = await axios('../layers.csv');
  //     console.log(response);
  //     // const data = await response.text();
  //     // console.log(data);
  //   }
  //   fetchData();
  // }, [])

  return (
    <div className="App">
      <CSVReader/>
    </div>
  );
}

export default App;
