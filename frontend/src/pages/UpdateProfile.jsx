import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Center,
  Avatar,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import UploadImage from "../hooks/UploadImage";
import toastFun from "../hooks/showToast";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function UpdateProfile() {
  // const currentUser = useRecoilValue(userAtom)
  const toast = toastFun();
  const [user, setUser] = useRecoilState(userAtom);
  const [updating, setUpdating] = useState(false)
  const navigate = useNavigate()

  console.log(user);
  const [input, setInput] = useState({
    name: "",
    userName: "",
    email: "",
    bio: "",
  });

  // const { handelImageChange, imgUrl } = UploadImage();
  const { handleImageChange, imgUrl } = UploadImage()
 

  const handelSubmit = async (e) => {
    e.preventDefault();
    if(updating) return;
    setUpdating(true)
    // const token = localStorage.getItem("auth-token");

    // if (!token) {
    //   toast("Error", "You are not authorized. Please log in.", "error");
    //   return;
    // }

    try {
      // console.log(user.user['_id']);
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/v1/user/updateuser/${user._id}`,
        {...input, profilePic: imgUrl},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const data = res.data;
      // console.log(res, "from line 60");
      // console.log(res.data.user, "from 61 ->");
      if (data.error) {
        // toast("Error", data.error, "error");
        consle.log(data.error);
        return;
      }

      toast("Success", "Profile updated successfully", "success");
      setUser(data.user);
      localStorage.setItem("user-threads", JSON.stringify(data.user));
      // navigate(`/${user._id}`)
    } catch (error) {
      console.log(error);
      // toast("Error", , "error");
    } finally {
      setUpdating(false)
    }
  };

  const fileRef = useRef(null);


  return (
    <form onSubmit={handelSubmit}>
      <Flex align={"center"} justify={"center"} my="6">
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Heading
            lineHeight={1.1}
            fontSize={{ base: "2xl", sm: "3xl" }}
          >
            User Profile Edit
          </Heading>
          <FormControl>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  src={imgUrl || user.profilePic}
                />
              </Center>
              <Center w="full">
                <Button
                  w="full"
                  onClick={() => fileRef.current.click()}
                >
                  Change Profile Picture
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef} onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="20">Full name</FormLabel>
            <Input
              placeholder="Full Name"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={input.name}
              onChange={(e) =>
                setInput({ ...input, name: e.target.value })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="20">User Name</FormLabel>
            <Input
              placeholder="UserName"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={input.userName}
              onChange={(e) =>
                setInput({ ...input, userName: e.target.value })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="20">Email ID</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
              value={input.email}
              onChange={(e) =>
                setInput({ ...input, email: e.target.value })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="20">Bio</FormLabel>
            <Input
              placeholder="Bio"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={input.bio}
              onChange={(e) =>
                setInput({ ...input, bio: e.target.value })
              }
            />
          </FormControl>

          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{ bg: "red.500" }}
            >
              Cancel
            </Button>
            <Button
              bg={"blue.400"}
              color={"white"}
              w="full"
              _hover={{ bg: "blue.500" }}
              type="submit"
              isLoading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
