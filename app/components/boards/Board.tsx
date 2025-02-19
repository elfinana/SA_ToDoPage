import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import Task from "../tasks/Task";
import EditIcon from "@/public/icons/EditIcon";
import DeleteIcon from "@/public/icons/DeleteIcon";
import { useBoardStore } from "@/app/store/boardStore";
import UndoIcon from "@/public/icons/UndoIcon";
import TaskAddIcon from "@/public/icons/TaskAddIcon";
import DeleteModal from "../modals/DeleteModal";

interface BoardProps {
  id: string;
  title: string;
  index: number;
  isNewBoard: boolean;
}

const ITEM_TYPE = "BOARD";

export default function Board({
  id,
  title,
  isNewBoard = false,
  index,
}: BoardProps) {
  const {
    addBoard,
    removeBoard,
    setIsAddingBoard,
    boards,
    moveBoard,
    updateBoard,
  } = useBoardStore();

  const [boardTitle, setBoardTitle] = useState(title);
  const [taskText, setTaskText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<"board" | "task" | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const ref = useRef<HTMLDivElement>(null);

  const tasks = boards.find((board) => board.id === id)?.tasks || [];
  const [editedTasks, setEditedTasks] = useState(tasks);

  //보드추가
  const handleAddBoard = () => {
    if (boardTitle.trim() && taskText.trim()) {
      addBoard(boardTitle, taskText);
      setBoardTitle("");
      setTaskText("");
      setIsAddingBoard(false);
    }
  };

  //일정추가
  const handleAddTask = () => {
    if (taskText.trim()) {
      setEditedTasks((prevTasks) => [
        ...prevTasks,
        { id: `task-${Date.now()}`, text: taskText },
      ]);
      setTaskText("");
    }
  };

  const handleUndo = () => {
    if (boardTitle.trim() || editedTasks.length > 0) {
      updateBoard(id, boardTitle, editedTasks);
    }
    setIsEditing(false);
  };

  const handleTaskChange = (taskId: string, newText: string) => {
    setEditedTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, text: newText } : task
      )
    );
  };

  const handleDeleteBoard = () => {
    setIsDeleteModalOpen(false);
    removeBoard(id);
  };

  const handleDeleteTask = (taskId: string) => {
    setEditedTasks((prevTasks) =>
      prevTasks
        .filter((task) => task && task.id)
        .filter((task) => task.id !== taskId)
    );
    setIsDeleteModalOpen(false);
  };
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveBoard(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`relative flex border-[1px]   rounded-md shadow-md text-lg font-bold mt-4 ${
        isDragging ? "opacity-50" : "opacity-100"
      } cursor-move`}
    >
      <div className="w-[10px] bg-[#51ADF4] rounded-l-md"></div>

      <div className="p-4 bg-white flex-1 rounded-r-md">
        {isNewBoard ? (
          <>
            <div className="flex items-center justify-between">
              <input
                type="text"
                className="text-[24px] font-semibold  border-none focus:outline-none"
                placeholder="일정을 입력하세요"
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                style={{ color: boardTitle.trim() ? "#484848" : "#D5D5D5" }}
              />
              <div className="flex gap-2">
                <button onClick={handleAddBoard}>
                  <EditIcon />
                </button>

                <button
                  onClick={() => {
                    setDeleteType("board");
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>
            <div className="mt-[20px]">
              <span
                className={`${
                  taskText.trim() ? "text-[#484848]" : "text-[#D5D5D5]"
                } mr-2`}
              >
                •
              </span>
              <input
                type="text"
                className="text-sm text-gray-300 mt-1 border-none focus:outline-none"
                placeholder="오늘의 일정은??"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                style={{ color: taskText.trim() ? "#484848" : "#D5D5D5" }}
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              {isEditing ? (
                <input
                  type="text"
                  className="text-[24px] font-semibold text-[#484848] border-none focus:outline-none"
                  value={boardTitle}
                  onChange={(e) => setBoardTitle(e.target.value)}
                />
              ) : (
                <span className="text-[24px] font-semibold text-[#484848]">
                  {title}
                </span>
              )}
              <div className="flex flex-row gap-[16px]">
                <button
                  onClick={() =>
                    isEditing ? handleUndo() : setIsEditing(true)
                  }
                >
                  {isEditing ? <UndoIcon /> : <EditIcon />}
                </button>
                <button
                  onClick={() => {
                    setDeleteType("board");
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              {editedTasks
                .filter((task) => task !== null) // null 값 제거
                .map((task, taskIndex) => (
                  <Task
                    key={task.id}
                    id={task.id}
                    text={task.text}
                    boardId={id}
                    index={taskIndex}
                    isEditing={isEditing}
                    onDelete={() => {
                      setDeleteType("task");
                      setSelectedTaskId(task.id);
                      setIsDeleteModalOpen(true);
                    }}
                    onTextChange={handleTaskChange}
                  />
                ))}

              {isEditing && (
                <div className=" flex items-center ">
                  <span
                    className={`${
                      taskText.trim() ? "text-[#484848]" : "text-[#D5D5D5]"
                    } mr-2`}
                  >
                    •
                  </span>
                  <input
                    type="text"
                    className="w-full text-[16px] border-none focus:outline-none "
                    placeholder="일정을 추가하세요"
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                    style={{ color: taskText.trim() ? "#484848" : "#D5D5D5" }}
                  />
                  <button onClick={handleAddTask}>
                    <TaskAddIcon />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (deleteType === "board") handleDeleteBoard();
          if (deleteType === "task" && selectedTaskId)
            handleDeleteTask(selectedTaskId);
        }}
      />
    </div>
  );
}
