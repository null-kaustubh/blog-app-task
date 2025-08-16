"use client";

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);

  const handleCreateClick = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/blog/create");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow">
      {/* Left: Logo */}
      <div
        onClick={() => router.push("/")}
        className="text-xl font-bold cursor-pointer"
      >
        Blogify
      </div>

      {/* Right: Buttons */}
      <div className="flex items-center gap-4">
        {/* Create Button */}
        <button
          onClick={handleCreateClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create
        </button>

        {/* Avatar */}
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full bg-gray-300 cursor-pointer flex items-center justify-center"
          >
            {user ? user.name[0].toUpperCase() : "?"}
          </div>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-2">
              {user ? (
                <>
                  <button
                    onClick={() => router.push("/profile")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => router.push("/my-blogs")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                  >
                    My Blogs
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="px-4 py-2 text-sm">
                  <p className="text-gray-500 mb-2">
                    Please login to see your profile
                  </p>
                  <button
                    onClick={() => router.push("/login")}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
