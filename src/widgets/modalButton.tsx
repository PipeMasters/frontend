import { useState } from "react";
import { Button, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import CreateTrainForm from "./createTrainForm";
import CreateBranchForm from "./createBranchForm";
import CreateBatchForm from "./createBatchForm";
import CreateUserForm from "./createUserForm";
import CreateDelegateForm from "./createDelegateForm";

type ModalType = "train" | "branch" | "batch" | "user" | "delegate";

const actions: { key: ModalType; label: string }[] = [
  { key: "train", label: "Добавить поезд" },
  { key: "branch", label: "Добавить филиал" },
  { key: "batch", label: "Добавить запись" },
  { key: "user", label: "Добавить пользователя" },
  { key: "delegate", label: "Делегировать обязанности" },
];

export default function ModalDropdownButton() {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    setActiveModal(e.key as ModalType);
  };

  const menuItems: MenuProps["items"] = actions.map((action) => ({
    key: action.key,
    label: action.label,
  }));

  return (
    <>
      <Dropdown
        menu={{
          items: menuItems,
          onClick: handleMenuClick,
        }}
        placement="bottomLeft"
      >
        <Button>
          Выбрать действие <DownOutlined />
        </Button>
      </Dropdown>

      {activeModal === "train" && (
        <CreateTrainForm open={true} onCancel={() => setActiveModal(null)} />
      )}
      {activeModal === "branch" && (
        <CreateBranchForm open={true} onCancel={() => setActiveModal(null)} />
      )}
      {activeModal === "batch" && (
        <CreateBatchForm open={true} onCancel={() => setActiveModal(null)} />
      )}
      {activeModal === "user" && (
        <CreateUserForm open={true} onCancel={() => setActiveModal(null)} />
      )}
      {activeModal === "delegate" && (
        <CreateDelegateForm open={true} onCancel={() => setActiveModal(null)} />
      )}
    </>
  );
}
