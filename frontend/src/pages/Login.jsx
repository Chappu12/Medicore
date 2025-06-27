import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";

const Login = () => {
    const { token, setToken } = useContext(AppContext);
    const [state, setState] = useState("login");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState("");
    const [address, setAddress] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [emergencyContact, setEmergencyContact] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (token) navigate("/");
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedEmail = email.trim();
        const trimmedName = name.trim();

        if (state === "signup") {
            // Validation
            if (!trimmedName || !trimmedEmail || !password || !confirmPassword || !gender || !dob || !address || !contactNumber || !emergencyContact) {
                toast.error("Please fill all required fields");
                return;
            }

            if (password.length < 8) {
                toast.error("Password must be at least 8 characters");
                return;
            }

            if (password !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }
        } else {
            if (!trimmedEmail || !password) {
                toast.error("Please enter email and password");
                return;
            }
        }

        try {
            if (state === "login") {
                const { data } = await axios.post("http://localhost:8080/api/user/login", {
                    email: trimmedEmail,
                    password
                });

                if (data.success) {
                    localStorage.setItem("token", data.token);
                    setToken(data.token);
                    toast.success("Login successful!");
                    setEmail("");
                    setPassword("");
                } else {
                    toast.error(data.message || "Login failed");
                }

            } else if (state === "signup") {
                const { data } = await axios.post("http://localhost:8080/api/user/register", {
                    name: trimmedName,
                    email: trimmedEmail,
                    password,
                    confirmPassword,
                    gender,
                    dob,
                    address,
                    contactNumber,
                    emergencyContact
                });

                if (data.success) {
                    localStorage.setItem("token", data.token);
                    setToken(data.token);
                    toast.success("Registration successful!");

                    setName("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    setGender("");
                    setDob("");
                    setAddress("");
                    setContactNumber("");
                    setEmergencyContact("");
                } else {
                    toast.error(data.message || "Registration failed");
                }
            }

        } catch (error) {
            console.error("Error during submission:", error);
            toast.error(error.response?.data?.message || error.message || "Something went wrong");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="min-h-[80vh] flex items-center">
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-900 text-sm shadow-lg">
                <p className="text-2xl font-semibold">
                    {state === "signup" ? "Create Account" : "Login"}
                </p>
                <p>Please {state === "signup" ? "Sign Up" : "Log In"} to Book Appointment</p>

                {state === "signup" && (
                    <>
                        <div className="w-full">
                            <p>Full Name:</p>
                            <input
                                className="border border-zinc-300 rounded w-full p-2 mt-1"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="w-full">
                            <p>Gender:</p>
                            <select
                                className="border border-zinc-300 rounded w-full p-2 mt-1"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="w-full">
                            <p>Date of Birth:</p>
                            <input
                                className="border border-zinc-300 rounded w-full p-2 mt-1"
                                type="date"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                            />
                        </div>

                        <div className="w-full">
                            <p>Address:</p>
                            <input
                                className="border border-zinc-300 rounded w-full p-2 mt-1"
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        <div className="w-full">
                            <p>Contact Number:</p>
                            <input
                                className="border border-zinc-300 rounded w-full p-2 mt-1"
                                type="number"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                            />
                        </div>

                        <div className="w-full">
                            <p>Emergency Contact:</p>
                            <input
                                className="border border-zinc-300 rounded w-full p-2 mt-1"
                                type="number"
                                value={emergencyContact}
                                onChange={(e) => setEmergencyContact(e.target.value)}
                            />
                        </div>
                    </>
                )}

                <div className="w-full">
                    <p>Email:</p>
                    <input
                        className="border border-zinc-300 rounded w-full p-2 mt-1"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="w-full">
                    <p>Password:</p>
                    <input
                        className="border border-zinc-300 rounded w-full p-2 mt-1"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {state === "signup" && (
                    <div className="w-full">
                        <p>Confirm Password:</p>
                        <input
                            className="border border-zinc-300 rounded w-full p-2 mt-1"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                )}

                <button type="submit" className="bg-primary text-white w-full py-2 rounded-md text-base">
                    {state === "signup" ? "Create Account" : "Login"}
                </button>

                {state === "signup" ? (
                    <p className="text-sm text-center w-full">
                        Already have an account?{" "}
                        <span className="text-primary cursor-pointer underline" onClick={() => setState("login")}>
                            Login
                        </span>
                    </p>
                ) : (
                    <p className="text-sm text-center w-full">
                        Don't have an account?{" "}
                        <span className="text-primary cursor-pointer underline" onClick={() => setState("signup")}>
                            Sign Up
                        </span>
                    </p>
                )}
            </div>
        </form>
    );
};

export default Login;
