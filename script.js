((g) => {
  var h,
    a,
    k,
    p = "The Google Maps JavaScript API",
    c = "google",
    l = "importLibrary",
    q = "__ib__",
    m = document,
    b = window;
  b = b[c] || (b[c] = {});
  var d = b.maps || (b.maps = {}),
    r = new Set(),
    e = new URLSearchParams(),
    u = () =>
      h ||
      (h = new Promise(async (f, n) => {
        await (a = m.createElement("script"));
        e.set("libraries", [...r] + "");
        for (k in g)
          e.set(
            k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()),
            g[k]
          );
        e.set("callback", c + ".maps." + q);
        a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
        d[q] = f;
        a.onerror = () => (h = n(Error(p + " could not load.")));
        a.nonce = m.querySelector("script[nonce]")?.nonce || "";
        m.head.append(a);
      }));
  d[l]
    ? console.warn(p + " only loads once. Ignoring:", g)
    : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
})({ key: "AIzaSyC8XRybMxBBIJkkAeo0GmrGanz5_2hAQME", v: "weekly" });

// Initialize and add the map
let map;

async function initMap() {
  // The location of Uluru
  const position = { lat: -25.344, lng: 131.031 };
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at Uluru
  map = new Map(document.getElementById("map"), {
    zoom: 4,
    center: position,
    mapId: "DEMO_MAP_ID",
  });

  // The marker, positioned at Uluru
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: "Uluru",
  });
}

initMap();

//Init Empty Address String
const addedAddresses = [];

function parseAddress() {
  const address = document.getElementById("inputBox").value;
  if (!address) {
    return alert("Please enter an address");
  }
  console.log(address);

  //Init Geocoder API
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === "OK") {
      const location = results[0].geometry.location;

      addedAddresses.push({
        address,
        lat: location.lat(),
        lng: location.lng(),
      });
      const marker = new google.maps.Marker({
        map,
        position: location,
        title: address,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<strong>${address}</strong>`,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      map.setCenter(location);
    } else {
      alert("Geocode was not successful: " + status);
    }
  });
}

function clearMarker() {}
