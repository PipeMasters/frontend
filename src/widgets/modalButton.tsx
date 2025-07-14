import React, {useState} from "react";
import { Button } from "antd";
import CreateTrainForm from "./createTrainForm";
import CreateBranchForm  from "./createBranchForm";
import CreateBatchForm from "./createBatchForm";
import CreateUserForm from "./createUserForm"


type ModalButtonProps = {
    buttonText: string;
    type: 'train' | 'branch' | 'batch' | "user";
};

export default function ModalButton ({ buttonText, type }: ModalButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    let ModalComponent = null;

    switch (type){
        case 'train':
            ModalComponent = <CreateTrainForm open={isOpen} onCancel={handleClose} />;
            break;
        case 'branch':
            ModalComponent = <CreateBranchForm open={isOpen} onCancel={handleClose} />;
            break;
        case 'batch':
            ModalComponent = <CreateBatchForm open={isOpen} onCancel={handleClose} />;
            break;
        case 'user':
            ModalComponent = <CreateUserForm open={isOpen} onCancel={handleClose} />;
            break;
        default:
            ModalComponent = null;
    }

      return(
        <>
            <Button onClick={handleOpen} style={{fontFamily: 'RussianRail, sans-serif'}}> {buttonText}</Button>
            {ModalComponent}
        </>
      );
};