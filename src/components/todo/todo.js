import React, { useState,useEffect } from 'react';
import './todo.css';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import {Button, Container} from '@material-ui/core';
import axios from 'axios';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Grid from '@material-ui/core/Grid';
// import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
// import SortIcon from '@material-ui/icons/Sort';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import { Redirect } from 'react-router-dom';

function Todo(){
  const [value, setValue] = useState('');
  const [data, setData] = useState([]);
  const [list,setList] = useState([]);
  const [ordList, setOrdList] = useState([]);
  const [redirect, setRedirect] = useState(false);
  let user = sessionStorage.getItem('username') 
  const refreshData = () => {
    axios.get(`http://localhost:4000/getdata/${user}`)
     .then((res)=>{
       setList(res.data);
       console.log(res)
     })
  }

  useEffect(() => {
    if(sessionStorage.getItem('loggedIn') === 'true') {
      setRedirect(false);
      refreshData();
    } else {
      setRedirect(true);
    }
  }, []);

  useEffect(() => {
    refreshData()
  }, [data])

  const clickedHandler = ()=>{
    if(value){
      axios.post("http://localhost:4000/adddata",{todo: value, username: user})
      .then((res)=>{
           setData(res);
            console.log(res)
      }).catch((err)=>{
            console.log(err)
      })
    }
  
     console.log('working')
     setValue('');
  }

  const handleChange = (event) => {
    setValue(event.target.value);
    console.log('1111', value)
  };

  const deleteHandler = (i)=>{
    axios.post("http://localhost:4000/delete",{_id:i, username: user})
    .then((res)=>{
      setData(res);
    }).catch(err =>{
      console.log('deleting',err)
    })
      
  }

  const priorityHandler = () =>{
    let ord=list.sort((a, b) => a.todo.localeCompare(b.todo));
    setOrdList(ord)
  }

  const showList = list.map((a,i) =>{
    return(
       <div>
         <Grid container>
          <Grid item xs ={4}><h4>{i+1}</h4></Grid>
          <Grid item xs ={4}><h4>{a.todo}</h4></Grid>
          { user !== "admin" &&
          <Grid item xs={4} style={{margin:"auto"}}>
             <DeleteForeverIcon color="secondary" onClick={()=>deleteHandler(a._id)}/>
          </Grid>
          }
         </Grid>
       </div>  
  );
  })

  return(
    <Container style={{textAlign:"center"}}>
      { !redirect ?
      <>
      <Typography variant="h3" gutterBottom>TODO</Typography>
      <div style={{padding: "10px"}}>
        <span className="user"><strong>User: </strong>{user}</span>
        <span className="user"><Button variant="outlined" onClick={() => setRedirect(true)}>Logout</Button></span>
      </div>
       <div className="Todo">
       {  user !== "admin" &&
       <>
       <TextField
          id="standard-textarea"
          placeholder="What to do "
          value={value}
          onChange={handleChange}
          multiline
        />
         <Button style={{marginLeft: "10px"}} variant="contained" color="primary" onClick={clickedHandler}>
        Submit
      </Button>
      </>
      }
      <div style={{justifyContent: 'flex-end', paddingTop: "10px"}} className="header-style"><strong>Sort:</strong><SortByAlphaIcon onClick={priorityHandler}></SortByAlphaIcon></div>
      <Grid container className={user !== 'admin' ? "header-style" : ""}>
        <Grid item xs ={4}>
        <h2>Sno</h2>
        </Grid>
        <Grid item xs ={4}><h2>Todos</h2></Grid>
        { user !== "admin" &&
        <Grid item xs={4} style={{margin:"auto"}}><h2>Delete</h2></Grid>
      }
      </Grid>
      {showList}
      </div>
      </>
    : <Redirect to='/'/>}
   </Container>
  );
}

export default Todo;