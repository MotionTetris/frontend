import React, { useState, useEffect, useRef } from 'react';
import { useRoomSocket, RoomSocketEvent } from "@context/roomSocket";
import { ChatContainer, Messages, Message, MessageInput, Input, Button, MessageBox, Nickname, JoinMessage } from './styles';
import { getUserNickname } from "@src/data-store/token";

interface ChatMessage {
  nickname: string;
  message: string;
}

interface ChatProps {
  isCreator: boolean;
  players: string[];
}

const Chat: React.FC<ChatProps> = ({ isCreator, players }) => {
    const roomSocket = useRoomSocket();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const currentPlayerNickname = getUserNickname();
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const [isComposing, setIsComposing] = useState(false);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
      }, [messages]);
    
    useEffect(() => {
        const receiveMessage = (message: ChatMessage) => {
            setMessages(prevMessages => [...prevMessages, message]);
        };

        roomSocket.on(RoomSocketEvent.ON_MESSAGE, receiveMessage);

        return () => {
            roomSocket.off(RoomSocketEvent.ON_MESSAGE, receiveMessage);
        };
    }, [roomSocket]);

    useEffect(() => {
        const onUserJoin = (nicknames: string[]) => {
            if (!isCreator) return;

            const otherNicknames = nicknames.filter(nickname => nickname !== currentPlayerNickname);
    
            const joinMessages = otherNicknames.map(nickname => ({
                nickname: '',
                message: `---- '${nickname}'님이 입장하셨습니다. ----`,
            }));
    
            setMessages(prevMessages => [...prevMessages, ...joinMessages]);
        };
    
        roomSocket.on(RoomSocketEvent.ON_JOIN_ROOM, onUserJoin);
    
        return () => {
            roomSocket.off(RoomSocketEvent.ON_JOIN_ROOM, onUserJoin);
        };
    }, [roomSocket, players, isCreator, currentPlayerNickname]);
    

    const sendMessage = () => {
        if (currentMessage.trim() !== '') {
            const message = {
                nickname: currentPlayerNickname, 
                message: currentMessage,
            };
            roomSocket.emit(RoomSocketEvent.EMIT_MESSAGE, message);
            setMessages(prevMessages => [...prevMessages, message]); // 상태에 메세지 추가
            setCurrentMessage('');
        }
    };

    const handleCompositionStart = () => {
      setIsComposing(true); // IME 입력이 시작되었음을 표시
    };
    
    const handleCompositionEnd = () => {
      setIsComposing(false); // IME 입력이 완료되었음을 표시
    };
    
    
    return (
  
      <ChatContainer>
       <Messages ref={messagesContainerRef}>
          {messages.map((msg, index) => {
            if (msg.nickname === '') {
              return (
                <JoinMessage key={index}>
                  {msg.message}
                </JoinMessage>
              );
            }
            const isMine = msg.nickname === currentPlayerNickname;
            return (
              <Message key={index} isMine={isMine}>
                <Nickname>{msg.nickname}</Nickname>
                <MessageBox isMine={isMine}>{msg.message}</MessageBox>
              </Message>
            );
          })}
        </Messages>
        <MessageInput>
          <Input
            type="text"
            value={currentMessage}
            onChange={(e) =>{
              e.preventDefault();
              setCurrentMessage(e.target.value);
            }}
            placeholder="채팅을 입력하세요"
            onKeyDown={(e) => {
              if(e.key === 'Enter' && !isComposing) {
                e.preventDefault();
                sendMessage()
              }
            }}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
          />
          <Button onClick={sendMessage}>보내기</Button>
        </MessageInput>
      </ChatContainer>
    );
  };
  
  export default Chat;