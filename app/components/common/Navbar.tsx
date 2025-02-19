import EditIcon from "@/public/icons/EditIcon";
import NavIcon from "@/public/icons/NavIcon";
import PlusIcon from "@/public/icons/PlusIcon";
import React, { useState } from "react";

export default function Navbar() {
  const [tabs, setTabs] = useState<string[]>(["주간 업무"]);
  const [activeTab, setActiveTab] = useState("주간 업무"); // ✅ 현재 선택된 탭
  const [newTab, setNewTab] = useState("");

  const addTab = () => {
    if (newTab.trim() && !tabs.includes(newTab)) {
      setTabs([...tabs, newTab]);
      setActiveTab(newTab); // ✅ 추가한 탭을 활성화
      setNewTab(""); // 입력 필드 초기화
    }
  };

  return (
    <nav className="flex items-center justify-between w-full border-b-[3px] mt-[20px] px-4">
      {/* 왼쪽: 아이콘 + 탭 */}
      <div className="flex items-center">
        <NavIcon />
        {tabs.map((tab) => (
          <React.Fragment key={tab}>
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[21px] font-semibold px-2 pb-1 ${
                activeTab === tab
                  ? "border-b-[3px] border-[#51ADF4] text-[#484848]"
                  : "text-[#8D8D8D]"
              }`}
            >
              {tab}
            </button>

            <button onClick={addTab}>
              <PlusIcon />
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* 오른쪽: 수정 아이콘 */}
      <EditIcon />
    </nav>
  );
}
