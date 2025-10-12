import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
const Register = () => {
  const { register, handleSubmit, formState: {errors} } = useForm();
  
    const { createUser } = useAuth();

          const onSubmit = data =>{
              console.log(data);
              createUser(data.email, data.password, data.name)
              .then( result =>{
                console.log(result.user)
              })
              .catch(error=>{
                console.error(error);
              })
          }
  
          return (
              <div>
                 <h1 className='text-4xl'>Create An Account</h1>
                  <form onSubmit={handleSubmit(onSubmit)}>
                      <fieldset className="fieldset">

            <label className="label">Name</label>
              <input type="name" {...register('name')} className="input" placeholder="Name" />
              
  
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
              
              </fieldset>
              <button className="btn btn-neutral mt-4">Register</button>
                <p><small>Already have an account? Please <Link className='btn btn-link' to="/login">
                Login</Link> </small></p>
                  </form>
              </div>
          );
};

export default Register;