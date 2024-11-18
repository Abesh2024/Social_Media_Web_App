import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import verified from '../assets/verified.png'
import { Box, Flex, Text, Avatar, Image } from "@chakra-ui/react"
import Actions from './Actions'
import { useEffect, useState } from 'react'
import toastFun from '../hooks/showToast'
import {formatDistanceToNow} from "date-fns"
import { DeleteIcon } from '@chakra-ui/icons'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import postsAtom from '../atoms/postsAtom'

const Post = ({post, postedBy }) => {
    // console.log(post);
    const currentUser = useRecoilValue(userAtom);
    const [user, setUser] = useState()
    const toast = toastFun()
    const navigate = useNavigate()
    const [posts, setPosts] = useRecoilState(postsAtom)

    
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/user/profile/` + postedBy, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    credentials: 'include',
                  })
                const data = await res.json();
                // console.log(data);

                if(data.error) {
                    toast("error", data.error, "error")
                    return;
                }
                setUser(data)

            } catch (error) {
                toast("error", error, "error")
                setUser(null)
            }
        }
        getUser()

    }, [postedBy, toast])


    const deletePost = async (e) => {
        try {
            e.preventDefault();
            if(!window.confirm("this post will be deleated")) return;

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/post/${post._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type":"application/json"
                },
                credentials: 'include'
            })

            const data = await res.json();

            if(data.error) {
                toast("error", data.error, "error")
                return;
            }

            toast("success", "post deleated", "success")
            
            setPosts((prev) => prev.filter((p) => p._id !== post._id))
        } catch (error) {
            toast("error", error, "error")
        }
    }

    // console.log(post)
    return (
        <Link to={`/${post.postedBy}/post/${post._id}`}>
            <Flex gap="3" mb="4" py="5">
                <Flex flexDirection="column" align="center" >
                    <Avatar size="md" name={user?.name} src={user?.profilePic} 
                        onClick={(e)=> {
                            e.preventDefault()
                            navigate(`/${user.userName}`)
                        }}
                    />
                    <Box w="1" h="full" bg="gray.light" my="2"></Box>
                    <Box position="relative" w="full">
                        {post.replies.length === 0 && <Text textAlign={"center"}> 🙃 </Text>}
                        {post.replies[0] && (
                            <Avatar
                            size="xs"
                            name="rinku"
                            src={post.replies[0].profilePic}
                            position="absolute"
                            top="0px"
                            left="15px"
                            p="2px"
                        />
                        )}
                        {post.replies[1] && (
                            <Avatar
                            size="xs"
                            name="rinku"
                            src={post.replies[1].profilePic}
                            position="absolute"
                            bottom="0px"
                            right="-5px"
                            p="2px"
                        />
                        )}
                        {post.replies[2] && (
                             <Avatar
                             size="xs"
                             name="rinku"
                             src={post.replies[2].profilePic}
                             position="absolute"
                             bottom="0px"
                             left="4px"
                             p="2px"
                         />
                        )}
                    </Box>
                </Flex>
                <Flex flex="1" flexDirection="column" gap="2">
                    <Flex justifyContent="space-between" w="full">
                        <Flex w="full" alignItems="center">
                            <Text fontSize="sm" fontWeight="bold"
                            onClick={(e)=> {
                                e.preventDefault()
                                navigate(`/${user.userName}`)
                            }}
                            >{user?.userName} </Text>
                            <Image src={verified} w="4" h="4" ml="1" />
                        </Flex>
                        <Flex gap='4' alignContent="center">
                            <Text fontSize="xs" textAlign="right" color="gray.light">
                                {formatDistanceToNow(new Date(post.createdAt))} ago
                            </Text>

                            {currentUser?._id === postedBy &&  <DeleteIcon onClick={deletePost}/>}
                        </Flex>
                    </Flex>
                    <Text fontSize="sm" >{post.text}</Text>
                    {post.img && (
                        <Box position="relative" borderRadius="6" overflow="hidden" border="1px solid gray.light">
                        <Image src={post.img} w="full" />
                    </Box> )}

                    <Flex gap="3" my="1">
                        <Actions post={post} />
                    </Flex>

                </Flex>
                
            </Flex>
            <hr style={{padding:"10px", marginLeft:"60px", marginRight:"60px"}}/>
        </Link>
    )
}

export default Post
