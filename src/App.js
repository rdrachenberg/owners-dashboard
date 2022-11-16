
import './App.css';
import Info from './components/Info';
import { useState } from 'react'
import LoginForm from './components/LoginForm'
import { Button, GridItem, Grid } from '@chakra-ui/react'

function App() {
  const [user, setUser] = useState({name: '', email: ''});
  const [error, setError] = useState('');
  const [adminLevel, setAdminLevel] = useState('')
  
  const adminUser1 = {
    email: process.env.REACT_APP_VALID_USERS.split(' ')[0],
    password: process.env.REACT_APP_VALID_PASS.split(' ')[0]
  }

  const adminUser2 = {
    email: process.env.REACT_APP_VALID_USERS.split(' ')[1],
    password: process.env.REACT_APP_VALID_PASS.split(' ')[1]
  }

  const admin = {
    email: process.env.REACT_APP_VALID_USERS.split(' ')[2],
    password: process.env.REACT_APP_VALID_PASS.split(' ')[2]
  }

  // console.log(adminUser1);
  // console.log(adminUser2);

  const adminLevelRequester = () => {
    return adminLevel
  }

  const Login = details => {
    console.log(details);
    
    if(details.email === adminUser1.email && details.password === adminUser1.password) {
      setAdminLevel('2');
      setUser({
        name: details.name,
        email: details.email
      })
    
    } else if(details.email === adminUser2.email && details.password === adminUser2.password) {
      setAdminLevel('3');
      setUser({
        name: details.name,
        email: details.email
      })
    
    } else if(details.email === admin.email && details.password === admin.password) {
      setAdminLevel('1')
      setUser({
        name: details.name,
        email: details.email
      })
    
    } else {
      setError('Sorry, your credentials are not correct')
    }
    
    console.log('logged in');
  }

  const Logout = () => {
    setUser({
      name: '', 
      email: ''
    });
    console.log('logged OUT')
  }
  return (
    <div className="App">
      <header className="App-header">
      {(user.email !== '') ? (
        <div>
        <Grid templateColumns='repeat(5,1fr)'>
        <GridItem></GridItem>
        <GridItem></GridItem>
        <GridItem></GridItem>
        <GridItem></GridItem>
          <GridItem colStart={6} colEnd={6}>
            <Button colorScheme={'red'} onClick={Logout} justifyContent={'right'}>Logout</Button>
          </GridItem>
          
        </Grid>
          <Info adminLevelRequester={adminLevelRequester}/>
          
        </div>
      ): 
      ( <LoginForm Login={Login} error={error}/>)
      }
       
      </header>
    </div>
  );
}

export default App;
