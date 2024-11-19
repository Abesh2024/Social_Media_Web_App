import { Button, Flex, Spinner, Box } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toastFun from '../hooks/showToast'
import Post from '../components/Post'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'
import SuggestedUsers from '../components/SuggestedUsers'

const HomePage = () => {
  const toast = toastFun()
  const [posts, setPosts] = useRecoilState(postsAtom)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getFeedPost = async () => {
      setLoading(true)
      setPosts([])
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/post/feed`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
        })
        const data = await res.json()
        // console.log(data);
        if (data.error) {
          toast("error", data.error, "error")
          return;
        }
        setPosts(data)
      } catch (error) {
        toast("error", error.message, "error")
      } finally {
        setLoading(false)
      }
    }
    getFeedPost()
  }, [toast, setPosts])

  return (
    <Flex gap="10" alignItems="flex-start">
    <Box flex={70}>
    {!loading && posts.length === 0 && <h1>Follow some users to sees feed Posts</h1>}
      {loading &&
        <Flex justify="center">
          <Spinner size="xl" />
        </Flex>}

      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </Box>
    <Box flex={30}>
     <SuggestedUsers/>
    </Box>
    </Flex>
  )
}

export default HomePage