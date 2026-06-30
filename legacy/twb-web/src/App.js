import { useEffect, useRef } from 'react';
import * as authService from '@services/AuthService';
import * as coupleService from '@services/CoupleService';
import { loadCategories } from '@services/CategoryService';
import { loadNotifications } from '@services/UserService';
import Router from './router/Index';
import Loading from '@components/shared/Loading';
import { useDispatch, useSelector } from "react-redux";
import { toggleLoading, pushCategoriesToState, pushNotificationsToState, authenticate } from "@store/AppSlice";
import { useNavigate, useSearchParams } from 'react-router-dom';
import AccountLinkedModal from '@components/couple/AccountLinkedModal';
import ScrollToTop from '@components/shared/ScrollTop';
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';

export default function App() {
  const app = useSelector(state => state.app);
  // const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // useEffect(() => {
  //   const connection = createConnection(serverUrl, roomId);
  //   connection.connect();
  //   return () => {
  //     connection.disconnect();
  //   };
  // }, [serverUrl, roomId]);

  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const accountLinkedModal = useRef(null);
  const showAccountLinkedModal = (partnerName) => {
    accountLinkedModal.current.showModal(partnerName);
  }
  const hideAccountLinkedModal = () => {
    accountLinkedModal.current.hideModal();
  }

  useEffect(() => {
    loadInitials();

    if (searchParams.has('verify-email')) {
      verifyUser(searchParams.get('verify-email'));
    }

    if (searchParams.has('link-account-invitation')) {
      acceptLinkingAccountInvitation(searchParams.get('link-account-invitation'));
    }
  }, []);

  async function loadInitials() {
    const isLoggedIn = authService.isLoggedIn();
    try {
      if (isLoggedIn) {
        const { data } = await authService.getProfile();
        dispatch(authenticate(data.user));
        dispatch(toggleLoading(false));

        if (app.notifications.length < 1) {
          const response = await loadNotifications();
          dispatch(pushNotificationsToState(response.data));
        }
      }

      dispatch(toggleLoading(false));
    } catch (error) {
      authService.logout();
      dispatch(toggleLoading(false));
    }

    if (app.categories.length < 1) {
      try {
        const { data } = await loadCategories();
        // data.categories.map(category => {
        //   // console.log(category.name);
        //   console.log(category.slug);
        // });
        dispatch(pushCategoriesToState(data.categories));
      } catch (error) {
        if (error?.code === 'ERR_NETWORK') {
          navigate('network-error');
        }
      }
    }
  }

  async function verifyUser(hash) {
    try {
      dispatch(toggleLoading(true));
      await authService.verifyUser({ hash });
      searchParams.delete('verify-email');
      setTimeout(() => {
        document.getElementById('verifiedBanner').style.display = 'none';
      }, 800);
      setSearchParams(searchParams);
      dispatch(toggleLoading(false));
    } catch (error) {
      console.log(error)
      dispatch(toggleLoading(false));
      toast.error('Something went wrong during email verification, please try again');
    }
  }

  async function acceptLinkingAccountInvitation(hash) {
    try {
      dispatch(toggleLoading(true));
      const response = await coupleService.acceptLinkingAccountInvitation({ hash });
      if (response.data.type === 'loggedInAndMatched') {
        navigate('/couple');
      } else if (response.data.type === 'existsAndMatched') {
        navigate(`/login?email=${response.data.email}`);
      } else if (response.data.type === 'notExists') {
        navigate(`/register?email=${response.data.email}&link-account-invitation=${hash}`);
      } else if (response.data.type === 'loggedInButNotMatched') {
        toast('Your account email does\'t match the invited email');
        navigate('/couple');
      }

      if (response.data.type === 'loggedInAndMatched'
        // || response.data.type === 'existsAndMatched'
      ) {
        showAccountLinkedModal(response.data.user.partner.fullName);
      }

      dispatch(toggleLoading(false));
    } catch (error) {
      dispatch(toggleLoading(false));
      toast.error('Something went wrong during linking account, please try again');
    }
  }

  return (
    <>
      <Router />
      <Loading />
      <Toaster containerClassName="customized-toast" position="top-right" />
      <AccountLinkedModal ref={accountLinkedModal} onHideModal={hideAccountLinkedModal} />
      <ScrollToTop />
    </>
  );
}