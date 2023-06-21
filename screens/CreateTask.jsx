import { View, Text, TextInput, Pressable, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert, TouchableOpacity, Image, Modal } from 'react-native'
import React from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { setTasks } from './../redux/reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CheckBox from '@react-native-community/checkbox';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import PushNotification from "react-native-push-notification";

import RNFS from 'react-native-fs';

export default function CreateTask({ navigation }) {
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [done, setDone] = React.useState(false)
    const [color, setColor] = React.useState('white')
    const [showBellModal, setShowBellModal] = React.useState(false)
    const [bellTime, setBellTime] = React.useState('1')
    const [image, setImage] = React.useState('');

    const { task, taskID } = useSelector((state) => state.taskReducer);
    const dispatch = useDispatch()

    React.useEffect(() => {
        navigation.addListener('focus', () => {
            getTask();
        });
    }, []);

    const getTask = () => {
        const isTask = task.find(t => t.id === taskID)
        if (isTask) {
            setTitle(isTask.title)
            setDescription(isTask.description)
            setDone(isTask.done)
            setColor(isTask.color)
            setImage(isTask.Image)
        }
    }

    const setTask = () => {
        if (title.length == 0) {
            Alert.alert('Warning', 'Title field cannot be empty')
        } else {
            try {
                const myTask = {
                    id: taskID,
                    title,
                    description,
                    done,
                    color,
                    image
                }

                // check if edit or not 
                const index = task.findIndex(t => t.id == taskID)
                let newTask = [];
                if (index > -1) {
                    newTask = [...task];
                    newTask[index] = myTask;
                } else {
                    newTask = [...task, myTask];
                }

                AsyncStorage.setItem('tasks', JSON.stringify(newTask)).then(() => {
                    dispatch(setTasks(newTask));
                    Alert.alert('Success', "Task Saved Successfully");
                    navigation.goBack();
                }).catch(err => console.error(err));

            } catch (e) {
                console.log(e)
            }
        }
    }

    const notificationHandler = () => {
        PushNotification.localNotificationSchedule({
            channelId: "task-channel",
            title: title,
            message: description,
            date: new Date(Date.now() + parseInt(bellTime) * 60 * 1000),
            allowWhileIdle: true,
        });
    }

    // const deleteImg = () => {
    //     RNFS.unlink(image).then(() => {
    //         const index = task.findIndex(t => task.id === taskID)
    //         if (index > -1) {
    //             let newTasks = [...task];
    //             newTasks[index].Image = '';
    //             AsyncStorage.setItem('tasks', JSON.stringify(newTasks)).then(() => {
    //                 dispatch(setTasks(newTasks));
    //                 getTask();
    //                 Alert.alert('Success', "Image Removed Successfully");
    //             }).catch(err => console.error(err));
    //         }
    //     }).catch(err => console.log(err))
    // }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.body}>

                <Modal visible={showBellModal} transparent animationType='slide' onRequestClose={() => setShowBellModal(false)} hardwareAccelerated>
                    <View style={styles.centeredView}>
                        <View style={styles.bell_modal}>
                            <View style={styles.bell_body}>
                                <Text style={styles.text}>  Remind me after </Text>
                                <TextInput style={styles.bell_input} keyboardType='numeric' value={bellTime} onChangeText={(val) => setBellTime(val)} />
                                <Text style={styles.text}> minute(s)</Text>
                            </View>
                            <View style={styles.bell_btns}>
                                <TouchableOpacity style={styles.bell_cancel_btn} onPress={() => { setShowBellModal(false) }}>
                                    <Text style={styles.text}> Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.bell_ok_btn} onPress={() => { setShowBellModal(false); notificationHandler() }}>
                                    <Text style={styles.text}> Ok</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <TextInput style={styles.input} placeholder='Title' onChangeText={(val) => setTitle(val)} value={title} />

                <TextInput multiline style={styles.input} placeholder='Description' onChangeText={(val) => setDescription(val)} value={description} />

                {/* Color tray */}
                <View style={styles.color_bar}>
                    <TouchableOpacity
                        onPress={() => setColor('white')}
                        style={styles.color_white}
                    >
                        {
                            color === "white" && <FontAwesome5 name="check" color="#000" size={25} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setColor('red')}
                        style={styles.color_red}
                    >
                        {
                            color === "red" && <FontAwesome5 name="check" color="#000" size={25} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setColor('green')}
                        style={styles.color_green}
                    >
                        {
                            color === "green" && <FontAwesome5 name="check" color="#000" size={25} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setColor('blue')}
                        style={styles.color_blue}
                    >
                        {
                            color === "blue" && <FontAwesome5 name="check" color="#000" size={25} />
                        }
                    </TouchableOpacity>
                </View>

                {/* Notifications and camera */}
                <View style={styles.extraFeatures}>
                    <TouchableOpacity style={styles.extraBtn} onPress={(() => { setShowBellModal(true) })}>
                        <FontAwesome5 name="bell" size={25} color={'#fff'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.extraBtn}
                        onPress={() => {
                            navigation.navigate('camera', { id: taskID })
                        }}
                    >
                        <FontAwesome5 name="camera" size={25} color={'#fff'} />
                    </TouchableOpacity>
                </View>

                <View style={styles.checkboxDiv}>
                    {/* library for checkbox =>  https://github.com/react-native-checkbox/react-native-checkbox */}
                    {/* install npm install @react-native-community/checkbox --save */}
                    <CheckBox
                        disabled={false}
                        value={done}
                        onValueChange={(newValue) => setDone(newValue)}
                    />

                    <Text style={styles.text}>
                        Is Done
                    </Text>
                </View>
                {
                    image ? <View>
                        <Image source={{ uri: image }} style={{ width: 300, height: 300, margin: 20 }} />

                        <TouchableOpacity style={styles.delete} onPress={() => deleteImg()}>
                            <FontAwesome5 name="trash" color={'#ff3636'} size={25} />
                        </TouchableOpacity>
                    </View> : ''
                }



                <Pressable onPress={() => setTask()} style={({ pressed }) => ([styles.button, { backgroundColor: pressed ? "#230099" : '#230057' }])}>
                    <Text style={styles.btnText}> Save Task </Text>
                </Pressable>

            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        padding: 10
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#555555',
        borderRadius: 10,
        backgroundColor: '#fff',
        textAlign: 'left',
        fontSize: 20,
        margin: 10,
        paddingHorizontal: 10
    },
    button: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    btnText: {
        color: '#fff',
        fontSize: 18
    },
    checkboxDiv: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        margin: 10
    },
    text: {
        fontSize: 20,
        color: '#000',
        marginHorizontal: 20
    },
    color_bar: {
        flexDirection: 'row',
        height: 50,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#555555',
        marginVertical: 10,
    },
    color_white: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100
    },
    color_red: {
        flex: 1,
        backgroundColor: '#f28b82',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100
    },
    color_blue: {
        flex: 1,
        backgroundColor: '#aecbfa',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100
    },
    color_green: {
        flex: 1,
        backgroundColor: '#ccff90',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100
    },
    extraFeatures: {
        flexDirection: 'row',
        marginVertical: 10
    },
    extraBtn: {
        flex: 1,
        height: 50,
        backgroundColor: '#230057',
        borderRadius: 10,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    centeredView: {
        flex: 1,
        backgroundColor: '#00000099',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bell_modal: {
        width: 300,
        height: 200,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#000'
    },
    bell_body: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bell_btns: {
        flexDirection: 'row',
        height: 50,
    },
    bell_input: {
        width: 50,
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 10,
        backgroundColor: '#fff',
        textAlign: 'center',
        fontSize: 20,
        margin: 10
    },
    bell_cancel_btn: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#000',
        borderBottomLeftRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bell_ok_btn: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#000',
        borderBottomRightRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    delete: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#fff',
        margin: 10
    }
})