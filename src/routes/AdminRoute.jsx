
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const {user, loading } = useAuth();
    const {role} = useUserRole();

    if (loading) {
        return <span className='loading loading-spinner loading-xl'
        ></span>
    }

    if(!user || role !== 'admin'){
        return <Navigate state= {{ from: location.pathname }} 
        to="/forbidden">
        </Navigate>
    }
    return children;
};

export default AdminRoute;