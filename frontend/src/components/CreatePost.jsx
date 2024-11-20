import React, { useRef, useState } from 'react';
import {
    Button,
    useColorModeValue,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    Textarea,
    Text,
    Input,
    Flex,
    Image,
    CloseButton,
} from '@chakra-ui/react';
import UploadImage from "../hooks/UploadImage";
import { BsFillImageFill } from 'react-icons/bs';
// import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import toastFun from '../hooks/showToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import { useParams } from 'react-router-dom';

const CreatePost = () => {
    const user = useRecoilValue(userAtom)
    
    const MAX_CHAR = 500;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postText, setPostText] = useState("")
    const { handleImageChange, imgUrl, setImgUrl } = UploadImage()
    const imageRef = useRef(null)
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR)
    const toast = toastFun();
    const[loading, setLoading] = useState("")
    const [posts, setPosts] = useRecoilState(postsAtom)
    const {userName} = useParams();


    const handelTextChange = (e) => {
        const inputText = e.target.value;
        if(inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR)
            setPostText(truncatedText)
            setRemainingChar(0)
        } else {
            setPostText(inputText)
            setRemainingChar(MAX_CHAR - inputText.length)
        }
    }

    const handleCreatePost = async () => {
        try {
            setLoading("Loading...")
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/post/create-post`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify({postedBy: user._id, text: postText, img: imgUrl}),
                credentials: 'include',
            })
    
            const data = await res.json();
            if(data.error) {
                toast("error", data.error, "error")
				// console.log(data.error);

                return;
            }
            toast("success", "Post created Successfully", "success")
            setPosts([data, ...posts])
            if(userName === user.userName) {
                onClose()
            }

            setPostText("")
            setImgUrl("")

        } catch (error) {
            // toast("error", error, "error")
				console.log(data.error);

        } finally {
            setLoading("")
        }
    }

    return (
        <>
            <Button
                position="fixed"
                right="10"
                bottom="10"
                bg={useColorModeValue("gray.300", "gray.dark")}
                onClick={onOpen}
            >
                Create Post
            </Button>

            <Modal
                isCentered
                onClose={onClose}
                isOpen={isOpen}
                motionPreset='slideInBottom'
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Posts</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody p="6">
                        {/* Replace Lorem component with actual content */}
                        <FormControl>
                            <Textarea
                                placeholder='make your content here..'
                                onChange={handelTextChange}
                                value={postText}
                            />
                            <Text fontSize="xs" fontWeight="bold" textAlign="right" m="1" color="white" >
                                {remainingChar}/500
                            </Text>
                            <Input
                                type='file'
                                hidden
                                ref={imageRef}
                                onChange={handleImageChange}
                            />
                            <BsFillImageFill style={{ marginLeft: "5px", cursor: "pointer" }} size="16"
                                onClick={() => imageRef.current.click()} />
                        </FormControl>

                        {imgUrl && (
                            <Flex mt="5" w="full" position="relative">
                                <Image src={imgUrl}/>
                                <CloseButton onClick={()=> {setImgUrl("")}} bg="gray.800" top="2" right="2" position="absolute"/>
                            </Flex>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default CreatePost;
