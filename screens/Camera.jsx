import { Alert, Text, } from 'react-native'
import React from 'react'
import { RNCamera } from 'react-native-camera'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useCamera } from 'react-native-camera-hooks';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setTasks } from './../redux/reducer';

export default function Camera({ navigation, route }) {
    const [{ cameraRef }, { takePicture }] = useCamera(null);
    const { task } = useSelector((state) => state.taskReducer);
    const dispatch = useDispatch();

    const captureHandle = async () => {
        try {
            const data = await takePicture();
            const filePath = data.uri;
            updateTask(route.params.id, filePath)
        } catch (error) {
            console.log(error)
        }
    }

    const updateTask = (id, filePath) => {
        const index = task.findIndex(t => t.id === id)
        if (index > -1) {
            let newTask = [...task];
            newTask[index].Image = filePath;
            AsyncStorage.setItem('tasks', JSON.stringify(newTask)).then(() => {
                dispatch(setTasks(newTask));
                Alert.alert('Success', "Image Saved Successfully");
                navigation.goBack();
            }).catch(err => console.error(err));
        }
    }

    return (
        <View style={styles.body}>
            <RNCamera ref={cameraRef} type={RNCamera.Constants.Type.back} style={styles.preview}>
                <TouchableOpacity onPress={() => captureHandle()} style={styles.buttonView}>
                    <FontAwesome5 name="camera" size={40} color={'#230057'} />
                </TouchableOpacity>
            </RNCamera>
        </View>

    )
}



const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    preview: {
        flex: 1
    },
    buttonView: {
        flex: 1,
        justifyContent: 'flex-end'

    }
})