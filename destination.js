// hamburger menu 
const hamburger = document.querySelector('.hamburger');
const navList = document.getElementById('navList');

if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navList.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navList.contains(e.target)) {
            hamburger.classList.remove('active');
            navList.classList.remove('show');
        }
    });
}

// ICAO code mapping with city names
const airportCodes = {
    // India - Major Cities
    "Delhi": "VIDP",
    "New Delhi": "VIDP",
    "Mumbai": "VABB",
    "Bangalore": "VOBL",
    "Bengaluru": "VOBL",
    "Chennai": "VOMM",
    "Kolkata": "VECC",
    "Hyderabad": "VOHS",
    "Pune": "VAPO",
    "Goa": "VAGO",
    "Ahmedabad": "VAAH",
    "Jaipur": "VIJP",
    "Kochi": "VOCI",
    "Cochin": "VOCI",
    "Lucknow": "VILK",
    "Chandigarh": "VICG",
    "Trivandrum": "VOTV",
    "Coimbatore": "VOCB",
    "Nagpur": "VANP",
    "Indore": "VAID",
    
    // International
    "London": "EGLL",
    "New York": "KJFK",
    "Dubai": "OMDB",
    "Singapore": "WSSS",
    "Bangkok": "VTBS",
    "Paris": "LFPG",
    "Tokyo": "RJTT",
    "Sydney": "YSSY",
    "Los Angeles": "KLAX",
    "Hong Kong": "VHHH",
    "San Francisco": "KSFO",
    "Chicago": "KORD",
    "Toronto": "CYYZ",
    "Amsterdam": "EHAM",
    "Frankfurt": "EDDF",
    "Zurich": "LSZH",
    "Istanbul": "LTFM",
    "Doha": "OTHH",
    "Abu Dhabi": "OMAA",
    "Kuala Lumpur": "WMKK"
};

// Convert city name to ICAO code
function getCityCode(cityName) {
    // Try exact match first
    if (airportCodes[cityName]) {
        return airportCodes[cityName];
    }
    
    // Try case-insensitive match
    const cityLower = cityName.toLowerCase();
    for (const [key, value] of Object.entries(airportCodes)) {
        if (key.toLowerCase() === cityLower) {
            return value;
        }
    }
    
    // If no match found, return original (might already be ICAO code)
    console.warn(`No ICAO code found for: ${cityName}, using as-is`);
    return cityName.toUpperCase();
}

//flight search logic

// Load search data from localStorage
const searchData = JSON.parse(localStorage.getItem('flightSearchData'));

if (searchData) {
    console.log('Loaded search data:', searchData);
    
    // Update header with search parameters
    document.getElementById("fromCity").textContent = searchData.from || "Unknown";
    document.getElementById("toCity").textContent = searchData.to || "Unknown";
    document.getElementById("travelDate").textContent = searchData.date || "Not Set";
    document.getElementById("passengers").textContent = searchData.passengers || "N/A";
} else {
    console.log('No search data found');
}

// RapidAPI credentials
const apiKey = '190c1b1021mshc8addbfdd068905p1e758fjsn3cc57fe79cc5';
const apiHost = 'aerodatabox.p.rapidapi.com';

// DOM references
const loader = document.getElementById('loadingState');
const flightsContainer = document.getElementById('flightCards');
const noResultsDiv = document.getElementById('noResults');

// Show loader initially
if (loader) loader.style.display = 'block';
if (flightsContainer) flightsContainer.style.display = 'none';
if (noResultsDiv) noResultsDiv.style.display = 'none';

// Store all flights for filtering
let allFlights = [];

// mock data 
function generateMockFlights(from, to, date) {
    const airlines = [
        { name: "Air India", code: "AI" },
        { name: "IndiGo", code: "6E" },
        { name: "SpiceJet", code: "SG" },
        { name: "Vistara", code: "UK" },
        { name: "AirAsia India", code: "I5" },
        { name: "Go First", code: "G8" }
    ];

    const flights = [];
    
    for (let i = 0; i < 12; i++) {
        const airline = airlines[i % airlines.length];
        const hour = 6 + i;
        const arrivalHour = hour + 2 + Math.floor(Math.random() * 3);
        
        flights.push({
            number: `${airline.code}${(Math.random() * 1000).toFixed(0)}`,
            airline: { name: airline.name },
            departure: {
                airport: { name: from, icao: getCityCode(from) },
                scheduledTimeLocal: `${date}T${hour.toString().padStart(2, '0')}:${(Math.random() * 60).toFixed(0).padStart(2, '0')}:00`,
                scheduledTimeUtc: `${date}T${hour.toString().padStart(2, '0')}:${(Math.random() * 60).toFixed(0).padStart(2, '0')}:00Z`
            },
            arrival: {
                airport: { name: to, icao: getCityCode(to) },
                scheduledTimeLocal: `${date}T${arrivalHour.toString().padStart(2, '0')}:${(Math.random() * 60).toFixed(0).padStart(2, '0')}:00`,
                scheduledTimeUtc: `${date}T${arrivalHour.toString().padStart(2, '0')}:${(Math.random() * 60).toFixed(0).padStart(2, '0')}:00Z`
            },
            status: Math.random() > 0.2 ? 'Scheduled' : 'On Time'
        });
    }
    
    return flights;
}

// fetch flight from api
if (searchData) {
    const { from, to, date } = searchData;

    if (!from || !to || !date) {
        console.error('Missing parameters:', { from, to, date });
        if (loader) loader.style.display = 'none';
        if (noResultsDiv) noResultsDiv.style.display = 'block';
    } else {
        // Convert city names to ICAO codes
        const fromCode = getCityCode(from);
        const toCode = getCityCode(to);
        
        const fromTime = `${date}T00:00`;
        const toTime = `${date}T23:59`;

        const url = `https://${apiHost}/flights/airports/icao/${fromCode}/${fromTime}/${toTime}?withLeg=true&direction=Departure&limit=50`;
        console.log('Fetching flights from:', fromCode, 'to:', toCode, 'on:', date);

        fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': apiHost
            }
        })
            .then(response => {
                if (!response.ok) {
                    console.warn(`API request failed with status ${response.status}, using mock data`);
                    throw new Error(`HTTP error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('✅ Flight data received from API:', data);
                
                if (loader) loader.style.display = 'none';

                allFlights = data.departures || data.arrivals || [];
                
                // Filter flights going to destination if available
                if (toCode && allFlights.length > 0) {
                    const filteredFlights = allFlights.filter(flight => 
                        flight.arrival?.airport?.icao === toCode
                    );
                    
                    if (filteredFlights.length > 0) {
                        allFlights = filteredFlights;
                    } else {
                        console.log('⚠️ No flights found to destination, showing all departures or using mock data');
                    }
                }
                
                if (allFlights.length === 0) {
                    console.log('⚠️ No API flights found, using mock data');
                    allFlights = generateMockFlights(from, to, date);
                }
                
                displayFlights(allFlights);
            })
            .catch(error => {
                console.error('❌ API Error, using mock data:', error);
                console.log('📊 Generating mock flights for testing...');
                
                if (loader) loader.style.display = 'none';
                
                // Use mock data as fallback
                allFlights = generateMockFlights(from, to, date);
                displayFlights(allFlights);
            });
    }
} else {
    if (loader) loader.style.display = 'none';
    if (noResultsDiv) noResultsDiv.style.display = 'block';
    console.log('No search data found in localStorage');
}

// display flights
function displayFlights(flights) {
    const container = flightsContainer;
    if (!container) return;

    container.innerHTML = '';
    container.style.display = 'grid';
    if (noResultsDiv) noResultsDiv.style.display = 'none';

    if (!flights || flights.length === 0) {
        if (noResultsDiv) noResultsDiv.style.display = 'block';
        container.style.display = 'none';
        return;
    }

    flights.forEach((flight, index) => {
        const card = document.createElement('div');
        card.classList.add('card');

        // Extract flight details
        const airline = flight.airline?.name || 'Unknown Airline';
        const flightNumber = flight.number || 'N/A';
        const departureAirport = flight.departure?.airport?.name || flight.departure?.airport?.icao || 'N/A';
        const arrivalAirport = flight.arrival?.airport?.name || flight.arrival?.airport?.icao || 'N/A';
        const departureTime = flight.departure?.scheduledTimeLocal ? 
            new Date(flight.departure.scheduledTimeLocal).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A';
        const arrivalTime = flight.arrival?.scheduledTimeLocal ? 
            new Date(flight.arrival.scheduledTimeLocal).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A';
        const status = flight.status || 'Scheduled';
        
        // Calculate duration if times are available
        let duration = 'N/A';
        let durationMinutes = 120; // default for sorting
        if (flight.departure?.scheduledTimeUtc && flight.arrival?.scheduledTimeUtc) {
            const depTime = new Date(flight.departure.scheduledTimeUtc);
            const arrTime = new Date(flight.arrival.scheduledTimeUtc);
            const durationMs = arrTime - depTime;
            const hours = Math.floor(durationMs / (1000 * 60 * 60));
            const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
            duration = `${hours}h ${minutes}m`;
            durationMinutes = hours * 60 + minutes;
        }

        // Generate consistent price based on index and duration
        const basePrice = 3500 + (index * 547 % 8000) + (durationMinutes * 15);
        const price = `₹${basePrice.toLocaleString()}`;

        // Assign class (cycle through options)
        const classes = ['economy', 'business', 'first'];
        const classLabels = ['Economy', 'Business', 'First Class'];
        const classIndex = index % 3;
        const flightClass = classes[classIndex];
        const classLabel = classLabels[classIndex];
        
        card.innerHTML = `
            <div class="card-header">
                <i class="fa-solid fa-plane"></i>
                ${airline}
            </div>
            <div class="card-body">
                <p><i class="fa-solid fa-hashtag"></i> <strong>Flight:</strong> ${flightNumber}</p>
                <p><i class="fa-solid fa-plane-departure"></i> <strong>Departure:</strong> ${departureAirport} at ${departureTime}</p>
                <p><i class="fa-solid fa-plane-arrival"></i> <strong>Arrival:</strong> ${arrivalAirport} at ${arrivalTime}</p>
                <p><i class="fa-solid fa-clock"></i> <strong>Duration:</strong> ${duration}</p>
                <p><i class="fa-solid fa-info-circle"></i> <strong>Status:</strong> ${status}</p>
                <p><i class="fa-solid fa-chair"></i> <strong>Class:</strong> ${classLabel}</p>
                
                <div class="price-section">
                    <div class="price">${price}</div>
                    <div class="price-label">Per Person</div>
                </div>
                
                <a href="payment.html?flight=${encodeURIComponent(flightNumber)}" class="book-btn">BOOK NOW</a>
            </div>
        `;
        
        // Store data for filtering
        card.dataset.class = flightClass;
        card.dataset.price = basePrice;
        card.dataset.departure = departureTime;
        card.dataset.duration = durationMinutes;

        container.appendChild(card);
    });
}


function filterFlights() {
    const classFilter = document.getElementById('classFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    
    const cards = Array.from(document.querySelectorAll('.card'));
    
    // Filter by class
    let filteredCards = cards.filter(card => {
        if (classFilter === 'all') return true;
        return card.dataset.class === classFilter;
    });
    
    // Sort cards
    filteredCards.sort((a, b) => {
        switch(sortFilter) {
            case 'price-low':
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            case 'price-high':
                return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            case 'departure':
                return a.dataset.departure.localeCompare(b.dataset.departure);
            case 'duration':
                return parseInt(a.dataset.duration) - parseInt(b.dataset.duration);
            default:
                return 0;
        }
    });
    
    // Hide all cards first
    cards.forEach(card => card.style.display = 'none');
    
    // Show filtered and sorted cards
    if (filteredCards.length === 0) {
        if (noResultsDiv) noResultsDiv.style.display = 'block';
        if (flightsContainer) flightsContainer.style.display = 'none';
    } else {
        if (noResultsDiv) noResultsDiv.style.display = 'none';
        if (flightsContainer) flightsContainer.style.display = 'grid';
        
        filteredCards.forEach(card => {
            card.style.display = 'block';
            flightsContainer.appendChild(card);
        });
    }
}

// Make filterFlights globally accessible
window.filterFlights = filterFlights;