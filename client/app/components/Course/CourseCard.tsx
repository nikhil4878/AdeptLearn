import Ratings from "@/app/utils/Ratings";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { AiOutlineUnorderedList } from "react-icons/ai";

type Props = {
  item: any;
  isProfile?: boolean;
};

const CourseCard: FC<Props> = ({ item, isProfile }) => {
  return (
    <Link href={!isProfile ? `/course/${item._id}` : `course-access/${item._id}`} passHref>
      <div className="w-full min-h-[35vh] dark:bg-slate-500 dark:bg-opacity-20 backdrop-blur border dark:border-[#ffffff1d] border-[#00000015] dark:shadow-[bg-slate-700] rounded-lg p-3 shadow-sm dark:shadow-inner">
        {/* Image Section */}
        {item.thumbnail?.url ? (
          <Image
            src={item.thumbnail.url}
            width={500}
            height={300}
            objectFit="contain"
            className="rounded w-full"
            alt="Course Thumbnail"
          />
        ) : (
          <div className="w-full h-[300px] flex items-center justify-center text-gray-500">
            Image not available
          </div>
        )}
        {/* Title */}
        <h1 className="font-Poppins text-[16px] text-black dark:text-[#fff] mt-4">
          {item.name}
        </h1>
        {/* Ratings and Student Count */}
        <div className="w-full flex items-center justify-between pt-2">
          <Ratings rating={item.ratings} />
          {!isProfile && (
            <h5 className="text-black dark:text-[#fff]">
              {item.purchased} Students
            </h5>
          )}
        </div>
        {/* Price and Lecture Details */}
        <div className="w-full flex items-center justify-between pt-3">
          <div className="flex">
            <h3 className="text-black dark:text-[#fff]">
              {item.price === 0 ? "Free" : `${item.price}$`}
            </h3>
            {item.estimatedPrice > 0 && (
              <h5 className="pl-3 text-[14px] mt-[-5px] line-through opacity-80 text-black dark:text-[#fff]">
                {item.estimatedPrice}$
              </h5>
            )}
          </div>
          <div className="flex items-center">
            <AiOutlineUnorderedList size={20} className="text-white dark:text-[#fff]" />
            <h5 className="pl-2 text-black dark:text-[#fff]">
              {item.courseData?.length || 0} Lectures
            </h5>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
