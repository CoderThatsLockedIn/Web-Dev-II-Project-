const AVIATIONSTACK_KEY = '5aeaf7a44a87c63de0827bd8d8c9c218';

const selector = document.querySelector('.selectors');
const cards = document.querySelectorAll('.card');
const btn = document.querySelector('.btn');
let active_class = '';

selector.addEventListener('click', function (e) {
  if (e.target.classList.contains('card')) {
    for (let i = 0; i < cards.length; i++) {
      cards[i].classList.remove('active');
    }
    e.target.classList.add('active');
  }

  for (let i = 0; i < cards.length; i++) {
    if (cards[i].classList.contains('active')) {
      active_class = cards[i].classList[1];
    }
  }
});

const cityToIATA = {
  delhi: 'DEL',
  mumbai: 'BOM',
  bengaluru: 'BLR',
  bangalore: 'BLR',
  chennai: 'MAA',
  kolkata: 'CCU',
  hyderabad: 'HYD',
  kochi: 'COK',
  cochin: 'COK',
  pune: 'PNQ',
  ahmedabad: 'AMD',
  jaipur: 'JAI',
  'new york': 'JFK',
  london: 'LHR',
  dubai: 'DXB',
  singapore: 'SIN'
};

const iataToCountry = {
  DEL: 'India',
  BOM: 'India',
  BLR: 'India',
  MAA: 'India',
  CCU: 'India',
  HYD: 'India',
  COK: 'India',
  PNQ: 'India',
  AMD: 'India',
  JAI: 'India',
  JFK: 'USA',
  LHR: 'UK',
  DXB: 'UAE',
  SIN: 'Singapore'
};

function isDomestic(start, destination) {
  return (
    iataToCountry[start] === 'India' &&
    iataToCountry[destination] === 'India'
  );
}

function getIATACode(city) {
  if (!city) return null;
  return cityToIATA[city.toLowerCase()] || null;
}


const tableContainer = document.querySelector('.table-container');

const messageBox = document.createElement('div');
messageBox.className = 'message-box';
document.body.appendChild(messageBox);

function showMessage(message) {
  messageBox.textContent = message;
}

function renderTable(flights) {
  tableContainer.innerHTML = '';

  if (!flights || flights.length === 0) {
    tableContainer.innerHTML = '\n\nNo flights found';
    return;
  }

  const table = document.createElement('table');
  const headerRow = document.createElement('tr');
  const headers = ['Airline', 'Flight No.', 'Start', 'Destination', 'Date', 'Time'];

  headers.forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);

  flights.forEach(flight => {
    const row = document.createElement('tr');
    const cells = [
      flight.airline,
      flight.flightNo,
      flight.start,
      flight.destination,
      flight.date,
      flight.time
    ];

    cells.forEach(value => {
      const td = document.createElement('td');
      td.textContent = value || '';
      row.appendChild(td);
    });

    table.appendChild(row);
  });

  tableContainer.appendChild(table);
}

function mapAviationstackToFlights(dataArray) {
  if (!Array.isArray(dataArray)) return [];

  return dataArray.map(item => {
    const flightDate = item.flight_date || '';
    let time = '';

    if (item.departure && item.departure.scheduled) {
      const d = new Date(item.departure.scheduled);
      if (!isNaN(d.valueOf())) {
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        time = `${hh}:${mm}`;
      }
    }

    return {
      airline: item.airline && item.airline.name ? item.airline.name : '',
      flightNo: item.flight && item.flight.number ? item.flight.number : '',
      start: item.departure && item.departure.iata ? item.departure.iata : '',
      destination: item.arrival && item.arrival.iata ? item.arrival.iata : '',
      date: flightDate,
      time: time
    };
  });
}

async function fetchAndRender(url) {
  try {
    showMessage('Fetching flights...');
    renderTable();

    const response = await fetch(url);
    const json = await response.json();
    console.log('Aviationstack raw response', json);

    if (!response.ok || json.error) {
      const msg = json.error?.message || 'Unknown Aviationstack error';
      showMessage('Aviationstack error: ' + msg);
      renderTable();
      return;
    }

    const flights = mapAviationstackToFlights(json.data);
    showMessage(`Found ${flights.length} flights.`);
    renderTable(flights);
  } catch (err) {
    console.error('Error fetching flights', err);
    showMessage('Network error while calling Aviationstack.');
    renderTable();
  }
}

btn.addEventListener('click', async () => {
  const inputs = document.querySelectorAll('.inputs input');
  // inputs[0] = Start, inputs[1] = Destination
  const startCity = inputs[0].value.trim();
  const destinationCity = inputs[1].value.trim();

  const start = getIATACode(startCity);
  const destination = getIATACode(destinationCity);

  if (!start || !destination) {
    showMessage('Please enter a valid city name (e.g., Delhi, Mumbai).');
    renderTable([]);
    return;
  }

  if (!active_class || !start || !destination) {
    showMessage('Please select all fields.');
    renderTable([]);
    return;
  }

  if (active_class === 'dom' && !isDomestic(start, destination)) {
    showMessage('Please select Indian cities for Domestic flights.');
    renderTable([]);
    return;
  }

  if (active_class === 'int' && isDomestic(start, destination)) {
    showMessage('Please select an International route.');
    renderTable([]);
    return;
  }

  const baseUrl = 'https://api.aviationstack.com/v1/flights';
  const params = new URLSearchParams({
    access_key: AVIATIONSTACK_KEY,
    dep_iata: start,
    arr_iata: destination
    // no flight_date for now
  });
  const url = `${baseUrl}?${params.toString()}`;

  try {
    showMessage('Fetching flights...');
    renderTable([]);

    const response = await fetch(url);
    const json = await response.json();
    console.log('Aviationstack raw response:', json);

    if (!response.ok || json.error) {
      const msg = json.error && json.error.message ? json.error.message : 'Unknown Aviationstack error';
      showMessage(`Aviationstack error: ${msg}`);
      renderTable([]);
      return;
    }

    const flights = mapAviationstackToFlights(json.data || []);
    showMessage(`Found ${flights.length} flights.`);
    renderTable(flights);
  } catch (err) {
    console.error('Error fetching flights:', err);
    showMessage('Network error while calling Aviationstack.');
    renderTable([]);
  }
});


