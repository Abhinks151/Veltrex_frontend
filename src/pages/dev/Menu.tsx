import Navbar from "@/shared/components/custom/Navbar";
import { useState } from "react";

const Menu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>
      <Navbar />
      <h1>
        Menu
      </h1>
      <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full " onClick={() => setIsOpen(!isOpen)}>
        A
      </div>
      {
        isOpen && (
          <div className="flex flex-col gap-2 bg-gray-200 w-fit py-2 rounded-md relative top-1 left-3">
            <ul>
              <li className="hover:bg-gray-300 cursor-pointer rounded-md px-4 py-1"><a href="">Home</a></li>
              <li className="hover:bg-gray-300 cursor-pointer rounded-md px-4 py-1"><a href="">About</a></li>
              <li className="hover:bg-gray-300 cursor-pointer rounded-md px-4 py-1"><a href="">Contact</a></li>
              <li className="hover:bg-gray-300 cursor-pointer rounded-md px-4 py-1"><a href="">Contact</a></li>
              <li className="hover:bg-gray-300 cursor-pointer rounded-md px-4 py-1"><a href="">Contact</a></li>
              <li className="hover:bg-gray-300 cursor-pointer rounded-md px-4 py-1"><a href="">Contact</a></li>
            </ul>
          </div>
        )
      }
    </div>
  );
};

export default Menu;