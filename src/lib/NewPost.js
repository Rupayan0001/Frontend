import { create } from "zustand";

const newPostStore = create((set) => ({
    post: [],
    setNewPost: (newPost) => set({ post: newPost }),

    current: false,
    setCurrent: (status) => set({ current: status }),

    selected: "Home",
    setSelected: (newState) => set({ selected: newState }),
}))
export default newPostStore;