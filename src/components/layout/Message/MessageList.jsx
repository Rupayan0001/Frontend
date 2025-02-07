import React from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages, activeFriend, activeGroup, loggedInUser, windowWidth, messageDateGroupLogic, messageTimeLogic }) => {
    return (
        <div className={`relative ${windowWidth >= 900 && (activeFriend || activeGroup) ? "h-[calc(100vh-195px)] px-5" : "h-[calc(100vh-125px)] px-5"} pb-[30px] overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-zinc-400 w-full bg-cover pt-[12px]`} 
             style={{ backgroundImage: `url("https://res.cloudinary.com/dnku8pwjp/image/upload/v1733975369/Desktop-2_xvmmfa.png")` }}>
            {messages && messages.length > 0 ? (
                messageDateGroupLogic(messages).map((unique, i) => (
                    <div key={i}>
                        <div className="flex justify-center my-4">
                            <div className="text-white text-[16px] hover:opacity-90 font-semibold bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg px-4 py-1">
                                {unique.date}
                            </div>
                        </div>
                        {activeFriend || activeGroup ? (
                            unique.data.map((e, ind) => (
                                <MessageBubble 
                                    key={ind} 
                                    message={e} 
                                    loggedInUser={loggedInUser} 
                                    windowWidth={windowWidth} 
                                    messageTimeLogic={messageTimeLogic}
                                />
                            ))
                        ) : null}
                    </div>
                ))
            ) : (
                <div className="h-full w-full flex items-center justify-center">
                    <p className='spinOnButton h-[30px] w-[30px]'></p>
                </div>
            )}
        </div>
    );
}

export default MessageList;
