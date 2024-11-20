// import { useEffect, useState } from 'react';
// import toastFun from './showToast';
// import { useParams } from 'react-router-dom';

// const useGetUserProf = () => {
//   const { userName } = useParams();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const toast = toastFun();


//   useEffect(() => {
//     const getUser = async () => {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/user/profile/${userName}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: 'include',
//         });
//         const data = await res.json();

//         if (data.error) {
//           toast("error", data.error, "error");
//           return;
//         }
//         setUser(data);
//       } catch (error) {
//         toast("error", error.message, "error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userName) {
//       getUser();
//     }
//   }, [userName, toast]);

//   return { loading, user };
// };

// export default useGetUserProf;






import { useEffect, useState } from 'react';
import toastFun from './showToast';
import { useParams } from 'react-router-dom';

const useGetUserProf = () => {
  const { userName } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = toastFun();

  useEffect(() => {
    let isMounted = true; // To handle component unmounting safely

    const getUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/user/profile/${userName}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await res.json();

        if (data.error) {
          toast('error', data.error, 'error');
          return;
        }

        if (isMounted) {
          setUser(data);
        }
      } catch (error) {
        toast('error', error.message, 'error');
        console.error('Error fetching user profile:', error.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (userName) {
      getUser();
    } else {
      setLoading(false); // Stop loading if no userName is provided
    }

    return () => {
      isMounted = false; // Cleanup flag to prevent state updates after unmount
    };
  }, [userName, toast]);

  return { loading, user };
};

export default useGetUserProf;

