import { View, Text, Image, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'

import PushNotification, { Importance } from 'react-native-push-notification';

export default function Splash({ navigation }) {
    useEffect(() => {
        createNotificationChannel();

        const id = setTimeout(() => {
            navigation.replace('My-tasks')
        }, 2000)

        return () => {
            clearTimeout(id)
        };
    }, []);

    const createNotificationChannel = () => {
        PushNotification.createChannel(
            {
                channelId: "task-channel",
                channelName: "Task channel",
                importance: Importance.HIGH,
            },
            (created) => console.log(`createChannel returned '${created}'`)
        );
    }

    return (
        <View style={styles.body}>
            <Image style={styles.logo} source={require('../assets/logo.png')} />
            <Text style={styles.text}>To-Do List</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#230057'
    },
    logo: {
        width: 200,
        height: 200,
    },
    text: {
        color: '#fff',
        fontSize: 50,
        fontWeight: 'bold',
        margin: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#fafafa',
    }
})