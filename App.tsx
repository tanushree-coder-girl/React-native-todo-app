import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Splash from "./screens/Splash";
import Home from "./screens/Home";
import CreateTask from "./screens/CreateTask";

import store from "./redux/store";
import { Provider } from "react-redux";
import Camera from "./screens/Camera";

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#230057",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontSize: 25,
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen
            options={{ headerShown: false }}
            name="Splash"
            component={Splash}
          />

          <Stack.Screen
            options={{ headerTitle: "Current Task" }}
            name="My-tasks"
            component={Home}
          />

          <Stack.Screen
            options={{ headerTitle: "Create Task" }}
            name="create-task"
            component={CreateTask}
          />

          <Stack.Screen
            options={{ headerTitle: "Camera" }}
            name="camera"
            component={Camera}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
