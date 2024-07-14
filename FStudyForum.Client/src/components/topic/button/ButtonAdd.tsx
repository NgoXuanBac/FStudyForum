import React from "react"
import { Button } from "@material-tailwind/react"

interface AddButtonProps {
  onClick: () => void 
}

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
  return (
    <div className="flex w-max gap-4">
      <Button color="light-blue" onClick={onClick}>
        Add
      </Button>
    </div>
  )
}

export default AddButton
