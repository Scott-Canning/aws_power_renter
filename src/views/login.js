import React from 'react'
import Amplify, { Hub } from 'aws-amplify';
import awsExports from '../aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsExports);

const Login = (props) => {

  Hub.listen('auth', (data) => {
    switch (data.payload.event) {
      case 'signIn':
        props.history.push('/')
      case 'signOut':
        props.history.push('/')
      case 'signIn_failure':
      case 'cognitoHostedUI_failure':
        console.log('Sign in failure', data);
        break;
      default:
        break;
    }
  });

  return (
    <div style={styles.container_sc}> 
        <Authenticator>
          {({ signOut, user }) => (
            <div>
              <h1>Logged in as {user.username}</h1>
              <button className="button-primary button" onClick={() => signOut()}>Sign Out</button>
            </div>
          )}
        </Authenticator>
    </div>
  )
}

const styles = {
  container: { width: 400, margin: 'auto', display: 'flex', flexDirection: 'center', justifyContent: 'center', padding: 20 },
  container_sc: {width: 400, margin: '0 auto', display: 'flex', alignItems: 'column', justifyContent: 'center', padding: 200 },
  todo: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default Login
