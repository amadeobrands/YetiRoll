import React, { useState } from 'react'
import {Classes, FormGroup, InputGroup, Button} from '@blueprintjs/core'
import { Wrapper } from './styled';
import repository from '@app/repository';
import { useHistory } from 'react-router-dom'

const Login: React.FC = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const history = useHistory();

    const performLogin = async () => {
        setIsLoading(true)
        try {
            const session = await repository.session().create({ email, password })
            localStorage.setItem('auth', JSON.stringify(session))
            history.replace('/dashboard')
        } catch (e) {
            alert('Invalid email/password')
            setPassword('')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Wrapper>
            <div>
                <h1 className={Classes.HEADING}>Login</h1>
                <div>
                    <FormGroup label="Email" labelFor="email">
                        <InputGroup
                            id="email"
                            placeholder="user@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </FormGroup>
                    <FormGroup label="Password" labelFor="password">
                        <InputGroup
                            id="password"
                            placeholder="password"
                            type={'password'}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </FormGroup>
                    <Button
                        disabled={(!email || !password)}
                        loading={isLoading}
                        onClick={performLogin}
                    >
                        Login
                    </Button>

                </div>
            </div>
        </Wrapper>
    );
}

export default Login;
