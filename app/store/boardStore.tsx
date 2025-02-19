import { create } from "zustand";

export interface Task {
  id: string;
  text: string;
  isChecked?: boolean;
}

export interface BoardData {
  id: string;
  title: string;
  tasks: Task[];
}

interface BoardState {
  boards: BoardData[];
  isAddingBoard: boolean;
  setIsAddingBoard: (status: boolean) => void;
  addBoard: (title: string, firstTask?: string) => void;
  removeBoard: (id: string) => void;
  moveBoard: (dragIndex: number, hoverIndex: number) => void;
  updateBoard: (boardId: string, newTitle: string, newTask?: Task[]) => void;
  moveTask: (
    fromBoardId: string,
    toBoardId: string,
    fromIndex: number,
    toIndex: number
  ) => void;
  toggleTask: (boardId: string, taskId: string) => void;
}

const loadBoardsFromStorage = (): BoardData[] => {
  const data = localStorage.getItem("boards");
  return data ? JSON.parse(data) : [];
};

const saveBoardsToStorage = (boards: BoardData[]) => {
  localStorage.setItem("boards", JSON.stringify(boards));
};

export const useBoardStore = create<BoardState>((set) => ({
  boards: loadBoardsFromStorage(),
  isAddingBoard: false,

  addBoard: (title: string, firstTask = "") =>
    set((state) => {
      const newBoard: BoardData = {
        id: `board-${Date.now()}`,
        title,
        tasks: firstTask ? [{ id: `task-${Date.now()}`, text: firstTask }] : [],
      };
      const updatedBoards = [...state.boards, newBoard];
      saveBoardsToStorage(updatedBoards);
      return { boards: updatedBoards, isAddingBoard: false };
    }),

  removeBoard: (id: string) =>
    set((state) => {
      const updatedBoards = state.boards.filter((board) => board.id !== id);
      saveBoardsToStorage(updatedBoards);
      return { boards: updatedBoards };
    }),

  moveBoard: (dragIndex: number, hoverIndex: number) =>
    set((state) => {
      const updatedBoards = [...state.boards];
      const [movedBoard] = updatedBoards.splice(dragIndex, 1);
      updatedBoards.splice(hoverIndex, 0, movedBoard);

      saveBoardsToStorage(updatedBoards);
      return { boards: updatedBoards };
    }),

  moveTask: (fromBoardId, toBoardId, fromIndex, toIndex) =>
    set((state) => {
      const updatedBoards = [...state.boards];
      const fromBoard = updatedBoards.find((b) => b.id === fromBoardId);
      const toBoard = updatedBoards.find((b) => b.id === toBoardId);

      if (!fromBoard || !toBoard) return state;

      const [movedTask] = fromBoard.tasks.splice(fromIndex, 1);
      toBoard.tasks.splice(toIndex, 0, movedTask);

      saveBoardsToStorage(updatedBoards);
      return { boards: updatedBoards };
    }),

  updateBoard: (boardId: string, newTitle: string, newTasks?: Task[]) =>
    set((state) => {
      const updatedBoards = state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              title: newTitle,
              tasks: newTasks !== undefined ? newTasks : board.tasks,
            }
          : board
      );
      saveBoardsToStorage(updatedBoards);
      return { boards: updatedBoards };
    }),

  toggleTask: (boardId: string, taskId: string) =>
    set((state) => {
      const updatedBoards = state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              tasks: board.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, isChecked: !task.isChecked }
                  : task
              ),
            }
          : board
      );

      saveBoardsToStorage(updatedBoards);
      return { boards: updatedBoards };
    }),

  setIsAddingBoard: (status: boolean) => set({ isAddingBoard: status }),
}));
