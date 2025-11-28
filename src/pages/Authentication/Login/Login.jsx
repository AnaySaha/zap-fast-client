
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SocialLogin from '../SocialLogin/SocialLogin';
import useAuth from '../../../hooks/useAuth';

const Login = () => {
    const { register, handleSubmit, formState: {errors} } = useForm();

    const {signIn} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from.pathname || '/';


        const onSubmit = data =>{
            signIn(data.email, data.password)
            .then(result =>{
                console.log(result.user);
                navigate(from);
            })
            .catch(error => console.log(error))
        }

        return (
            <div className='text-center'>
                <h1 className='text-4xl'> Log In</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="fieldset">

            <label className="label">Email</label>
            <input type="email" {...register('email')} className="input" placeholder="Email" />
            
            <label className="label">Password</label>
            <input type="password" {...register('password', 
                {required: true, 
                minLength: 6})} 
                className="input" placeholder="Password" />

                {
                    errors.password?.type === 'required' && <p className='text-red-500'>Password is required</p>
                }
            {
                errors.password?.type === 'minLength' && <p className='text-red-500'>Password must be 6 characters or longer</p>
            }
            <div><a className="link link-hover">Forgot password?</a></div>
            
            
            </fieldset>
            <button className="btn btn-neutral mt-4">Login</button>
              <p><small>New to this website?  Please create an account first <Link state={{from}} className='btn btn-link' to="/register">
                Register</Link> </small></p>
                </form>
                <SocialLogin></SocialLogin>
            </div>
        );
};

export default Login;