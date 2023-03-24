const API_KEY = "qC3hMKBFOG-AzwoMBan43NIsezexN_blhUq4v80Xj9Q";

export default function getAddressFromCoordinates(latitude, longitude) {
  console.log(`Latitude EEEE: ${latitude}, Longitude: ${longitude}`);
  const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?apikey=${API_KEY}&at=${latitude},${longitude}&lang=pt-BR`;
  return fetch(url)
    .then((res) => res.json())
    .then((resJson) => {
      //   console.log("\x1b[36m%s\x1b[0m", resJson.items[0].address); //cyan

      // the response had a deeply nested structure :/
      if (resJson.items[0].address) {
        let address_array = resJson.items[0].address;
        console.log(address_array);
        return address_array.city;
        // resolve(resJson.Response.View[0].Result[0].Location.Address.Label);
      } else {
      }
    })
    .catch((e) => {
      console.log("Error in getAddressFromCoordinates", e);
    });
}
