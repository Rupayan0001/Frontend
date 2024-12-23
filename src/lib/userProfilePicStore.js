import { create } from "zustand";

const userProfilePicStore = create((set) => ({

    isAuthenticated: false,
    setIsAuthenticated: (newState) => set({ isAuthenticated: newState }),

    user: null,
    setUser: (newUrl) => set({ user: newUrl }),

    commentDetails: null,
    setCommentDetails: (newDetails) => set({ commentDetails: newDetails }),

    selected: "Posts",
    setSelected: (newState) => set({ selected: newState }),

    editProfile: false,
    setEditProfile: (newState) => set({ editProfile: newState }),

    shareOptions: false,
    setShareOptions: (newState) => set({ shareOptions: newState }),

    confirmDelete: false,
    setConfirmDelete: (newState) => set({ confirmDelete: newState }),

    deletePostObj: false,
    setDeletePostObj: (newState) => set({ deletePostObj: newState }),

    openPost: false,
    setOpenPost: (newState) => set({ openPost: newState }),

    postDetailsObj: null,
    setPostDetailsObj: (newState) => set({ postDetailsObj: newState }),

    notify: null,
    setNotify: (newState) => set({ notify: newState }),

    openProfileDropdown: false,
    setOpenProfileDropdown: (newState) => set({ openProfileDropdown: newState }),

    topBarRightProfilePicRefState: null,
    setTopBarRightProfilePicRefState: (newState) => set({ topBarRightProfilePicRefState: newState }),

    homePagePost: [],
    setHomePagePost: (newState) => set({ homePagePost: newState }),

    pageName: null,
    setPageName: (newState) => set({ pageName: newState }),

    loggedInUser: null,
    setLoggedInUser: (newState) => set({ loggedInUser: newState }),

    storeId: null,
    setStoreId: (newState) => set({ storeId: newState }),

    // entered: false,
    // setEntered: (newState) => set({ entered: newState }),

    openSearch: false,
    setOpenSearch: (newState) => set({ openSearch: newState }),

    topBarsearch: null,
    setTopBarsearch: (newState) => set({ topBarsearch: newState }),

    removePost: null,
    setRemovePost: (newState) => set({ removePost: newState }),

    tabSelectedForFollow: null,
    setTabSelectedForFollow: (newState) => set({ tabSelectedForFollow: newState }),

    closeModal: null,
    setCloseModal: (newState) => set({ closeModal: newState }),

    friendRequests: null,
    setFriendRequests: (newState) => set({ friendRequests: newState }),

    friendsList: null,
    setFriendsList: (newState) => set({ friendsList: newState }),

    showFriends: null,
    setShowFriends: (newState) => set({ showFriends: newState }),

    friend: null,
    setFriend: (newState) => set({ friend: newState }),

    showIdDetails: null,
    setShowIdDetails: (newState) => set({ showIdDetails: newState }),

    enterDialogHover: null,
    setEnterDialogHover: (newState) => set({ enterDialogHover: newState }),

    report: null,
    setReport: (newState) => set({ report: newState }),

    openBlockList: false,
    setOpenBlockList: (newState) => set({ openBlockList: newState }),

    blockedUserPosts: [],
    setBlockedUserPosts: (newState) => set({ blockedUserPosts: newState }),

    block: null,
    setBlock: (newState) => set({ block: newState }),

    logOut: null,
    setLogOut: (newState) => set({ logOut: newState }),

    savePost: null,
    setSavePost: (newState) => set({ savePost: newState }),

    savePostList: null,
    setSavePostList: (newState) => set({ savePostList: newState }),

    likedData: [],
    setLikedData: (newState) => set({ likedData: newState }),

}));

export default userProfilePicStore;