import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser, setLoading, setError } from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const login = async (credentials) => {
    // TODO: Implement login logic
    dispatch(setLoading(true));
    try {
      // Call API
      dispatch(setUser(credentials));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = () => {
    dispatch(clearUser());
  };

  return { user, isAuthenticated, loading, error, login, logout };
};
