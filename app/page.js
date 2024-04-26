"use client";
import { useState, useEffect } from "react";
import { decrypt } from "@/utils/crypto";
import Header from "@/components/header";
import UpdateUserInfoModal from "@/components/updateUserModal";

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEncrypted, setShowEncrypted] = useState(false);

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

  const handleUpdate = async (data) => {
    console.log("Updated user data:", data);
    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const rdata = await response.json();

      if (!response.ok) {
        console.error("Update error:", rdata.message);
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  useEffect(() => {
    // getUserInfo();
  }, []);

  return (
    <main className="">
      <Header
        name={(userData && "Hey " + decrypt(userData.name)) || "Hey there"}
      />

      <div className="">
        {userData ? (
          <div className="text-xl py-20 px-20">
            <h3>
              <span className="font-medium">Name: </span>{" "}
              {showEncrypted ? (
                <span className="">{userData.name}</span>
              ) : (
                <span className="">{decrypt(userData.name)}</span>
              )}
            </h3>
            <h3 className="py-4">
              <span className="font-medium">Email: </span> {userData.email}{" "}
            </h3>
            <h3>
              <span className="font-medium">Gender: </span>{" "}
              {showEncrypted ? (
                <span>{userData.gender}</span>
              ) : (
                <span className="">{decrypt(userData.gender)}</span>
              )}
            </h3>

            <div className="py-8 flex gap-12 text-lg">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-300 p-2 hover:bg-blue-400"
              >
                Update informaiton
              </button>
              <button
                onClick={
                  showEncrypted
                    ? () => setShowEncrypted(false)
                    : () => setShowEncrypted(true)
                }
                className={`${
                  showEncrypted ? "bg-green-500" : "bg-purple-400"
                } p-2 `}
              >
                {showEncrypted ? "Show actual data" : "Show encrypted data"}
              </button>
            </div>
            {isModalOpen && (
              <UpdateUserInfoModal
                userData={userData}
                onClose={() => setIsModalOpen(false)}
                onUpdate={handleUpdate}
              />
            )}
          </div>
        ) : (
          []
        )}
      </div>
    </main>
  );
}
