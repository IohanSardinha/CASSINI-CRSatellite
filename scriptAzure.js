var queryArg = getQueryVariable("crsatellite");
var locationArg = getQueryVariable("location");

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
}

function play() {
  if (queryArg == "false") {
    var audio = new Audio("audio.mp3");
    audio.play();
  }
}

const queryString = window.location.search;

// Create a URLSearchParams object to work with the query string
const params = new URLSearchParams(queryString);

const toggleButton = document.getElementById("toggleButton");
const toggleText = document.getElementById("toggleText");
const toggleText2 = document.getElementById("toggleText2");
const crsateliteValue = params.get("crsatellite") === "true";

toggleButton.checked = crsateliteValue;
toggleText.innerHTML = crsateliteValue
  ? "You are using CRSatellite technology™"
  : "You are <b>not</b> using CRSatellite technology™";

toggleText2.innerHTML = crsateliteValue
  ? "You are using CRSatellite technology™"
  : "You are <b>not</b> using CRSatellite technology™";

toggleButton.addEventListener("change", function () {
  play();

  const isChecked = toggleButton.checked;

  // Modify the URL based on the toggle state
  const currentURL = window.location.href;
  const baseURL = currentURL.split("?")[0]; // Get the URL without parameters

  // Construct the new URL with the updated parameter
  const newURL = `${baseURL}?crsatellite=${!crsateliteValue}&location=${locationArg}`;

  // Redirect to the new URL
  if (queryArg == "false") {
    setTimeout(function() {
      window.location.href = newURL;
  }, 2250);}
  else window.location.href = newURL;
});

var map,
  datasource,
  client,
  popup,
  searchInput,
  resultsPanel,
  searchInputLength,
  centerMapOnResults;

var squareCenter;

function getData(squareCoordinates) {
  let array = [];
  if (queryArg == "true") {
    array.push([
      [
        squareCoordinates.bottomLeft.longitude,
        squareCoordinates.bottomLeft.latitude,
      ],
      [
        squareCoordinates.bottomRight.longitude,
        squareCoordinates.bottomRight.latitude,
      ],
      [
        squareCoordinates.topRight.longitude,
        squareCoordinates.topRight.latitude,
      ],
      [squareCoordinates.topLeft.longitude, squareCoordinates.topLeft.latitude],
      [
        squareCoordinates.bottomLeft.longitude,
        squareCoordinates.bottomLeft.latitude,
      ],
    ]);
  } else {
    array = [
      [
        [50, 50],
        [50, 50],
        [50, 50],
        [50, 50],
        [50, 50],
      ],
    ];
  }
  console.log(array);
  const data = {
    avoidAreas: {
      type: "MultiPolygon",
      coordinates: [array],
    },
  };
  return data;
}

function getSquareCoords(centerLongitude, centerLatitude) {
  const squareSideLength = 500; // Side length in meters

  const squareCoordinates = calculateSquareCoordinates(
    centerLatitude,
    centerLongitude,
    squareSideLength
  );
  console.log(squareCoordinates);
  return squareCoordinates;
}

function calculateSquareCoordinates(centerLat, centerLong, sideLength) {
  // Earth's radius in meters
  const earthRadius = 6371000; // approximately 6371 km

  // Convert the latitude and longitude from degrees to radians
  const centerLatRad = (centerLat * Math.PI) / 180;
  const centerLongRad = (centerLong * Math.PI) / 180;

  // Calculate the distance in meters for 1 degree of latitude and longitude
  const latMetersPerDegree = (2 * Math.PI * earthRadius) / 360;
  const longMetersPerDegree =
    (2 * Math.PI * earthRadius * Math.cos(centerLatRad)) / 360;

  // Calculate half of the side length in meters
  const halfSide = sideLength / 2;

  // Calculate the coordinates of the square's corners
  const topLeftLat = centerLat + halfSide / latMetersPerDegree;
  const topLeftLong = centerLong - halfSide / longMetersPerDegree;

  const topRightLat = centerLat + halfSide / latMetersPerDegree;
  const topRightLong = centerLong + halfSide / longMetersPerDegree;

  const bottomLeftLat = centerLat - halfSide / latMetersPerDegree;
  const bottomLeftLong = centerLong - halfSide / longMetersPerDegree;

  const bottomRightLat = centerLat - halfSide / latMetersPerDegree;
  const bottomRightLong = centerLong + halfSide / longMetersPerDegree;

  return {
    topLeft: { latitude: topLeftLat, longitude: topLeftLong },
    topRight: { latitude: topRightLat, longitude: topRightLong },
    bottomLeft: { latitude: bottomLeftLat, longitude: bottomLeftLong },
    bottomRight: { latitude: bottomRightLat, longitude: bottomRightLong },
  };
}
function calculateRouteAndDraw() {
  const dataSource = new atlas.source.DataSource();
  map.sources.add(dataSource);

  const url =
    locationArg == "Dublin"
      ? "https://atlas.microsoft.com/route/directions/json?api-version=1.0&query=53.176029,-6.530700:53.120952,-6.536188&report=effectiveSettings&subscription-key=RnWEsy67YQbp3yAKYBonde_jG_yXwJsug9kmpQwsMAU"
      : "https://atlas.microsoft.com/route/directions/json?api-version=1.0&query=40.266325,-7.490718:40.321862,-7.613119&report=effectiveSettings&subscription-key=RnWEsy67YQbp3yAKYBonde_jG_yXwJsug9kmpQwsMAU";

  // Create a layer for rendering the route line under the road labels.
  map.layers.add(
    new atlas.layer.LineLayer(dataSource, null, {
      strokeColor: "#2272B9",
      strokeWidth: 5,
      lineJoin: "round",
      lineCap: "round",
    }),
    "labels"
  );

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  //cdn-icons-png.flaticon.com/512/1684/1684438.png

  map.imageSprite
    .add("flood-icon", "https://cdn-icons-png.flaticon.com/512/427/427112.png")
    .then(function () {
      var raw = JSON.stringify({
        threshold: 0.6,
        max_lat: 53,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      fetch("http://10.218.51.175:5000/flood_emergencies", requestOptions)
        .then((response) => response.json())
        .then((emergencies) => {
          let floods_number = document.querySelector("#flooding");
          let i = 0;
          Object.keys(emergencies).forEach((e) => {
            i++;

            dataSource.add(
              new atlas.Shape(
                new atlas.data.Feature(
                  new atlas.data.Point([
                    parseFloat(e.toString().split(",")[1]),
                    parseFloat(e.toString().split(",")[0]),
                  ]),
                  {
                    title: "Flood",
                    icon: "flood-icon",
                  }
                )
              )
            );
          });
          floods_number.innerHTML = i;
        })
        .catch((error) => console.log("error", error));
    });

  map.imageSprite
    .add(
      "fire-icon",
      "https://cdn-icons-png.flaticon.com/512/785/785116.png" //fire
    )
    .then(function () {
      var raw = JSON.stringify({
        threshold: 5,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      fetch("http://10.218.51.175:5000/fire_emergencies", requestOptions)
        .then((response) => response.json())
        .then((emergencies) => {
          let i = 0;
          let fires_number = document.querySelector("#fires");
          Object.keys(emergencies).forEach((e) => {
            i++;

            dataSource.add(
              new atlas.Shape(
                new atlas.data.Feature(
                  new atlas.data.Point([
                    parseFloat(e.toString().split(",")[1]),
                    parseFloat(e.toString().split(",")[0]),
                  ]),
                  {
                    title: "Fire",
                    icon: "fire-icon",
                  }
                )
              )
            );
          });
          fires_number.innerHTML = i;
        })
        .catch((error) => console.log("error", error));
    });

  map.imageSprite
    .add(
      "landslide-icon",
      "https://cdn-icons-png.flaticon.com/512/1684/1684438.png"
    )
    .then(function () {
      dataSource.add(
        new atlas.Shape(
          new atlas.data.Feature(new atlas.data.Point([-7.545327, 40.305805]), {
            title: "Landslide",
            icon: "landslide-icon",
          })
        )
      );
    });
  // Create the GeoJSON objects which represent the start and end points of the route.

  let dataSource2 = new atlas.source.DataSource();
  const startPoint = new atlas.data.Feature(
    new atlas.data.Point(
      locationArg == "Dublin" ? [-6.5307, 53.176029] : [-7.490718, 40.266325]
    ),
    {
      title: "Hospital",
      icon: "pin-blue",
    }
  );

  const endPoint = new atlas.data.Feature(
    new atlas.data.Point(
      locationArg == "Dublin" ? [-6.536188, 53.120952] : [-7.613119, 40.321862]
    ),
    {
      title: "Help needed",
      icon: "pin-round-red",
    }
  );

  // Add the data to the data source.
  dataSource2.add([startPoint, endPoint]);
  map.sources.add(dataSource2);
  // Create a layer for rendering the start and end points of the route as symbols.
  map.layers.add(
    new atlas.layer.SymbolLayer(dataSource, null, {
      iconOptions: {
        image: ["get", "icon"],
        allowOverlap: true,
        ignorePlacement: true,
        size: 0.07,
      },
      textOptions: {
        textField: ["get", "title"],
        offset: [0, 1.2],
      },
      filter: [
        "any",
        ["==", ["geometry-type"], "Point"],
        ["==", ["geometry-type"], "MultiPoint"],
      ],
    })
  );
  map.layers.add(
    new atlas.layer.SymbolLayer(dataSource2, null, {
      iconOptions: {
        image: ["get", "icon"],
        allowOverlap: true,
        ignorePlacement: true,
      },
      textOptions: {
        textField: ["get", "title"],
        offset: [0, 1.2],
      },
      filter: [
        "any",
        ["==", ["geometry-type"], "Point"],
        ["==", ["geometry-type"], "MultiPoint"],
      ],
    })
  );

  // Here we select the points to avoid
  avoidSquareCoordinatesSerra = getSquareCoords(-7.545327, 40.305805);
  avoidSquareCoordinatesDublin = getSquareCoords(-6.55024, 53.150185);
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // You can include any other headers if needed
    },
    body: JSON.stringify(
      getData(
        locationArg == "Dublin"
          ? avoidSquareCoordinatesDublin
          : avoidSquareCoordinatesSerra
      )
    ),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Request failed with status: ${response.status}`);
      }
    })
    .then((response) => {
      // Process the response data as needed
      console.log("Response Data:", response);

      const bounds = [];
      const route = response.routes[0];

      // Create an array to store the coordinates of each turn
      let routeCoordinates = [];
      route.legs.forEach((leg) => {
        const legCoordinates = leg.points.map((point) => {
          const position = [point.longitude, point.latitude];
          bounds.push(position);

          return position;
        });
        // Add each turn coordinate to the array
        routeCoordinates = routeCoordinates.concat(legCoordinates);
      });

      // Add route line to the dataSource
      dataSource.add(
        new atlas.data.Feature(new atlas.data.LineString(routeCoordinates))
      );

      // Update the map view to center over the route.
      map.setCamera({
        bounds: new atlas.data.BoundingBox.fromLatLngs(bounds),
        padding: 40,
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function drawSquares() {
  /*Create a data source and add it to the map*/
  var dataSource = new atlas.source.DataSource();
  map.sources.add(dataSource);

  let redSquare = getSquareCoords(-7.545327, 40.305805);

  /*Create a rectangle*/
  dataSource.add(
    new atlas.Shape(
      new atlas.data.Feature(
        new atlas.data.Polygon([
          [
            squareCoordinates.bottomLeft.longitude,
            squareCoordinates.bottomLeft.latitude,
          ],
          [
            squareCoordinates.bottomRight.longitude,
            squareCoordinates.bottomRight.latitude,
          ],
          [
            squareCoordinates.topRight.longitude,
            squareCoordinates.topRight.latitude,
          ],
          [
            squareCoordinates.topLeft.longitude,
            squareCoordinates.topLeft.latitude,
          ],
          [
            squareCoordinates.bottomLeft.longitude,
            squareCoordinates.bottomLeft.latitude,
          ],
        ])
      )
    )
  );

  /*Create and add a polygon layer to render the polygon to the map*/
  map.layers.add(
    new atlas.layer.PolygonLayer(dataSource, null, {
      fillColor: "red",
      fillOpacity: 0.7,
    }),
    "labels"
  );
}

function GetMap() {
  //Initialize a map instance.
  map = new atlas.Map("myMap", {
    zoom: 16,
    view: "Auto",

    //Add authentication details for connecting to Azure Maps.
    authOptions: {
      //Alternatively, use an Azure Maps key. Get an Azure Maps key at https://azure.com/maps. NOTE: The primary key should be used as the key.
      authType: "subscriptionKey",
      subscriptionKey: "RnWEsy67YQbp3yAKYBonde_jG_yXwJsug9kmpQwsMAU",
    },
  });
  map.events.add("load", async () => {
    calculateRouteAndDraw();
  });

  /*   map.events.add("ready", function () {
    drawSquares();
  }); */
}
