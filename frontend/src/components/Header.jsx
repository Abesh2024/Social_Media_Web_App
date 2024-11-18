import { Flex, Image, Link, useColorMode, Button } from "@chakra-ui/react";
import lightLogo from '../assets/light-logo.svg';
import darkLogo from '../assets/dark-logo.svg';
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai"; // Correct import
import { RxAvatar } from "react-icons/rx"; // Correct import
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";


const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();


  return (
    <Flex justifyContent={"space-between"} mt={10} alignItems="center">
      {user && (
        <Link as={RouterLink} to="/">
          <AiFillHome size="24" style={{ marginRight: "10px" }} /> 
        </Link>
      )}
      
      <Image
        cursor={"pointer"}
        w={6}
        mb={4} // Adding margin-bottom
        src={colorMode === "dark" ? lightLogo : darkLogo}
        onClick={toggleColorMode}
        />
        

      {user && (
        <Flex alignItems={"center"} gap={4}>
        <Link as={RouterLink} to={`/${user.userName}`}>
          <RxAvatar size="24" style={{ marginRight: "10px" }} /> 
        </Link>
        <Button
            size={"xs"} onClick={logout}
        >
            <FiLogOut  size="35"/>
        </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
