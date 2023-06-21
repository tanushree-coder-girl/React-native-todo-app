import { createSlice } from '@reduxjs/toolkit'

export const taskReducer = createSlice({
    name: 'task',
    initialState: {
        task: [],
        taskID: 1
    },
    reducers: {
        setTasks: (state, action) => {
            state.task = action.payload
        },
        setTaskId: (state, action) => {
            state.taskID = action.payload
        }
    },
})

export const { setTasks, setTaskId } = taskReducer.actions

export default taskReducer.reducer