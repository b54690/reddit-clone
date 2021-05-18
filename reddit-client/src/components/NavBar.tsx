import React from 'react';
import { Box, Link, Flex, Button } from '@chakra-ui/react';
import NextLink from "next/link";
import { useLoggedInQuery, useLogoutMutation } from '../generated/graphql';

interface NavBarProps {
}

const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{ fetching: logoutFetching },logout] = useLogoutMutation()
    const [{ data, fetching: loggedInFetching }] = useLoggedInQuery()
    // deconstruct UseQueryState type
    let body = null;

    if (loggedInFetching) {
    // data is loading

    } else if (!data?.loggedIn) {
        // user if not logged in 
        body = (
            <>
            <NextLink href="/login">
                <Link color="white" mr={4}>Login</Link>
            </NextLink>
            <NextLink href="/register">
                <Link color="white">Register</Link>
            </NextLink>
            </>
        )
    } else {
        // if user logged in
        body = (
            <Flex>
                <Box color="white" mr={4}>{data.loggedIn.username}</Box>
                <Button 
                    onClick={() => {
                        logout();
                    }} 
                    variant="link"
                    isLoading={logoutFetching}
                >
                    Logout
                </Button>
            </Flex>
        )
    }

    return (
        <Flex bg="tomato">
            <Box p={4} ml={'auto'}>
                {body}
            </Box>
        </Flex>
    );
}  

export default NavBar;  
