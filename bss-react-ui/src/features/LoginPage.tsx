import { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from '../Context/useAuth';
import { useForm } from 'react-hook-form';
import headerLogo from '../assets/images/header-logo.png'
import CircularProgress from "@mui/material/CircularProgress";

type LoginFormInputs = {
    username: string;
    password: string;
};

const validation = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
});

const LoginPage = () => {
    const { loginUser } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({ resolver: yupResolver(validation) });
    const [isLoading, setIsLoading] = useState(false); // State to track loading status

    const handleLogin = async (form: LoginFormInputs) => {
        setIsLoading(true); // Start loading spinner
        try {
            await loginUser(form.username, form.password);
        } finally {
            setIsLoading(false); // Stop loading spinner after login process is done
        }
    };

    return (
        <section className='w-full h-fit flex justify-center items-center max-sm:mt-10 mt-32'>
            <div className='h-[450px] w-[400px] bg-white-400 border border-primary'>
                <h1 className='font-montserrat text-center text-xl font-bold text-white bg-secondary h-14 pt-4 rounded-b-xl'>
                    Login
                </h1>
                <img src={headerLogo} alt="Logo" width={150} height={150} className="mx-auto mt-3" />

                <div className='p-4'>
                    <form onSubmit={handleSubmit(handleLogin)}>
                        <div className='w-full h-10 flex space-x-1 border border-slate-gray rounded-full my-3'>
                            <label htmlFor="username" className='w-28 border border-slate-gray text-right bg-secondary rounded-l-full pt-1 pr-1 font-bold text-white-400'>
                                Username
                            </label>
                            <input
                                type="text"
                                className='w-full bg-transparent outline-none pl-2 rounded-full'
                                {...register("username")}
                            />
                        </div>
                        {errors.username ? (<p className='text-sm text-red-600'>{errors.username.message}</p>) : ""}

                        <div className='w-full h-10 flex space-x-1 border border-slate-gray rounded-full my-3'>
                            <label htmlFor="password" className='w-28 border border-slate-gray text-right bg-secondary rounded-l-full pt-1 pr-1 font-bold text-white-400'>
                                Password
                            </label>
                            <input
                                type="password"
                                className='w-full rounded-full bg-transparent outline-none pl-2'
                                {...register("password")}
                            />
                        </div>
                        {errors.password ? (<p className='text-sm text-red-600'>{errors.password.message}</p>) : ""}

                        <button
                            className='bg-secondary text-white-400 w-full rounded-full text-lg p-2 mt-4 font-bold flex justify-center items-center'
                            disabled={isLoading} // Disable button while loading
                        >
                            {isLoading ? (
                                <CircularProgress size={28} /> // Show spinner icon when loading
                            ) : (
                                'Login' // Default text when not loading
                            )}
                        </button>
                    </form>

                    <p className='text-center text-gray-700 mt-3'>Forgot Password? Contact Administrator</p>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
