import React,{useState,useEffect} from 'react';
import { View, Text , Button, StyleSheet , FlatList, ScrollView,TouchableOpacity} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';



const CountryStatisticsScreen = ( {route , navigation} ) => {
  
  const [countries,setCountries] = useState();
  const [getList,setList] = useState([]);

  const [countryConfirmed, setCountryConfirmed] = useState();
  const [countryCritical, setCountryCritical] = useState();
  const [countryRecovered, setCountryRecovered] = useState();
  const [countryDeaths, setCountryDeaths] = useState();

  const [country,setCountry] = useState();
 
  const [getFav, setFav] = useState([]);

  const [showList, setshowList] = useState(true);
  const [countryData, setCountryData] = useState([]);
  const [currentCountry, setCurrentCountry] = useState([]);
  
  let [favouriteCountries, setfavouriteCountries] = useState([]);
  const addFav = (item) =>{
    setFav([...getFav,setFav]);
  }
 
  useEffect( () => {
    setCountry()
    getCountries();
    getDataOfCountry();
  },[])

  function getCountries() {
    
    var options = {
      method: 'GET',
      url: 'https://world-population.p.rapidapi.com/allcountriesname',
      headers: {
        'x-rapidapi-key': '7297109902msh49d63f721507e51p1c51c9jsn4072eaad2639',
        'x-rapidapi-host': 'world-population.p.rapidapi.com'
      }
    };

    axios.request(options).then(function (response) {
      console.log(response.data);
      
      setCountries(response.data.body.countries);
      setList([...getList, response.data.body.countries] );
    
    }).catch(function (error) {
      console.error(error);
    });
  }
  const addToFavourites= async(value)=> {
    try {
      await AsyncStorage.setItem('@fav_countries', JSON.stringify(value));
      const myArray = await AsyncStorage.getItem('@fav_countries');
    } catch (e) {
      console.log(e);
    }
  }
   


  function getDataOfCountry() {
    
    fetch('https://api.covid19api.com/summary', { method: 'GET' })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.Countries)
        setCountryData(responseJson.Countries)
        setCountryConfirmed(responseJson.Countries.confirmed)
        setCountryDeaths(responseJson.Countries.deaths)
        setCountryCritical(responseJson.Countries.critical)
        setCountryRecovered(responseJson.Countries.recovered)
      })
      .catch((error) => {
        console.error(error);
      }); 
    /*
    var options = {
      method: 'GET',
      url: 'https://covid-19-data.p.rapidapi.com/country',
      params: {name: country},
      headers: {
        'x-rapidapi-key': '7297109902msh49d63f721507e51p1c51c9jsn4072eaad2639',
        'x-rapidapi-host': 'covid-19-data.p.rapidapi.com'
      }
    };

    axios.request(options).then(function (response) {
      console.log(response.data);
      setCountryConfirmed(response.data.country);
      setCountryCritical(response.data.critical);
      setCountryDeaths(response.data.deaths);
      setCountryRecovered(response.data.recovered);
    }).catch(function (error) {
      console.error(error);
    });*/
}
  
  
  const displayStats = (item) => {
    setshowList(false)
    setCurrentCountry(item)
    console.log(showList)
    return(
      <View>
        <Text>{item} statistics </Text>
        <Text>Confirmed cases: {countryConfirmed}</Text>
        <Text>Critical cases: {countryCritical}</Text>
        <Text>Death cases: {countryDeaths}</Text>
        <Text>Recoverd cases: {countryRecovered}</Text>
      </View>
    );
  }

  const DisplayStats = (props) => {
      return(
        <View>
          <Text style={{fontSize:20,paddingTop:30,paddingBottom:30,fontWeight:"bold"}}>
          {props.item.Country} statistics 
          </Text>        
          <Text>Confirmed cases: {props.item.TotalConfirmed}</Text>
          <Text>Death cases: {props.item.TotalDeaths}</Text>
          <Text>Recoverd cases: {props.item.TotalRecovered}</Text>
          <Entypo name="star" size={24} color="blue" onPress={()=>{
            favouriteCountries = [...favouriteCountries,props.item]
            addToFavourites(favouriteCountries);
            console.log(favouriteCountries)
          }}/>
        </View>
      );
  }



  return(
    
    <ScrollView>
    
    <View style={styles.container}>
      
      <View style={{alignItems:"center"}}>
        
        <Text style={{fontSize:20,paddingTop:30,paddingBottom:30,fontWeight:"bold"}}>Country Statistics screen </Text>
      
      </View>
      
      
      {showList === true? 
      
      (<View>
        
        <FlatList
        data={countryData}
        renderItem={({item})=>(
          
          <TouchableOpacity 
            activeOpacity={0.5}
            onPress={()=>{displayStats(item)}}
          >
            <View
              style={{
                flexDirection: 'row',
                padding: 10,
                borderBottomWidth: 1,
                borderColor: 'grey',
              }}>
             
              <View style={{ paddingLeft:20 , paddingRight:50 , flexDirection:"row",justifyContent:"space-between"}}>
                
                <Text  style={{fontSize:15}}> {item.Country} </Text>
                <Ionicons name="star-outline" size={24} color="lightblue"
                  onPress = {(item) => addFav(item)}    />
              
              </View>
            
            </View>
          
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => item.id}
      />

    </View>
    ):(<DisplayStats 
          item = {currentCountry}
        />)
      }
      
      </View>
      </ScrollView>
  );
}




const WorldStatisticsScreen = ({navigation}) => {
  
  
  const [confirmed,setConfirmed] = useState();
  const [critical,setCritical] = useState();
  const [deaths,setDeaths] = useState();
  const [lastChange,setLastChange] = useState();
  const [lastUpdate,setLastUpdate] = useState();
  const [recovered,setRecovered] = useState();
  
  const [worldPopulation,setWorldPopulation] = useState();
  
  
  useEffect(() => {
    
    getData();
    getPopulation();
  },[])
  
  
  function getData(){

    
    var options = {
      method: 'GET',
      url: 'https://covid-19-data.p.rapidapi.com/totals',
      headers: {
        'x-rapidapi-key': '407dcfb4d8msh6fbe7a6d709521cp1f2c51jsnc0a21c33e440',
        'x-rapidapi-host': 'covid-19-data.p.rapidapi.com'
      }
    };


    axios.request(options).then(function (response) {
      
      console.log(response.data);
      
      setConfirmed(response.data[0].confirmed)
      setCritical(response.data[0].critical)
      setDeaths(response.data[0].deaths)
      setLastChange(response.data[0].lastChange)
      setLastUpdate(response.data[0].lastUpdate)
      setRecovered(response.data[0].recovered)

    }).catch(function (error) {
      console.error(error);
    });
  }

  function getPopulation(){
    
    var options = {
      method: 'GET',
      url: 'https://world-population.p.rapidapi.com/worldpopulation',
      headers: {
        'x-rapidapi-key': '7297109902msh49d63f721507e51p1c51c9jsn4072eaad2639',
        'x-rapidapi-host': 'world-population.p.rapidapi.com'
      }
    };

    axios.request(options).then(function (response) {
      console.log(response.data);
      setWorldPopulation(response.data.body.world_population);
    }).catch(function (error) {
      console.error(error);
    });

  }

  return (
    <View style={{alignItems:"center"}}>
      
         <Text style={{fontSize:20,paddingTop:30,fontWeight:"bold"}}>World Statistics Screen
      </Text>
      <Text> </Text>
        <View style={styles.container}>
          <Text> World Population: {worldPopulation}</Text>
          <Text> </Text>
          
          <Text> Confirmed cases  :   {confirmed}       {(confirmed/worldPopulation*100).toFixed(2)}%</Text>
          <Text> </Text>
          
          <Text> Critical cases  : {critical}                   {(critical/worldPopulation*100).toFixed(2)}% </Text>
          <Text> </Text>


          <Text> Death cases  : {deaths}                  {(deaths/worldPopulation*100).toFixed(2)}% </Text>
          <Text> </Text>

          <Text> Recovered cases  : {recovered}         {(recovered/worldPopulation*100).toFixed(2)}% </Text>
        <Text> </Text>

        <Text> Last Change cases: {lastChange} </Text> <Text> </Text>
        <Text> Last Update cases: {lastUpdate} </Text> <Text> </Text>

        <Text> </Text>
      </View>
    </View>
  );
}



const FavouritesScreen = () => {

  const [favorites,setfavourites] = useState({})
  const getDataFromStorage = async () => {
    try {
      const myArray = await AsyncStorage.getItem('@fav_countries')
      if (myArray !== null) {
        setfavourites(JSON.parse(myArray));
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect( () => {
    getDataFromStorage()
  },[])

  return(
    <View style={{alignItems:"center"}}>
      <Text style={{
        fontSize:20,
        paddingTop:30,
        paddingBottom:30,
        fontWeight:"bold"
      }}>  
        Favourites Screen 
      </Text>
      
    </View>
  );
}






const Drawer = createDrawerNavigator();

function MyDrawer() {
  
  return (
    
    <Drawer.Navigator
      openByDefault = {false}
      initialRouteName = "WorldStatistics"
      //drawerType = "permanent"
      drawerType = "slide"
      drawerStyle = {{
        backgroundColor: 'lightblue',
        width:200,
      }}
      screenOptions={{
        headerShown: true,
        headerTintColor: 'blue',
        headerStyle: {
          backgroundColor: 'lightblue',
        headerLeft : ({navigation}) => <Ionicons 
            name="md-menu" 
            size={32} 
            color="blue" 
            onPress = { () => navigation.toggleDrawer() }
        />
      },
    }}>
      
      
      <Drawer.Screen 
        name="WorldStatistics" 
        component={WorldStatisticsScreen} 
        options = {{
          drawerLabel : "World statistics",
          drawerIcon : () =>  <Fontisto name="world-o" size={24} color="black" />
        }}  
      />
      
      
      <Drawer.Screen 
        name="Country statistics" 
        component={CountryStatisticsScreen}
        options = {{
          drawerIcon : () =>  <MaterialIcons name="location-city" size={24} color="black" />
        }}
      />


      <Drawer.Screen 
        name="Favourites" 
        component={FavouritesScreen}
        options = {{
          drawerIcon : () =>  <Ionicons name="star-outline" size={24} color="black" />
        }}
      />

    </Drawer.Navigator>
  );
}



function App() {
  return (
    <NavigationContainer>
      
      <MyDrawer />
    
    </NavigationContainer>
  );
}

export default App;


const styles = StyleSheet.create({

  container: { 
    //flex:1, 
    //alignItems: 'center', 
    justifyContent: 'center' ,
    paddingTop:10,
  }

});


