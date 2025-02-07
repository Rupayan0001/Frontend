import { create } from "zustand";

const businessState = create((set, get) => ({
  selectedMenu: null,
  setSelectedMenu: (newState) => set({ selectedMenu: newState }),
}));
export default businessState;
