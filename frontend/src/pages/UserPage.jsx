import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import { useParams } from 'react-router-dom'
import toastFun from '../hooks/showToast'
import { Flex, Spinner } from '@chakra-ui/react'
import Post from '../components/Post'
import useGetUserProf from '../hooks/useGetUserProf'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'


const UserPage = () => {
  const {user, loading} = useGetUserProf()
  const { userName } = useParams()
  const toast = toastFun()
  const [posts, setPosts] = useRecoilState(postsAtom)
  const [fetchingPosts, setFetchingPosts] = useState(true)

  // console.log(userId, "from error not fetch");

  useEffect(() => {

    const getPosts = async ()=> {
      setFetchingPosts(true)
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/post/user/${userName}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
        })
        const data = await res.json()
        // console.log(data);
        setPosts(data)
      } catch (error) {
        // toast("error", error.message, "error")
        // toast("error", error.message, "error")
        onsole.log(error.message);
        setPosts([])
      } finally {
        setFetchingPosts(false)
      }
    }

    getPosts()
  }, [userName, toast, setPosts, user])

  // console.log("post is here from recoil", posts);
  if(!user && loading) {
    return (
      <Flex justifyContent="center">
        <Spinner s="sl"/>
      </Flex>
    )
  }

    if (!user && !loading) return <h1>User Not Found</h1>;

  return (
    <>
      <UserHeader user={user} />
       {!fetchingPosts && posts.length === 0 && <h1>No posts yet</h1>}
       {fetchingPosts && (
        <Flex justifyContent="center" ny="12">
          <Spinner size="xl" my="15"/>
        </Flex>
       )}

       {posts.length > 0 && posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
       ))}
    </>
  )
}

export default UserPage
