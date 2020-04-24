import React, { useState, useEffect } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import moment from 'moment'
import { todosRef } from './firebase'
import { Box, Typography, makeStyles, TextField, IconButton, Checkbox } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import * as firebase from 'firebase';

const useStyles = makeStyles({
  root: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f6f6f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: 400,
    paddingBottom: 10,
    color: '#2d2d2d',
    fontFamily: 'Quicksand'
  },
  wrapper: {
    backgroundColor: 'white',
    width: '40%',
    paddingTop: 50,
    paddingBottom: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    borderRadius: 10,
    boxShadow: '2px 2px 5px 0px rgba(0,0,0,0.1)'
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%'
  },
  textfield: {
    width: '90%'
  },
  buttonWrapper: {
    width: '10%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#e91e63',
    borderRadius: 5,
  },
  icon: {
    color: 'white',
  },
  todoWrapper: {
    width: '80%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: 20,
    marginBottom: 20
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
    backgroundColor: 'white',
    padding: 12,
    border: '1px solid #e2e2e2',
    marginBottom: 10,
    borderRadius: 5,
  },
  actionWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkbox: {
  },
  deleteWrapper: {
    width: '45%',
  },
  delete: {
    width: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    color: '#37474f'
  },
  deleteIcon: {
    color: '#37474f'
  },
});


const App = () => {
  const [date, setDate] = useState(new Date())
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const classes = useStyles()
  const [start, setStart] = useState(moment().valueOf())
  const [end, setEnd] = useState(moment().valueOf())

  useEffect(() => {
    setStart(moment(date).startOf('day').valueOf())
    setEnd(moment(date).endOf('day').valueOf())
  }, [date])

  useEffect(() => {
    retrieveTodos()
  }, [])

  const retrieveTodos = () => {
    todosRef.on("value", snapshot => {
      if (snapshot.val() != null) {
        let todos = Object.values(snapshot.val())
        for (let i = 0; i < todos.length; i++) {
          todos[i].id = Object.keys(snapshot.val())[i]
        }
        console.log(todos)
        setTodos(todos)
      }
    });
  }

  const createTodo = () => {
    todosRef.push().set({
      title: input,
      date: moment(date).valueOf(),
      isComplete: false
    }).then(() => {
      setInput('')
    });
  }

  const handleComplete = (id, idx) => {
    console.log(todos)
    todosRef.child(id).update({
      isComplete: !(todos[idx].isComplete),
      title: todos[idx].title,
      date: todos[idx].date
    }).then(() => {
      console.log('success')
    })
  }

  const removeItem = (id) => {
    let removeRef = firebase.database().ref('todos/' + id)
    removeRef.remove()
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.wrapper}>
        <Typography className={classes.title}>DARRYL'S TODOS</Typography>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Select Date"
            format="MM/dd/yyyy"
            value={date}
            onChange={(date) => setDate(date)}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
        <Box className={classes.todoWrapper}>
          {
            todos.map((item, idx) => {
              if (item.date < end && item.date > start) {
                let status = item.isComplete
                return (
                  <Box key={item.id} className={classes.item} style={{ backgroundColor: status ? '#f6f6f6' : '#fff' }}>
                    <Typography style={{ color: status ? 'gray' : 'black', textDecorationLine: status ? 'line-through' : 'none' }}>
                      {item.title}
                    </Typography>
                    <Box className={classes.actionWrapper}>
                      <Box className={classes.deleteWrapper}>
                        <Checkbox
                          className={classes.checkbox}
                          checked={item.isComplete}
                          onChange={() => handleComplete(item.id, idx)}
                        />
                      </Box>
                      <Box classeName={classes.deleteWrapper}>
                        <IconButton onClick={() => removeItem(item.id)} className={classes.delete}>
                          <DeleteOutlineOutlinedIcon className={classes.deleteIcon} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                )
              }
            })
          }
        </Box>
        <Box className={classes.inputWrapper}>
          <TextField value={input} onChange={(e) => setInput(e.target.value)} className={classes.textfield} label="Todo Title" />
          <Box className={classes.buttonWrapper}>
            <IconButton onClick={createTodo} className={classes.button}>
              <AddIcon className={classes.icon} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
