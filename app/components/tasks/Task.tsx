import { useBoardStore } from "@/app/store/boardStore";
import CheckIcon from "@/public/icons/CheckIcon";
import TaskDeleteIcon from "@/public/icons/TaskDelete";
import UnCheckIcon from "@/public/icons/UnCheckIcon";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

interface TaskProps {
  id: string;
  text: string;
  boardId: string;
  index: number;
  isEditing: boolean;
  onDelete: (taskId: string) => void;
  onTextChange: (taskId: string, newText: string) => void;
}

export default function Task({
  id,
  text,
  boardId,
  index,
  isEditing,
  onDelete,
  onTextChange,
}: TaskProps) {
  const { moveTask, toggleTask, boards } = useBoardStore();
  const ref = useRef<HTMLDivElement>(null);

  const board = boards.find((b) => b.id === boardId);
  const task = board?.tasks?.find((t) => t.id === id);

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id, boardId, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "TASK",
    hover: (draggedItem: { id: string; boardId: string; index: number }) => {
      if (draggedItem.index !== index || draggedItem.boardId !== boardId) {
        moveTask(draggedItem.boardId, boardId, draggedItem.index, index);
        draggedItem.index = index;
        draggedItem.boardId = boardId;
      }
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`border-b border-gray-300 flex items-center justify-between pb-[10px] ${
        isDragging ? "opacity-50" : "opacity-100"
      } cursor-move`}
    >
      <div className="flex items-center">
        <span className="text-[#484848]">•</span>
        {isEditing ? (
          <input
            type="text"
            className="text-[16px] ml-2 font-normal text-[#484848] border-none focus:outline-none w-full"
            value={text}
            onChange={(e) => onTextChange(id, e.target.value)}
          />
        ) : (
          <span className="text-[16px] ml-2 font-normal text-[#484848]">
            {text}
          </span>
        )}
      </div>

      {!isEditing && (
        <button
          onClick={() => task && toggleTask(boardId, id)}
          className="ml-2"
        >
          {task?.isChecked ? <CheckIcon /> : <UnCheckIcon />}
        </button>
      )}

      {isEditing && (
        <button onClick={() => onDelete(id)}>
          <TaskDeleteIcon />
        </button>
      )}
    </div>
  );
}
