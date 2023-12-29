import { sentient, user } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import {
  Dispatch,
  MouseEvent,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

export interface AddHeroContextInterface {
  addHeroOption: "new" | "existing" | null;
  setAddHeroOption: Dispatch<SetStateAction<"new" | "existing" | null>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleProceedToHeroConfirmation: (e: MouseEvent, sentient: sentient) => void;
  handleClose: () => void;
  selectedHero: sentient | null;
  setSelectedHero: Dispatch<SetStateAction<sentient | null>>;
  submitHeroSelection: (
    user: user
  ) => Promise<AxiosResponse<{ text: string }, null>>;
}

const AddHeroContext = createContext<AddHeroContextInterface | null>(null);

export function AddHeroContextProvider({ children }: { children: ReactNode }) {
  const [selectedHero, setSelectedHero] = useState<sentient | null>(null);
  const [addHeroOption, setAddHeroOption] = useState<"new" | "existing" | null>(
    null
  );

  const [open, setOpen] = useState<boolean>(false);

  const handleProceedToHeroConfirmation = (
    e: MouseEvent,
    sentient: sentient
  ) => {
    setSelectedHero(sentient);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function submitHeroSelection(user: user) {
    if (!addHeroOption) return;
    if (addHeroOption === "new") {
      return await axios.post("/api/heroes", {
        sentient: selectedHero,
        user,
      });
    }
    if (addHeroOption === "existing") {
      return await axios.put("/api/heroes", {
        sentient: selectedHero,
        user,
      });
    }
  }

  return (
    <AddHeroContext.Provider
      value={{
        addHeroOption,
        setAddHeroOption,
        open,
        setOpen,
        handleProceedToHeroConfirmation,
        handleClose,
        selectedHero,
        setSelectedHero,
        // @ts-expect-error submitHeroSelection
        submitHeroSelection,
      }}
    >
      {children}
    </AddHeroContext.Provider>
  );
}

export default AddHeroContext;
