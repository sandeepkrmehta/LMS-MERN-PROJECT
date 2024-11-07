import { useState } from "react";
import { toast } from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import { createAccount } from "../Redux/Slices/AuthSlice";
import InputBox from "../Components/InputBox/InputBox";

// Helper function to start session timer
function startSessionTimer() {
  localStorage.setItem("expiresAt", Date.now() + 3600000); // 1 hour
}

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    avatar: "",
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  }

  function getImage(event) {
    event.preventDefault();
    const uploadedImage = event.target.files[0];

    if (uploadedImage) {
      setSignupData({
        ...signupData,
        avatar: uploadedImage,
      });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setPreviewImage(this.result);
      });
    }
  }

  async function createNewAccount(event) {
    event.preventDefault();
    if (!signupData.email || !signupData.password || !signupData.fullName) {
      toast.error("Please fill all the details");
      return;
    }

    if (signupData.fullName.length < 3) {
      toast.error("Name should be at least 3 characters");
      return;
    }

    if (!signupData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      toast.error("Invalid email id");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", signupData.fullName);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);
    formData.append("avatar", signupData.avatar);

    // Dispatch create account action
    const response = await dispatch(createAccount(formData));
    if (response?.payload?.success) {
      startSessionTimer(); // Start session timer after successful signup
      setSignupData({
        fullName: "",
        email: "",
        password: "",
        avatar: "",
      });
      setPreviewImage("");
      navigate("/"); // Redirect to homepage
    }
  }

  return (
    <Layout>
      <section className="flex flex-col gap-6 items-center py-8 px-3 min-h-[100vh]">
        <form
          onSubmit={createNewAccount}
          autoComplete="off"
          noValidate
          className="flex flex-col dark:bg-base-100 gap-4 rounded-lg md:py-5 py-7 md:px-7 px-3 md:w-[500px] w-full shadow-custom dark:shadow-xl"
        >
          <h1 className="text-center dark:text-purple-500 text-4xl font-bold font-inter">
            Registration Page
          </h1>
          {/* name */}
          <InputBox
            label={"Name"}
            name={"fullName"}
            type={"text"}
            placeholder={"Enter your name..."}
            onChange={handleUserInput}
            value={signupData.fullName}
          />
          {/* email */}
          <InputBox
            label={"Email"}
            name={"email"}
            type={"email"}
            placeholder={"Enter your email..."}
            onChange={handleUserInput}
            value={signupData.email}
          />
          {/* password */}
          <InputBox
            label={"Password"}
            name={"password"}
            type={"password"}
            placeholder={"Enter your password..."}
            onChange={handleUserInput}
            value={signupData.password}
          />
          {/* avatar */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="image_uploads"
              className="font-[500] text-xl text-blue-600 dark:text-white font-lato"
            >
              Avatar{" "}
              <span className="text-red-600 font-inter text-lg">
                {"("}Optional{")"}
              </span>
            </label>
            <div className="flex gap-7 border border-gray-300 px-2 py-2">
              {previewImage ? (
                <img className="w-14 h-14 object-cover" src={previewImage} alt="User avatar" />
              ) : (
                <BsPersonCircle className="w-14 h-14 text-gray-600" />
              )}
              <input
                id="image_uploads"
                type="file"
                name="avatar"
                accept="image/png, image/jpg, image/jpeg"
                onChange={getImage}
              />
            </div>
          </div>
          {/* create account */}
          <button
            type="submit"
            className="dark:bg-purple-500 text-white dark:hover:bg-purple-700 md:py-3 py-2 rounded-lg text-lg font-[600]"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
          <p className="font-lato font-[500] text-base text-center dark:text-white">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="text-blue-600 font-[600] hover:underline underline-offset-1"
            >
              Login now
            </Link>
          </p>
        </form>
      </section>
    </Layout>
  );
}
