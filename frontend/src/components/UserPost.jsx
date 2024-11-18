// import React from 'react'
// import { Link } from 'react-router-dom'
import { Link } from 'react-router-dom'
import zuckAvater from '../assets/zuck-avatar.png'
// import post1 from '../assets/post1.png'
import verified from '../assets/verified.png'
import { Box, Flex, VStack, Text, Avatar, Menu, MenuButton, Portal, MenuList, MenuItem, Image } from "@chakra-ui/react"
import { BsThreeDots } from 'react-icons/bs'
import Actions from './Actions'
import { useState } from 'react'


const UserPost = ({likes, replies, postImg, postTitle}) => {
        const [liked, setLiked] = useState(false);

    return (
        <Link to={"/mark/post/1"}>
            <Flex gap="3" mb="4" py="5">
                <Flex flexDirection="column" align="center" >
                    <Avatar size="md" src={zuckAvater} />
                    <Box w="1" h="full" bg="gray.light" my="2"></Box>
                    <Box position="relative" w="full">
                        <Avatar
                            size="xs"
                            name="rinku"
                            src="https://bit.ly/sage-adebayo"
                            position="absolute"
                            top="0px"
                            left="15px"
                            p="2px"
                        />
                        <Avatar
                            size="xs"
                            name="rinku"
                            src='https://bit.ly/prosper-baba'
                            position="absolute"
                            bottom="0px"
                            right="-5px"
                            p="2px"
                        />
                        <Avatar
                            size="xs"
                            name="rinku"
                            src='https://bit.ly/code-beast'
                            position="absolute"
                            bottom="0px"
                            left="4px"
                            p="2px"
                        />
                    </Box>
                </Flex>
                <Flex flex="1" flexDirection="column" gap="2">
                    <Flex justifyContent="space-between" w="full">
                        <Flex w="full" alignItems="center">
                            <Text fontSize="sm" fontWeight="bold">markzuckerberg </Text>
                            <Image src={verified} w="4" h="4" ml="1" />
                        </Flex>
                        <Flex gap='4' alignContent="center">
                            <Text fontStyle="sm" color="gray.light" >1d</Text>
                            <BsThreeDots />
                        </Flex>
                    </Flex>
                    <Text fontSize="sm" >{postTitle}</Text>
                    {postImg && (
                        <Box position="relative" borderRadius="6" overflow="hidden" border="1px solid gray.light">
                        <Image src={postImg} w="full" />
                    </Box> )}

                    <Flex gap="3" my="1">
                        <Actions liked={liked} setLiked={setLiked} />
                    </Flex>

                    <Flex gap="2" align="center">
                        <Text color={"gray.light"} fontSize="sm">{replies}</Text>
                        <Box borderRadius="full" bg={"gray.light"} h="0.5" w="0.5"></Box>
                        <Text color={"gray.light"} fontSize="sm">{likes}</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    )
}

export default UserPost
