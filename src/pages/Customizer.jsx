import React, { useRef } from "react";
import CanvasEditor from "../component/CanvasEditor";
import TopToolbar from "../component/TopToolbar";
import LeftSidebar from "../component/LeftSidebar";

export default function Customizer() {
  const editorRef = useRef();

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* --- Top Toolbar --- */}
      <div className="shadow-md z-20">
        <TopToolbar editorRef={editorRef} />
      </div>

      {/* --- Main Layout --- */}
      <div className="flex flex-1 overflow-hidden">
        {/* --- Left Sidebar --- */}
        <LeftSidebar editorRef={editorRef} />

        {/* --- Canvas Area --- */}
        <div className="flex-1 flex justify-center items-center bg-[#f8f9fa] overflow-hidden">
          <div className="relative w-[85%] h-[90%] bg-white shadow-lg border border-gray-300 rounded-lg overflow-hidden">
            <CanvasEditor ref={editorRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
