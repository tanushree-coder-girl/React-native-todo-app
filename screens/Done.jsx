import { View, Text, StyleSheet, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { useSelector, useDispatch } from 'react-redux'
import { setTasks, setTaskId } from './../redux/reducer';

import AsyncStorage from '@react-native-async-storage/async-storage';

import globalStyles from './../assets//globalstyle/globalStyles';
import CheckBox from '@react-native-community/checkbox';

export default function Done({ navigation }) {
    const { task, taskID } = useSelector((state) => state.taskReducer);
    const dispatch = useDispatch()

    const deleteToDo = (id) => {
        const filteredDta = task.filter(task => task.id !== id)
        AsyncStorage.setItem('tasks', JSON.stringify(filteredDta)).then(() => {
            dispatch(setTasks(filteredDta));
            Alert.alert('Success!', "Task Removed successfully")
        }).catch(err => console.log(err))
    }

    const checkTask = (id, newVal) => {
        const index = task.findIndex(task => task.id === id);

        if (index > -1) {
            let newTask = [...task];
            newTask[index].done = newVal;
            AsyncStorage.setItem('tasks', JSON.stringify(newTask)).then(() => {
                dispatch(setTasks(newTask));
                Alert.alert('Success', "Task state is changed")
            }).catch(err => console.error(err))
        }
    }

    return (
        <View style={styles.main}>
            <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={task.filter(task => task.done === true)}
                renderItem={({ item }) => (
                    <View style={styles.item} activeOpacity={0.8}>
                        <View style={styles.item_row}>
                            <CheckBox
                                style={{ zIndex: 100 }}
                                value={item.done}
                                onValueChange={(newValue) => checkTask(item.id, newValue)}
                            />
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity onPress={() => {
                                    dispatch(setTaskId(item.id));
                                    navigation.navigate('create-task');
                                }} activeOpacity={0.8}>
                                    <Text numberOfLines={1} style={[globalStyles.customFont, styles.title]}> {item?.title} </Text>
                                    <Text numberOfLines={1} style={[globalStyles.customFont, styles.subtitle]}> {item?.description} </Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.dltbtn} onPress={() => deleteToDo(item.id)}>
                                <FontAwesome5 name={'trash'} size={25} color={'#ff3636'} />
                            </TouchableOpacity>
                        </View>


                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#230057',
        color: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        right: 10,
        elevation: 5
    },
    item_row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    dltbtn: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    item: {
        marginHorizontal: 10,
        marginVertical: 7,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 5
    },
    title: {
        color: '#000',
        fontSize: 40,
        margin: 5,
    },
    subtitle: {
        fontSize: 20,
        margin: 5,
        color: '#999',
    }
})