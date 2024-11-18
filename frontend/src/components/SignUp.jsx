import React, { useState } from 'react';
import axios from 'axios';
import {
    Flex, Box, FormControl, FormLabel, Input, InputGroup, HStack, InputRightElement, Stack, Button, Heading, Text, useColorModeValue, Link
} from '@chakra-ui/react';
import authScreenAtom from '../atoms/AuthAtom';
import { useSetRecoilState } from 'recoil';
import toastFun from '../hooks/showToast';
import userAtom from '../atoms/userAtom';


export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const setAuthScreen = useSetRecoilState(authScreenAtom);
    const setUser = useSetRecoilState(userAtom)
    // const toast = toastFun()
    const [input, setInput] = useState({
        name: "",
        userName: "",
        email: "",
        password: ""
    });
    const toast = toastFun();
    console.log(input);

    const handleSignup = async () => {
		try {
			const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/user/signup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(input),
                credentials: 'include',
			});
			const data = await res.json();

			if (data.error) {
				toast("Error", data.error, "error");
				return;
			}

			localStorage.setItem("user-threads", JSON.stringify(data));
			setUser(data);
            toast("success", "user signed up successfully", "success",)

		} catch (error) {
			toast("Error", error, "error");
		}
	};

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
        >
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Sign up
                    </Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.dark')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <HStack>
                            <Box>
                                <FormControl id="name" isRequired>
                                    <FormLabel>Full Name</FormLabel>
                                    <Input type="text"
                                        onChange={(e) => setInput({ ...input, name: e.target.value })}
                                        value={input.name}
                                    />
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl id="userName" isRequired>
                                    <FormLabel>User Name</FormLabel>
                                    <Input type="text"
                                        onChange={(e) => setInput({ ...input, userName: e.target.value })}
                                        value={input.userName}
                                    />
                                </FormControl>
                            </Box>
                        </HStack>
                        <FormControl id="email" isRequired>
                            <FormLabel>Email address</FormLabel>
                            <Input type="email"
                                onChange={(e) => setInput({ ...input, email: e.target.value })}
                                value={input.email}
                            />
                        </FormControl>
                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input type={showPassword ? 'text' : 'password'}
                                    onChange={(e) => setInput({ ...input, password: e.target.value })}
                                    value={input.password}
                                />
                                <InputRightElement h={'full'}>
                                    <Button
                                        variant={'ghost'}
                                        onClick={() => setShowPassword((showPassword) => !showPassword)}>
                                        {showPassword ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={10} pt={2}>
                            <Button
                                loadingText="Submitting"
                                size="lg"
                                bg={useColorModeValue("gray.600", "gray.700")}
                                color={'white'}
                                _hover={{
                                    bg: useColorModeValue("gray.700", "gray.800")
                                }}
                                onClick={handleSignup}
                            >
                                Sign up
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={'center'}>
                                Already a user? <Link color={'blue.400'}
                                    onClick={() => setAuthScreen("login")}>Login</Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}
