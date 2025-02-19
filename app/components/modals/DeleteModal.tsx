interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#494949] rounded-[10px] w-[300px] h-[160px] flex flex-col">
        <div className="flex flex-col items-center gap-1 py-5">
          <h2 className="text-[21px] text-white font-medium">삭제</h2>
          <p className="text-white font-light text-[16px]">
            일정을 삭제하시겠습니까?
          </p>
        </div>
        <div className="flex border-t border-[#6D6D6D] mt-auto">
          <button
            className="text-[#51ADF4] font-medium text-[21px] w-1/2 py-3 text-center"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="text-[#51ADF4] font-medium text-[21px] w-1/2 py-2 text-center border-l border-[#6D6D6D]"
            onClick={onConfirm}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
