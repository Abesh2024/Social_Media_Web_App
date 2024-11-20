import {
  Flex, Box, FormControl, FormLabel, Input, InputGroup, HStack, InputRightElement, Stack, Button, Heading, Text, useColorModeValue, Link,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/AuthAtom';
import toastFun from '../hooks/showToast';
import axios from 'axios';
import userAtom from '../atoms/userAtom';

export default function Login() {
  const toast = toastFun();
  const setUser = useSetRecoilState(userAtom);
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const [input, setInput] = useState({
    userName: "",
    password: ""
  });

  const handelLogin = async () => {
    try {
      // console.log('Login attempt:', input);

      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/user/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      
      // console.log(res, "from login com");

      if (res.data.error) { // Check res.data.error instead of res.error
        toast("Error", res.response.data, "error");
				// console.log(res);

        return;
      }
      const userData = res.data;
      localStorage.setItem("user-threads", JSON.stringify(userData));
      setUser(userData);

      toast("Success", "Login successful!", "success");

    } catch (error) {
      // console.error('Login error:', error);
      toast("Error", error.response.data.message || "Failed to connect to the server.", "error");
				// console.log(data.error);

    }
  };

  return (
    <Flex
      align={'center'}
      justify={'center'}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Log in
          </Heading>
        </Stack>
        <Box
          w={[300, 400, 460]}
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <HStack></HStack>
            <FormControl id="email" isRequired>
              <FormLabel>User Name</FormLabel>
              <Input
                type="text"
                onChange={(e) => setInput({ ...input, userName: e.target.value })}
                value={input.userName}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) => setInput({ ...input, password: e.target.value })}
                  value={input.password}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
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
                onClick={handelLogin}
              >
                Log in
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Don't have an account? <Link color={'blue.400'} onClick={() => setAuthScreen("signup")}>Sign up</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}