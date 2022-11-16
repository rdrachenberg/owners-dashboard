import React, {useState} from 'react'
import { FormControl, FormLabel, Input, Button} from '@chakra-ui/react'

function LoginForm({Login, error}) {
    const [details, setDetails] = useState({name:'', email:'', password:''});
    // eslint-disable-next-line no-unused-vars



    const submitHandler = e => {
        e.preventDefault();

        Login(details);
    }

  return (
    <FormControl onSubmit={submitHandler} >
        <div className='form-outer'>
            <div className='form-inner'>
                <h2>Login</h2>
                {(error !=='') ? (<div className='error'>{error}</div>): ''}
                <div className='form-group'>
                    <FormLabel htmlFor='name'>Name:</FormLabel>
                    <Input type='text' name='name' id='name' onChange={e => setDetails({...details, name: e.target.value})} value={details.name}></Input>
                    
                </div>
                <div className='form-group'>
                    <FormLabel htmlFor='email'>Email:</FormLabel>
                    <Input type='email' name='email' id='email' onChange={e => setDetails({...details, email: e.target.value})} value={details.email}></Input>
                    
                </div>
                <div className='form-group'>
                    <FormLabel htmlFor='name'>Password:</FormLabel>
                    <Input type='password' name='password' id='password' onChange={e => setDetails({...details, password: e.target.value})} value={details.password}></Input>
                    
                </div>
                <Button w={'100%'} marginTop={'10%'} colorScheme='blue' type='submit' value='LOGIN' onClick={submitHandler}>Login</Button>
            </div>
        </div>
    </FormControl>
  )
}

export default LoginForm