async function fetchData() {
      const response = await fetch('../layers.csv');
      const data = await response.text();
      console.log(data);
    }
    fetchData();

// fetch('./layers.csv').then(res=>res.text()).then(console.log)