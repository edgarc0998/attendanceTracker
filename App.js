import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import Circle from "react-native-maps";
import MapContainer from "react-native-maps";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      location: {},
      attendanceZone: { latitude: 41.8781, longitude: -87.6298 },
      inAttendanceZone: false
    };
    this.getLocation = this.getLocation.bind(this);
    this.getDistanceFromLatLonInMiles = this.getDistanceFromLatLonInMiles.bind(
      this
    );
    this.deg2rad = this.deg2rad.bind(this);
    this.checkAttendanceZone = this.checkAttendanceZone.bind(this);
  }

  checkAttendanceZone() {
    var inside = false;
    if (
      this.getDistanceFromLatLonInMiles(
        this.state.attendanceZone.latitude,
        this.state.attendanceZone.longitude,
        this.state.location.latitude,
        this.state.location.longitude
      ) > 0.1
    ) {
      inside = true;
    } else {
      inside = false;
    }


    this.setState({ inAttendanceZone: inside });
  }

  async getLocation() {
    let status = await Permissions.askAsync(Permissions.LOCATION);

    let location = await Location.getCurrentPositionAsync({});

    this.setState({ location: location.coords });
  }

  async componentDidMount() {
    await this.getLocation();
    await this.checkAttendanceZone();
  }

  getDistanceFromLatLonInMiles(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d / 1.609;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  render() {
    var lat = 0;
    var lng = 0;
    var totalDist = 0;

    if (this.state.location) {
      lat = this.state.location.latitude;
      lng = this.state.location.longitude;
      totalDist = this.getDistanceFromLatLonInMiles(
        41.8781,
        -87.6298,
        lat,
        lng
      );
    }

    console.log("state", this.state);
    return (
      <View style={styles.container}>
        <Text>Attendance Tracker</Text>
        <Text>
          Your current Lat/Long: {lat},{lng}
        </Text>

        <Text>Total distance is: {totalDist} miles</Text>
        <Text>
          In Attendance zone?{" "}
          {this.state.inAttendanceZone ? <Text>Yes</Text> : <Text>No</Text>}
        </Text>

        <View style={{ display: "flex", backgroundColor: "red" }}>
          <MapView
            style={{ height: 400, width: 400 }}
            initialRegion={{
              latitude: 41.8781,
              longitude: -87.6298,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
            showsUserLocation
          >
            <MapView.Circle
              radius={30}
              center={{ latitude: 41.872106, longitude: -87.64983 }}
              strokeWidth={0}
              strokeColor="black"
              fillColor="rgba(255,0,0,0.5)"
            />
          </MapView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default App;
