import { create } from "zustand";
import { axiosInstance } from "./axios";

let retryAttempts = 0;
const maxRetries = 5;
const reconnectDelay = 1000;
const maxReconnectDelay = 16000;

const globalState = create((set, get) => ({
  socketHolder: null,

  connectSocket: () => {
    const socket = new WebSocket("ws://localhost:3000");
    socket.onopen = () => {
      set({ socketHolder: socket });
      // socket.send(JSON.stringify({ type: "register", userId: get().loggedInUser._id }));
      retryAttempts = 0;
    };
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "text" || data.type === "file" || data.type === "audio" || data.type === "video" || data.type === "image") {
        if (data.payload.receiverId === get().loggedInUser._id && data.payload.status === "sent") {
          const total = get().totalUnreadMessages + 1;
          set({ totalUnreadMessages: total });
        }
      }
    };
    socket.onclose = () => {
      if (!get().isLoggedOut) {
        retryAttempts++;
        if (retryAttempts <= maxRetries) {
          const delay = Math.min(retryAttempts * reconnectDelay, maxReconnectDelay);

          setTimeout(() => {
            get().connectSocket();
          }, delay);
        }
      }
    };
  },
  disconnectSocket: () => {
    const socketPresent = get().socketHolder;
    if (socketPresent) {
      socketPresent.close();
      set({ socketHolder: null });
    }
  },
  OnlineGroupMembersCount: [],
  addTolOnlineGroupMembersCount: (newState) => {
    const existingData = [...get().OnlineGroupMembersCount];
    const ind = existingData.findIndex((item) => item.groupId === newState.groupId);
    if (ind >= 0) {
      existingData[ind] = newState;
    } else if (ind < 0) {
      existingData.push(newState);
    }
    set({ OnlineGroupMembersCount: existingData });
  },

  isAuthenticated: false,
  setIsAuthenticated: (newState) => set({ isAuthenticated: newState }),

  isLoggedOut: false,
  setIsLoggedOut: (newState) => set({ isLoggedOut: newState }),

  user: null,
  setUser: (newUrl) => set({ user: newUrl }),

  // New Post store
  selected: "Home",
  setSelected: (newState) => set({ selected: newState }),

  post: [],
  setNewPost: (newPost) => set({ post: newPost }),

  current: false,
  setCurrent: (status) => set({ current: status }),
  // New Post store

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

  clickedLogOut: null,
  setClickedLogOut: (newState) => set({ clickedLogOut: newState }),

  storeId: null,
  setStoreId: (newState) => set({ storeId: newState }),

  showBannerPicFull: null,
  setShowBannerPicFull: (newState) => set({ showBannerPicFull: newState }),

  showProfilePicFull: null,
  setShowProfilePicFull: (newState) => set({ showProfilePicFull: newState }),

  onlineUsers: [],
  setOnlineUsers: (newState) => set({ onlineUsers: newState }),

  openSearch: false,
  setOpenSearch: (newState) => set({ openSearch: newState }),

  topBarsearch: null,
  setTopBarsearch: (newState) => set({ topBarsearch: newState }),

  removePost: null,
  setRemovePost: (newState) => set({ removePost: newState }),

  totalUnreadMessages: 0,
  setTotalUnreadMessages: (newState) => set({ totalUnreadMessages: newState }),
  increaseTotalUnreadMessages: () => {
    set((state) => ({ totalUnreadMessages: state.totalUnreadMessages + 1 }));
  },

  fetchTotalUnreadMessages: async () => {
    if (get().isLoggedOut) return;
    try {
      const response = await axiosInstance.get(`/message/totalUnreadMessagesCount`);
      set({ totalUnreadMessages: response.data.totalUnreadMessagesCount });
    } catch (error) {}
  },

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

  comment: [],
  setComment: (newState) => set({ comment: newState }),

  changeWidth: null,
  setChangeWidth: (newState) => set({ changeWidth: newState }),

  expandImageForPost: null,
  setExpandImageForPost: (newState) => set({ expandImageForPost: newState }),

  commentTextEdit: null,
  setCommentTextEdit: (newState) => set({ commentTextEdit: newState }),

  deletePostComment: null,
  setDeletePostComment: (newState) => set({ deletePostComment: newState }),

  profileBlock: null,
  setProfileBlock: (newState) => set({ profileBlock: newState }),

  hideAllPostUser: null,
  setHideAllPostUser: (newState) => set({ hideAllPostUser: newState }),

  openHideUserList: null,
  setOpenHideUserList: (newState) => set({ openHideUserList: newState }),

  confirmRemoveFriend: null,
  setConfirmRemoveFriend: (newState) => set({ confirmRemoveFriend: newState }),

  blockedUserPosts: [],
  setBlockedUserPosts: (newState) => set({ blockedUserPosts: newState }),

  openPoll: null,
  setOpenPoll: (newState) => set({ openPoll: newState }),

  notifyClicked: false,
  setNotifyClicked: (newState) => set({ notifyClicked: newState }),

  topBarNotificationIconRef: null,
  setTopBarNotificationIconRef: (newState) => set({ topBarNotificationIconRef: newState }),

  notifications: [],
  setNotifications: (newState) => set({ notifications: newState }),
  addNotification: (newState) => set((state) => ({ notifications: [newState, ...state.notifications] })),
  removeNotification: (newState) => set((state) => ({ notifications: state.notifications.filter((notification) => notification._id !== newState._id) })),

  openPostWithType: null,
  setOpenPostWithType: (newState) => set({ openPostWithType: newState }),

  wSFriendRequest: null,
  setWSFriendRequest: (newState) => set({ wSFriendRequest: newState }),

  block: null,
  setBlock: (newState) => set({ block: newState }),

  showMyGroups: null,
  setShowMyGroups: (newState) => set({ showMyGroups: newState }),

  activeFriend: null,
  setActiveFriend: (newState) => set({ activeFriend: newState }),

  logOut: null,
  setLogOut: (newState) => set({ logOut: newState }),

  onlineFriends: [],
  setOnlineFriends: (newState) => set({ onlineFriends: newState }),

  savePost: null,
  setSavePost: (newState) => set({ savePost: newState }),

  savePostList: null,
  setSavePostList: (newState) => set({ savePostList: newState }),

  likedData: [],
  setLikedData: (newState) => set({ likedData: newState }),

  deleteAllMessagesConfirmation: null,
  setDeleteAllMessagesConfirmation: (newState) => set({ deleteAllMessagesConfirmation: newState }),

  createGroup: null,
  setCreateGroup: (newState) => set({ createGroup: newState }),

  groups: null,
  setGroups: (newState) => set({ groups: newState }),

  showImage: null,
  setShowImage: (newState) => set({ showImage: newState }),

  lastMessage: [],
  setLastMessage: (newState) => set({ lastMessage: newState }),

  isTyping: [],
  setIsTyping: (newState) => set({ isTyping: newState }),

  activeGroup: null,
  setActiveGroup: (newState) => set({ activeGroup: newState }),

  friendsList: [],
  setFriendsList: (newState) => set({ friendsList: newState }),

  confirmLeaveGroup: null,
  setConfirmLeaveGroup: (newState) => set({ confirmLeaveGroup: newState }),

  newGroupAsActive: null,
  setNewGroupAsActive: (newState) => set({ newGroupAsActive: newState }),

  voiceRecord: null,
  setVoiceRecord: (newState) => set({ voiceRecord: newState }),

  activeGroup_OnlineMembers: [],
  setActiveGroup_OnlineMembers: (newState) => set({ activeGroup_OnlineMembers: newState }),
}));

export default globalState;
