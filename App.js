// import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome } from "@expo/vector-icons";
import { DataTable } from "react-native-paper";

const HomeScreen = ({ navigation, route }) => {
  const [orgPrice, setOrgPrice] = useState("");
  const [disPercent, setDisPercent] = useState("");
  const [saveBtnDisable, setSaveBtnDisable] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(route.params !== undefined ? Object.values(route.params) : []);
  }, [route.params]);

  useEffect(() => {
    console.log("useffect");
    if (orgPrice !== "") {
      setSaveBtnDisable(false);
    } else {
      setSaveBtnDisable(true);
    }
  }, [orgPrice]);

  const orgPriceHandler = (price) => {
    if (price >= 0) {
      setOrgPrice(price);
      setSaveBtnDisable(false);
    }
  };

  const disPercentHandler = (percent) => {
    if (percent <= 100) {
      setDisPercent(percent);
    }
  };

  const saveAmount = () => {
    let disAmount = orgPrice * (disPercent / 100);
    return disAmount.toFixed(2);
  };
  const finalPrice = () => {
    let finalAmount = orgPrice - saveAmount();
    return finalAmount.toFixed(2);
  };

  const clearInputData = () => {
    setOrgPrice("");
    setDisPercent("");
    setSaveBtnDisable(true);
  };

  const saveDataHandler = () => {
    if (saveBtnDisable === false) {
      const newData = {
        id: Math.random(),
        Original_Price: orgPrice,
        DiscountPercentage: disPercent == "" ? 0 : disPercent,
        FinalPriceAfterDiscount: finalPrice(),
      };
      setData([...data, newData]);
      //console.log(data)
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.historyBtn}
          onPress={() => navigation.navigate("HISTORY", data)}
        >
          <FontAwesome name="history" size={26} color="white" />
        </TouchableOpacity>
      ),
    });
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.opText}>Original Price:</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          onChangeText={orgPriceHandler}
          value={orgPrice}
        />
        <Text style={styles.opText}>Discount Percentage:</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          onChangeText={disPercentHandler}
          value={disPercent}
        />
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.resText}>
          {orgPrice !== 0 && disPercent !== 0
            ? "You Save : $" + saveAmount()
            : ""}
        </Text>
        <Text style={styles.resText}>
          {orgPrice !== 0 && disPercent !== 0
            ? "Final Price : $" + finalPrice()
            : ""}
        </Text>
      </View>

      <View style={styles.calcBtn}>
        <TouchableOpacity onPress={saveDataHandler}>
          <Text
            style={
              saveBtnDisable === false ? styles.saveBtn : styles.saveBtnDisable
            }
          >
            <FontAwesome name="save" size={22} color="white" />
            {"  "} SAVE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearInputData}>
          <Text style={styles.clearBtn}>
            <FontAwesome name="close" size={22} color="white" />
            {"  "} CLEAR
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HistoryScreen = ({ navigation, route }) => {
  const [list, setList] = useState(route.params);

  const deleteItem = (id) => {
    let tempList = list.filter((el) => el.id != id);
    console.log(tempList);
    setList([...tempList]);
  };

  const clearList = () => {
    if (list.length > 0) {
      Alert.alert(
        "Clear History",
        "Are you really want to clear history?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => setList([]),
          },
        ],
        { cancelable: true }
      );
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.historyBtn} onPress={clearList}>
          <FontAwesome name="minus-square" size={26} color="white" />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.historyBtn}
          onPress={() => navigation.navigate("HOME", list)}
        >
          <FontAwesome name="chevron-left" size={26} color="black" />
        </TouchableOpacity>
      ),
    });
  });

  return (
    <View style={styles.container}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title numeric>Original Price</DataTable.Title>
          <DataTable.Title numeric>Discount</DataTable.Title>
          <DataTable.Title numeric>Final Price</DataTable.Title>
          <DataTable.Title numeric>Delete</DataTable.Title>
        </DataTable.Header>

        <SafeAreaView>
          <ScrollView>
            {list.map((el) => (
              <DataTable.Row key={el.id}>
                <DataTable.Cell numeric>
                  {"$" + el.Original_Price}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {el.DiscountPercentage + " %"}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {"$" + el.FinalPriceAfterDiscount}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => deleteItem(el.id)}
                  >
                    <FontAwesome name="trash" size={22} color="#8e44ad" />
                  </TouchableOpacity>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </ScrollView>
        </SafeAreaView>
      </DataTable>
    </View>
  );
};

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HOME">
        <Stack.Screen
          name="HOME"
          component={HomeScreen}
          options={{
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#8c7ae6" },
            headerTitleStyle: { color: "white" },
          }}
        />
        <Stack.Screen
          name="HISTORY"
          component={HistoryScreen}
          options={{
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#8c7ae6" },
            headerTitleStyle: { color: "white" },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "center",
    margin: 10,
  },
  inputContainer: {
    marginTop: 15,
  },
  historyBtn: {
    margin: 10,
    padding: 10,
    borderRadius: 30,
  },
  textInput: {
    borderRadius: 5,
    width: 300,
    height: 50,
    fontSize: 20,
    paddingLeft: 15,
    marginBottom: 40,
    backgroundColor: "#ecf0f1",
  },
  resultContainer: {
    marginTop: 40,
  },
  opText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#8e44ad",
  },
  resText: {
    fontSize: 20,
    color: "black",
    margin: 2,
    textAlign: "center",
  },
  calcBtn: {
    marginTop: 80,
    flexDirection: "row",
  },
  saveBtn: {
    fontSize: 18,
    color: "white",
    backgroundColor: "#8c7ae6",
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  saveBtnDisable: {
    fontSize: 18,
    color: "white",
    backgroundColor: "#e1e1e1",
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  clearBtn: {
    fontSize: 18,
    color: "white",
    backgroundColor: "#8c7ae6",
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  deleteBtn: {
    margin: 10,
    padding: 10,
    borderRadius: 40,
    backgroundColor: "#eef2f3",
  },
});

export default App;
