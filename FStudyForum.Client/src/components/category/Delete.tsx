
import React from "react"
import { DialogBody, DialogFooter, Button } from "@material-tailwind/react"

interface DeleteCategorycPopupProps {
  open: boolean
  onClose: () => void
  onDelete: () => void
}

const DeleteCategory: React.FC<DeleteCategorycPopupProps> = ({
  open,
  onClose,
  onDelete
}) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50 ${
        open ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-md p-4 shadow-lg z-50 w-80">
        <DialogBody>
          <p>Delete this category?</p>
        </DialogBody>
        <DialogFooter className="flex justify-end">
          <Button
            variant="text"
            color="blue"
            onClick={onClose}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button variant="gradient" color="red" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </div>
    </div>
  )
}

export default DeleteCategory
