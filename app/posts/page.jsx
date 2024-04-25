"use client";
import React from "react";
import { useState, useEffect } from "react";
import NewPostModal from "@/components/newPostModal";
import Header from "@/components/header";
import { decrypt } from "@/utils/crypto";

export default function Page() {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <div className="flex gap-12 flex-wrap">
          {userData &&
            userData.posts.map((post, index) => (
              <div key={index} className="bg-gray-200 py-4 px-4 h-72 w-60">
                <h2 className="text-center font-medium text-xl pb-4">
                  {decrypt(post.title)}
                </h2>
                <p className="text-sm">
                  {decrypt(post.content).slice(0, 40) + "..."}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
