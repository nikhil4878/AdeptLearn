"use client";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModal from "../utils/CustomModal";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Verification from "./Auth/Verification";
import Image from "next/image";
import avatar from "../../public/assests/avatar.png";
import { useSession } from "next-auth/react";
import { useLogOutQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./Loader/Loader";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { data: userData, isLoading, refetch } = useLoadUserQuery(undefined, {});
  const { data: sessionData } = useSession();
  const [socialAuth, { isSuccess }] = useSocialAuthMutation();
  const [logout, setLogout] = useState(false);

  useLogOutQuery(undefined, { skip: !logout });

  useEffect(() => {
    if (!isLoading) {
      if (!userData && sessionData) {
        socialAuth({
          email: sessionData.user?.email,
          name: sessionData.user?.name,
          avatar: sessionData.user?.image,
        });
        refetch();
      }

      if (!sessionData && isSuccess) {
        toast.success("Login Successfully");
      }

      if (!sessionData && !userData) {
        setLogout(true);
      }
    }
  }, [sessionData, userData, isLoading]);

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 85);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSidebarClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "screen") {
      setOpenSidebar(false);
    }
  };

  const renderUserAvatar = () => {
    if (userData?.user) {
      return (
        <Link href="/profile">
          <Image
            src={userData.user.avatar?.url || avatar}
            alt="User Avatar"
            width={30}
            height={30}
            className="w-[30px] h-[30px] rounded-full cursor-pointer"
            style={{
              border: activeItem === 5 ? "2px solid #37a39a" : "none",
            }}
          />
        </Link>
      );
    }
    return (
      <HiOutlineUserCircle
        size={25}
        className="hidden 800px:block cursor-pointer dark:text-white text-black"
        onClick={() => setOpen(true)}
      />
    );
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full relative">
          <header
            className={`${active
                ? "fixed top-0 left-0 w-full h-[80px] z-[80] border-b shadow-xl dark:border-[#ffffff1c] dark:bg-gradient-to-b dark:from-gray-900 dark:to-black bg-white transition duration-500"
                : "w-full h-[80px] border-b dark:border-[#ffffff1c] dark:shadow"
              }`}
          >
            <div className="container mx-auto flex justify-between items-center h-full px-4">
              <Link href="/">
                <span className="text-[25px] font-Poppins font-[500] text-black dark:text-white">
                  AdeptLearn
                </span>
              </Link>
              <div className="flex items-center">
                <NavItems activeItem={activeItem} isMobile={false} />
                <ThemeSwitcher />
                <div className="800px:hidden">
                  <HiOutlineMenuAlt3
                    size={25}
                    className="cursor-pointer dark:text-white text-black"
                    onClick={() => setOpenSidebar(true)}
                  />
                </div>
                {renderUserAvatar()}
              </div>
            </div>
          </header>

          {/* Mobile Sidebar */}
          {openSidebar && (
            <div
              id="screen"
              className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[#00000024] bg-white"
              onClick={handleSidebarClose}
            >
              <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
                <NavItems activeItem={activeItem} isMobile />
                {renderUserAvatar()}
                <p className="text-[16px] px-2 pl-5 text-black dark:text-white mt-4">
                  Copyright © 2023 AdeptLearn
                </p>
              </div>
            </div>
          )}

          {/* Modals */}
          {route === "Login" && open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}
              refetch={refetch}
            />
          )}
          {route === "Sign-Up" && open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={SignUp}
            />
          )}
          {route === "Verification" && open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Header;
