import React from "react";
import { Outlet } from "react-router-dom";
import TopNavigation from "@/components/organisms/TopNavigation";

const Layout = () => {
  // Mock user data - in a real app this would come from auth context
  const user = {
    id: "1",
    username: "threaduser",
    avatar: null,
    postKarma: 1247,
    commentKarma: 3856,
    cakeDay: "2023-01-15",
    joinedCommunities: [],
    savedPosts: []
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;