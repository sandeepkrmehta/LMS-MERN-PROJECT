import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createNewCourse } from "../../Redux/Slices/CourseSlice";
import { useNavigate } from "react-router-dom";
import Layout from "../../Layout/Layout";
import toast from "react-hot-toast";
import InputBox from "../../Components/InputBox/InputBox";
import TextArea from "../../Components/InputBox/TextArea";

export default function CreateCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [userInput, setUserInput] = useState({
    title: "",
    category: "",
    createdBy: "",
    description: "",
    thumbnail: null,
    previewImage: "",
  });

  const handleImageUpload = (e) => {
    const uploadImage = e.target.files[0];
    if (uploadImage && ["image/jpeg", "image/jpg", "image/png"].includes(uploadImage.type)) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setUserInput({
          ...userInput,
          previewImage: fileReader.result,
          thumbnail: uploadImage,
        });
      };
      fileReader.readAsDataURL(uploadImage);
    } else {
      toast.error("Please upload a valid JPG or PNG image.");
    }
  };

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({ ...prev, [name]: value }));
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    if (
      !userInput.title ||
      !userInput.description ||
      !userInput.category ||
      !userInput.createdBy ||
      !userInput.thumbnail
    ) {
      toast.error("All fields are required!");
      return;
    }

    setIsCreatingCourse(true);
    const formData = new FormData();
    formData.append("title", userInput.title);
    formData.append("description", userInput.description);
    formData.append("category", userInput.category);
    formData.append("createdBy", userInput.createdBy);
    formData.append("thumbnail", userInput.thumbnail);

    try {
      const response = await dispatch(createNewCourse(formData));
      if (response?.payload?.success) {
        toast.success("Course created successfully!");
        setUserInput({
          title: "",
          category: "",
          createdBy: "",
          description: "",
          thumbnail: null,
          previewImage: "",
        });
        navigate("/courses"); // Navigate to courses list or desired page
      } else {
        toast.error("Failed to create course.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsCreatingCourse(false);
    }
  };

  return (
    <Layout>
      <section className="flex flex-col gap-6 items-center py-8 px-3 min-h-[100vh]">
        <form
          onSubmit={onFormSubmit}
          autoComplete="off"
          noValidate
          className="flex flex-col dark:bg-base-100 gap-7 rounded-lg md:py-5 py-7 md:px-7 px-3 md:w-[750px] w-full shadow-custom dark:shadow-xl"
        >
          <h1 className="text-center dark:text-purple-500 text-4xl font-bold font-inter">
            Create New Course
          </h1>
          <div className="w-full flex md:flex-row md:justify-between justify-center flex-col md:gap-0 gap-5">
            <div className="md:w-[48%] w-full flex flex-col gap-5">
              {/* Thumbnail */}
              <div className="border border-gray-300">
                <label htmlFor="image_uploads" className="cursor-pointer">
                  {userInput.previewImage ? (
                    <img className="w-full h-44 m-auto" src={userInput.previewImage} alt="Course Thumbnail" />
                  ) : (
                    <div className="w-full h-44 m-auto flex items-center justify-center">
                      <h1 className="font-bold text-lg">Upload your course thumbnail</h1>
                    </div>
                  )}
                </label>
                <input
                  className="hidden"
                  type="file"
                  id="image_uploads"
                  accept=".jpg, .jpeg, .png"
                  name="image_uploads"
                  onChange={handleImageUpload}
                />
              </div>
              {/* Title */}
              <InputBox
                label="Title"
                name="title"
                type="text"
                placeholder="Enter Course Title"
                onChange={handleUserInput}
                value={userInput.title}
              />
            </div>
            <div className="md:w-[48%] w-full flex flex-col gap-5">
              {/* Instructor */}
              <InputBox
                label="Instructor"
                name="createdBy"
                type="text"
                placeholder="Enter Course Instructor"
                onChange={handleUserInput}
                value={userInput.createdBy}
              />
              {/* Category */}
              <InputBox
                label="Category"
                name="category"
                type="text"
                placeholder="Enter Course Category"
                onChange={handleUserInput}
                value={userInput.category}
              />
              {/* Description */}
              <TextArea
                label="Description"
                name="description"
                rows={3}
                placeholder="Enter Course Description"
                onChange={handleUserInput}
                value={userInput.description}
              />
            </div>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isCreatingCourse}
            className={`mt-3 ${isCreatingCourse ? "bg-gray-400" : "bg-yellow-500"} text-white dark:text-base-200 transition-all duration-300 rounded-md py-2 font-nunito-sans font-[500] text-lg cursor-pointer`}
          >
            {isCreatingCourse ? "Creating Course..." : "Create Course"}
          </button>
        </form>
      </section>
    </Layout>
  );
}
