import { useState } from "react";
import { FaTrash } from "react-icons/fa";

interface DeleteButtonProps {
  type: { _id: string };
  handleDelete: (id: string) => void;
}

export default function DeleteButton({
  type,
  handleDelete,
}: DeleteButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const confirmDelete = () => {
    handleDelete(type._id);
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 cursor-pointer"
      >
        <FaTrash className="w-4 h-4" />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md  bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg text-center font-medium text-gray-900 dark:text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 text-center dark:text-gray-300 mb-6">
              Are you sure you want to delete this item?
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
