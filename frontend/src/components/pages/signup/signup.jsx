import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
// import TopBar from "../../navbar/topbarLogin";
import { AlertCircle, ArrowRight } from 'lucide-react';

function Signup() {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

        try {
            const res = await fetch('http://localhost:3000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "email": mail, "username": username, "password": hashedPassword }),
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data)
            console.log(res)
            try {
                if (res.status === 200) {
                    setErrorMessage("")
                    setSuccessMessage(data || "Account creato con successo");
                    // navigate('/');
                } else {
                    setSuccessMessage("")
                    setErrorMessage(data.error || "Si è verificato un errore, riprova più tardi");
                }
            } catch (error) {
                setSuccessMessage("")
                setErrorMessage(data);
            }
        } catch (error) {
            console.error('Request error:', error);
            setErrorMessage('Network error. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex flex-col items-center justify-center p-4">
            <div className="flex-grow flex items-center justify-center w-full">
                <div className="card w-full max-w-md bg-base-200 shadow-2xl border border-blue-900/30 transform transition-all duration-500 hover:scale-105">
                    <div className="card-body space-y-6 p-8">
                        <h1 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient leading-normal">
                            Sign Up
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="form-control">
                                <label className="input input-bordered input-info flex items-center gap-2 bg-base-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                        className="h-4 w-4 opacity-70">
                                        <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                        <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                                    </svg>
                                    <input
                                        type="email"
                                        className="grow text-white placeholder-gray-400"
                                        placeholder="Email"
                                        value={mail}
                                        onChange={(e) => setMail(e.target.value)}
                                        required
                                    />
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="input input-bordered input-info flex items-center gap-2 bg-base-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                        className="h-4 w-4 opacity-70">
                                        <path
                                            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                                    </svg>
                                    <input
                                        type="text"
                                        className="grow text-white placeholder-gray-400"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="input input-bordered input-info flex items-center gap-2 bg-base-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                        className="h-4 w-4 opacity-70"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <input
                                        type={isPasswordVisible ? "text" : "password"}
                                        className="grow text-white placeholder-gray-400"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                        className="btn btn-ghost btn-sm text-gray-400 hover:text-blue-500 transition-colors"
                                    >
                                        {isPasswordVisible ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        )}
                                    </button>
                                </label>
                            </div>

                            {successMessage && (
                                <div className="alert alert-success shadow-lg">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="stroke-current shrink-0 h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>{successMessage}</span>
                                </div>
                            )}
                            {errorMessage && (
                                <div className="alert alert-error shadow-lg">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="stroke-current shrink-0 h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <div className="form-control">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-105"
                                >
                                    Sign Up
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </button>
                            </div>
                        </form>

                        <div className="flex justify-center text-sm text-gray-400">
                            <a
                                href="/login"
                                className="hover:text-blue-500 transition-colors"
                            >
                                Already have an account? Login
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
