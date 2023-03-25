"use client";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

interface ScrollToTopButtonProps {
  threshold?: number;
}

export default function ScrollToTopButton(props: ScrollToTopButtonProps) {
  const { threshold = 100 } = props;
  const [isShowing, setIsShowing] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > threshold) {
        if (!isShowing) {
          setIsShowing(true);
        }
      } else {
        if (isShowing) {
          setIsShowing(false);
        }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [isShowing, threshold]);

  if (!isShowing) {
    return <></>;
  }

  return (
    <button
      onClick={scrollToTop}
      className="bg-accent-500 hover:bg-accent-600 animate-fade-in rounded-full p-2 opacity-0 shadow-md transition-colors duration-300"
    >
      <ChevronUpIcon className="h-6 w-6 font-bold" />
    </button>
  );
}
