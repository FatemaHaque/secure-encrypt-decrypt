"use client";
import React from "react";
import { useState, useEffect } from "react";
import NewPostModal from "@/components/newPostModal";
import Header from "@/components/header";
import { decrypt } from "@/utils/crypto";

export default function Page() {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const openModal = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  const getUserInfo = async () => {
    try {
      const response = await fetch("/api/extractData", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setUserData(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (postData) => {
    const data = {
      _id: userData._id,
      ...postData,
    };

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      });

      const rdata = await response.json();

      if (!response.ok) {
        console.error("New post addition error:", rdata.message);
      }
    } catch (error) {
      console.error("New post addition error:", error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <div className="">
      <Header name="Your Blog Posts" />
      <div className="px-12">
        <div className="py-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-md mb-4 hover:bg-blue-600"
          >
            Add New Post
          </button>
          {isModalOpen && (
            <NewPostModal
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleSubmit}
            />
          )}
        </div>
        <div className="flex flex-wrap gap-8">
          {userData &&
            (userData.posts && userData.posts.length > 0 ? (
              <div className="">
                {userData.posts.map((post, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg p-8 w-72 h-80 overflow-hidden cursor-pointer"
                    onClick={() => openModal(post)}
                  >
                    <h2 className="text-center text-2xl font-bold mb-4">
                      {decrypt(post.title)}
                    </h2>
                    <p className="text-gray-600">
                      {decrypt(post.content).slice(0, 100) +
                        (post.content.length > 100 ? "..." : "")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-2xl text-[#f2jk87]">
                Currently, you do not have any posts. Please click the {"'"}Add
                New Post{"'"} button to create a new post.
              </div>
            ))}

          {/* Modal */}
          {selectedPost && (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 px-40">
              <div className="bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-center text-3xl font-bold mb-4">
                  {decrypt(selectedPost.title)}
                </h2>
                <p className="text-gray-700">{decrypt(selectedPost.content)}</p>
                <button
                  className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
