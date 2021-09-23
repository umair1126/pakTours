import mapboxgl from "mapbox-gl";

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoidW1haXI2NTEiLCJhIjoiY2t0ZTFhNmNiMDVnYjJ2bXB1MzI5NDJyMyJ9.sZUTvJDp9_MkGddq7djMEQ";

  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/umair651/cktl6m9hi1fp518jywha0c5n0",
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // create marker
    const el = document.createElement("div");
    el.className = "marker";

    // add marker
    new mapboxgl.Marker({
      element: el,
      anchor: "button",
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
