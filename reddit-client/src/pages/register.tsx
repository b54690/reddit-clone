import React from 'react';
import { Formik, Form } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { toErrorMap } from '../../utils/toErrorMap';
import { useRouter } from "next/router";
import { useRegisterMutation } from '../generated/graphql';
import { createUrqlClient } from "../../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";

interface registerProps {
}

const Register: React.FC<registerProps> = ({}) => {
    const router = useRouter();
    const [,register] = useRegisterMutation()
    return (
        <Wrapper variant='small'>
            <Formik 
                initialValues={{ username: "", password: ""}} 
                onSubmit={ async (values, { setErrors }) => {
                    const response = await register(values);   
                    if (response.data?.register.errors) {
                        setErrors(toErrorMap(response.data.register.errors));
                    } else if (response.data?.register.user) {
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
                            Register
                        </Button>
                    </Form> 
                )} 
            </Formik>
        </Wrapper>
    )        
}  

export default withUrqlClient(createUrqlClient)(Register);  
  