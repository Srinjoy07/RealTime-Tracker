const socket = io();  //initializes connection to backend and initiates a call

//navigator is an object that includes lots of functions including geolocation
if(navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      //position.coords.latitude and position.coords.longitude are the coordinates of the user's location
      const {latitude, longitude} = position.coords;
      socket.emit("send-location", {latitude,longitude});
    }, (error)=> {
      console.warn(error);
    },
  {
    enableHighAccuracy: true,
    timeout: 5000, //5sec
    maximumAge: 0,  //to enable no caching
  });
}

//we've setup the location settings as of now

// step 6 in 
const map = L.map("map").setView([0,0], 16);  //asking for location..and map is set
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{  //gets the dynamic value to show the map
     attribution: "Srinjoy Codes" //gives a attribute
}).addTo(map)

const markers = {};

//the socket now transfers to frontend..and sends the current location for the main user
socket.on("receive-location", (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude]);
    if(markers[id]) {
      markers[id].setLatLng([latitude,longitude]);
    } else {
      markers[id] = L.marker([latitude, longitude]).addTo(map); //adds markers to the users
    }
});


//don't hide the marker if its disconnected
socket.on("user-disconnect", (id) => {
   if(markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
   }
})