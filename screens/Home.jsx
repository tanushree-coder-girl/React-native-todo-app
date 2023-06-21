import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ToDo from './ToDo';
import Done from './Done';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();

export default function Home() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: (focused, size, color) => {
                    let iconName;

                    if (route.name == "ToDo") {
                        iconName = "clipboard-list";
                        size = focused ? 25 : 20;
                        color = focused ? "#230057" : '#000'
                    } else if (route.name == "Done") {
                        iconName = "clipboard-check";
                        size = focused ? 25 : 20;
                        color = focused ? "#230057" : '#000'

                    }

                    return (
                        <FontAwesome5 name={iconName} size={size} color={color} />
                    )
                },
                tabBarActiveTintColor: '#230057',
                tabBarInactiveTintColor: '#777777',
                tabBarLabelStyle: {
                    fontSize: 15,
                    fontWeight: 'bold'
                }
            })
            }
        >
            <Tab.Screen options={{ headerShown: false }} name="ToDo" component={ToDo} />
            <Tab.Screen options={{ headerShown: false }} name="Done" component={Done} />
        </Tab.Navigator>
    )
}