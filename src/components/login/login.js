import { Container } from '@material-ui/core';
import React ,{useState, useEffect} from 'react';
import {FormControl , InputAdornment, InputLabel,  IconButton, OutlinedInput} from '@material-ui/core';
import { Visibility, VisibilityOff, Person } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import './login.css';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Login(){
  const history = useHistory();
    const [values, setValues] = useState({
        username: '',
        password: '',
        showPassword: false,
        type: 'user',
        loading: false,
        errMsg: ''
      });
    
    useEffect(() => {
      sessionStorage.setItem('loggedIn', 'false');
    }, [])

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
      };
    
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };
      const handleChange = (event, role=null) => {
        if(role === null) {
          setValues({ ...values, [event.target.name]: event.target.value });
        } else {
          setValues({ ...values, type: event.target.value });
        }
      };

      const handleLogin = () => {
        setValues({loading: true})
        let data={username: values.username, password: values.password, role: values.type}
        axios.post('http://localhost:4000/login',data)
        .then((res)=>{
          setValues({loading: false, errMsg: '', username: '', password: '', type: 'user'});
          sessionStorage.setItem('loggedIn', 'true');
          sessionStorage.setItem('username',values.username)
          history.push("/todo");
        }).catch(err => {
          sessionStorage.setItem('loggedIn', 'false');
          setValues({loading: false, errMsg: 'Invalid Credentials', username: '', password: '', type: 'user'});
        })
      }

    return(
       <Container>
           <h3 style={{textAlign:"center"}}>Please Login</h3>
           <div className="Login">
          { values.errMsg && <p style={{color: 'red'}}>{values.errMsg}</p>}
           <FormControl  variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">UserName</InputLabel>
           <OutlinedInput
            id="outlined-basic"
             label="UserName"
             variant="outlined"
             name="username"
             value={values.username}
             onChange={(e) => handleChange(e)}
             endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  edge="end"
                >
                  <Person />
                </IconButton>
              </InputAdornment>
            }
            />
            </FormControl>
        <FormControl  variant="outlined" style={{marginTop:"20px"}}>
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            name="password"
            value={values.password}
            onChange={(e) => handleChange(e)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={40}
          />
        </FormControl>

        <FormControl variant="outlined" style={{marginTop:"20px"}}>
        <InputLabel id="demo-simple-select-outlined-label">Role</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={values.type}
          onChange={(e) => handleChange(e, true)}
          autoWidth={true}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      <Button variant="contained" color="primary" disableElevation style={{marginTop:"20px"}} onClick={handleLogin}>
        Login
      </Button>
      </FormControl>
       </div>
       {values.loading && <Backdrop  open={true}>
        <CircularProgress color="inherit" />
        </Backdrop>}
       </Container>
    );
}

export default Login;