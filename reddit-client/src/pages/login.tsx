import React from 'react';
import { Formik, Form } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { toErrorMap } from '../../utils/toErrorMap';
import { useRouter } from "next/router";
import { useLoginMutation } from '../generated/graphql';
import { createUrqlClient } from "../../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";

const Login: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [,login] = useLoginMutation()
    return (
        <Wrapper variant='small'>
            <Formik 
                initialValues={{ username: "", password: ""}} 
                onSubmit={ async (values, { setErrors }) => {
                    const response = await login(values);   
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors));
                    } else if (response.data?.login.user) {
                        router.push('/');
                    }  
                }} 
            >                  
                {( props ) => (
                    <Form>
                        <InputField
                            name="username" 
                            label="Username"
                            placeholder="username"
                        >
                        </InputField>
                        <Box mt={4}>
                            <InputField
                                name="password"
                                label="Password" 
                                placeholder="password"
                                type="password"
                            >
                            </InputField>
                        </Box>
                        <Button 
                            mt={4} 
                            type="submit" 
                            colorScheme="teal"
                            isLoading={props.isSubmitting}
                        >
                            Login
                        </Button>
                    </Form> 
                )} 
            </Formik>
        </Wrapper>
    )        
}  

export default withUrqlClient(createUrqlClient)(Login);  
  