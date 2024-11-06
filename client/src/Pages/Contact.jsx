import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../Helpers/axiosInstance";
import { isEmail } from "../Helpers/regexMatcher";
import InputBox from "../Components/InputBox/InputBox";
import TextArea from "../Components/InputBox/TextArea";
import Layout from "../Layout/Layout";

export default function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: "",
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setUserInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if (!userInput.email || !userInput.name || !userInput.message) {
      toast.error("All fields are mandatory");
      return;
    }

    if (!isEmail(userInput.email)) {
      toast.error("Invalid email");
      return;
    }

    setIsLoading(true);
    const loadingMessage = toast.loading("Sending message...");
    try {
      const res = await axiosInstance.post("/contact", userInput);
      toast.success(res?.data?.message || "Message sent successfully", { id: loadingMessage });
      setUserInput({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error?.response?.data?.message || "Message sending failed! Try again.", { id: loadingMessage });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout>
      <section className="flex flex-col gap-6 items-center py-8 px-3 min-h-[100vh]">
        <form
          onSubmit={onFormSubmit}
          autoComplete="off"
          noValidate
          className="flex flex-col dark:bg-base-100 gap-4 rounded-lg md:py-5 py-7 md:px-7 px-3 md:w-[500px] w-full shadow-custom dark:shadow-xl"
        >
          <h1 className="text-center dark:text-purple-500 text-4xl font-bold font-inter">
            Contact Form
          </h1>
          {/* Name */}
          <InputBox
            label={"Name"}
            name={"name"}
            type={"name"}
            placeholder={"Enter your name..."}
            onChange={handleInputChange}
            value={userInput.name}
          />
          {/* Email */}
          <InputBox
            label={"Email"}
            name={"email"}
            type={"email"}
            placeholder={"Enter your email..."}
            onChange={handleInputChange}
            value={userInput.email}
          />
          {/* Message */}
          <TextArea
            label={"Message"}
            name={"message"}
            rows={4}
            placeholder={"Enter your message..."}
            onChange={handleInputChange}
            value={userInput.message}
          />
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 bg-yellow-500 text-white dark:text-base-200 transition-all ease-in-out duration-300 rounded-md py-2 font-nunito-sans font-[500] text-lg cursor-pointer"
          >
            {isLoading ? "Submitting..." : "Submit Form"}
          </button>
        </form>
      </section>
    </Layout>
  );
}
