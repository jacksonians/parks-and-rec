// Initialize global variables
let map;
const addedAddresses = [];
const markers = [];

// Initialize the Google Map
function initMap() {
  const position = { lat: 17.6078, lng: 8.0817 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5,
    center: position,
  });
}

// Get address from input box
function getAddressFromInput() {
  return document.getElementById("inputBox").value;
}

// Handle geocoding result
function handleGeocodeResult(results, address) {
  const location = results[0].geometry.location;
  const marker = createMarker(location, address);
  markers.push(marker);
  map.setCenter(location);
  map.setZoom(15);
  fetchPlacePhoto(location, address, marker);
}

// Perform geocoding
function geocodeAddress(address) {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === "OK") {
      handleGeocodeResult(results, address);
    } else {
      alert("Geocode was not successful: " + status);
    }
  });
}

// Create a marker on the map
function createMarker(location, title) {
  return new google.maps.Marker({
    map,
    position: location,
    title,
  });
}

// Create an InfoWindow for a marker
function createInfoWindow(address, photoHTML) {
  return new google.maps.InfoWindow({
    content: `<strong>${address}</strong>${photoHTML}`,
  });
}

// Fetch place photo using PlacesService
function fetchPlacePhoto(location, address, marker) {
  const placesService = new google.maps.places.PlacesService(map);

  placesService.nearbySearch(
    {
      location: location,
      radius: 75,
    },
    (places, status) => {
      let photoHTML = "";

      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        places.length > 0
      ) {
        const place = places[0];

        if (place.photos && place.photos.length > 1) {
          photoHTML =
            '<div style="display: flex; gap: 5px; flex-wrap: wrap; max-width: 300px;">';
          place.photos.slice(0, 3).forEach((photo) => {
            const url = photo.getUrl({ maxWidth: 100, maxHeight: 100 });
            photoHTML += `<img src="${url}" width="100" height="100" alt="Location photo" />`;
          });
          photoHTML += "</div>";
        } else {
          photoHTML = "<br><em>No images more than 1 available.</em>";
        }
      }

      const infoWindow = createInfoWindow(address, photoHTML);
      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
      infoWindow.open(map, marker);
    }
  );
}

// Clear all markers from the map
function clearMarkers() {
  markers.forEach((marker) => marker.setMap(null));
  markers.length = 0;
  addedAddresses.length = 0;
}

// Main entry point for address submission
function parseAddress() {
  const address = getAddressFromInput();
  if (!address) {
    alert("Please enter an address");
    return;
  }
  geocodeAddress(address);
}
