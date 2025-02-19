"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Header from "./components/common/Header";
import AddBoardIcon from "@/public/icons/AddBoardIcon";
import { BoardData, useBoardStore } from "./store/boardStore";
import Board from "./components/boards/Board";

export default function Home() {
  const { boards, isAddingBoard, setIsAddingBoard } = useBoardStore();

  const handleAddBoard = () => {
    setIsAddingBoard(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex justify-center min-h-screen">
        <div className="w-[450px]  rounded shadow-md p-4">
          <Header />
          <div className="flex flex-col gap-4">
            {boards.map((board: BoardData, index: number) => (
              <Board
                key={board.id}
                id={board.id}
                title={board.title}
                index={index}
                isNewBoard={false}
              />
            ))}
          </div>

          {isAddingBoard && (
            <Board id="" title="" index={boards.length} isNewBoard />
          )}

          <div className="flex justify-center mt-[35px]">
            <button onClick={handleAddBoard}>
              <AddBoardIcon />
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
