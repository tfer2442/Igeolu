import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import { BsMicFill, BsMicMuteFill } from 'react-icons/bs';
import { BsCameraVideoFill, BsCameraVideoOffFill } from 'react-icons/bs';
import { BiExit } from 'react-icons/bi';
import DesktopLiveAndMyPage from '../../components/DesktopNav/DesktopLiveAndMyPage';
import './DesktopLive.css';
import Memo2 from '../../components/Memo/Memo2';


function DesktopLive() {
  const location = useLocation();
  console.log('Location state:', location.state); // 디버깅을 위해 추가
  
  // location.state에서 값을 추출할 때 기본값 설정
  const { sessionId, token } = location.state || {};
  
  // 상태 초기화
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const OV = useRef(new OpenVidu());
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [role, setRole] = useState(null);
  const [currentSubscriberIndex, setCurrentSubscriberIndex] = useState(0);

  // 마이크 토글
  const toggleMicrophone = () => {
    if (publisher) {
      publisher.publishAudio(!isMicOn);
      setIsMicOn(!isMicOn);
    }
  };

  // 카메라 토글
  const toggleCamera = () => {
    if (publisher) {
      publisher.publishVideo(!isCameraOn);
      setIsCameraOn(!isCameraOn);
    }
  };

  // 세션 나가기
  const leaveSession = () => {
    if (session) {
      session.disconnect();
      window.location.href = '/'; // 또는 다른 페이지로 이동
    }
  };

  // 토큰 파싱 함수
  const parseToken = (token) => {
    try {
      // wss:// 부분 제거
      const jwtToken = token.split('?token=')[1];
      if (!jwtToken) return null;

      // JWT 디코딩
      const base64Url = jwtToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Token parsing error:', e);
      return null;
    }
  };

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // 토큰 권한 확인
        const tokenInfo = parseToken(token);
        console.log('Token info:', tokenInfo);
        
        if (tokenInfo) {
          console.log('Token role:', tokenInfo.role);
          // PUBLISHER 또는 MODERATOR 권한 확인
          const hasPublishPermission = ['PUBLISHER', 'MODERATOR'].includes(tokenInfo.role);
          console.log('Has publish permission:', hasPublishPermission);
          
          if (!hasPublishPermission) {
            console.warn('Token does not have publish permissions');
            // 사용자에게 권한 없음을 알림
            return;
          }
          setRole(tokenInfo.role);
        }

        const newSession = OV.current.initSession();
        console.log('Session initialized:', newSession);
        setSession(newSession);

        // 스트림 생성 이벤트 핸들러
        newSession.on('streamCreated', (event) => {
          console.log('Stream created:', event);
          const subscriber = newSession.subscribe(event.stream, undefined);
          setSubscribers((subscribers) => [...subscribers, subscriber]);
        });

        // 스트림 제거 이벤트 핸들러
        newSession.on('streamDestroyed', (event) => {
          console.log('Stream destroyed:', event);
          setSubscribers((subscribers) =>
            subscribers.filter((sub) => sub !== event.stream.streamManager)
          );
        });

        // 연결 에러 핸들러 추가
        newSession.on('connectionError', (event) => {
          console.error('Connection error:', event);
        });

        // 연결 성공 핸들러 추가
        newSession.on('connectionCreated', (event) => {
          console.log('Connection created:', event);
        });

        console.log('Attempting to connect with token:', token);
        await newSession.connect(token);
        console.log('Session connected successfully');

        // 퍼블리셔 초기화
        const publisher = await OV.current.initPublisherAsync(undefined, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: '640x480',
          frameRate: 30,
          insertMode: 'APPEND',
          mirror: false,
        });
        console.log('Publisher initialized:', publisher);

        try {
          await newSession.publish(publisher);
          console.log('Publisher published successfully');
          setPublisher(publisher);
        } catch (error) {
          if (error.name === 'OPENVIDU_PERMISSION_DENIED') {
            console.error('Publishing permission denied despite token role');
          }
          throw error;
        }

      } catch (error) {
        console.error('Error in initializeSession:', error);
      }
    };

    if (token && sessionId) {
      console.log('Starting session initialization...');
      initializeSession();
    } else {
      console.warn('Missing token or sessionId:', { token, sessionId });
    }

    return () => {
      if (session) {
        console.log('Cleaning up session...');
        session.disconnect();
      }
    };
  }, [token, sessionId]);

  const handlePrevSubscriber = () => {
    setCurrentSubscriberIndex((prevIndex) =>
      prevIndex === 0 ? subscribers.length - 1 : prevIndex - 1
    );
  };

  const handleNextSubscriber = () => {
    setCurrentSubscriberIndex((prevIndex) =>
      prevIndex === subscribers.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className='desktop-live-page'>
      <DesktopLiveAndMyPage />
      <div className='desktop-live-page__content'>
        <div className='desktop-live-page__left-content'>
          <div className='desktop-live-page__left-content__live-video'>
            {role === 'host' ? (
              // 호스트인 경우 모든 참가자의 비디오를 표시
              subscribers.map((sub, i) => (
                <div key={i} className="subscriber-video">
                  <video
                    autoPlay
                    ref={(video) => video && sub.addVideoElement(video)}
                  />
                </div>
              ))
            ) : (
              // 참가자인 경우 호스트의 비디오만 표시
              <div className="host-video">
                {subscribers.length > 0 && (
                  <video
                    autoPlay
                    ref={(video) => video && subscribers[0].addVideoElement(video)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </div>
            )}
          </div>
          <div className='desktop-live-page__left-content__bottom-content'>
            <div className='desktop-live-page__left-content__bottom-content__ai-checklist'></div>
            <div className='desktop-live-page__left-content__bottom-content__live-order-list'></div>
          </div>
        </div>
        <div className='desktop-live-page__right-content'>
          <div className='desktop-live-page__right-content__memo'>
            <Memo2 />
          </div>
          <div className='desktop-live-page__right-content__my-cam'>
            {publisher && (
              <div className="publisher-container">
                {role === 'host' ? (
                  // 호스트인 경우 자신의 비디오
                  <video
                    autoPlay
                    ref={(video) => video && publisher.addVideoElement(video)}
                  />
                ) : (
                  // 참가자인 경우 다른 참가자들의 비디오를 전환 가능하게
                  <>
                    {subscribers.length > 1 && (
                      <div className="participant-video">
                        <video
                          autoPlay
                          ref={(video) => video && subscribers[currentSubscriberIndex].addVideoElement(video)}
                        />
                        <div className="subscriber-controls">
                          <button onClick={handlePrevSubscriber}>&#8249;</button>
                          <span>참가자 {currentSubscriberIndex + 1} / {subscribers.length - 1}</span>
                          <button onClick={handleNextSubscriber}>&#8250;</button>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div className="desktop-live-page__toolbar">
                  <button onClick={toggleMicrophone}>
                    {isMicOn ? <BsMicFill /> : <BsMicMuteFill />}
                  </button>
                  <button onClick={toggleCamera}>
                    {isCameraOn ? <BsCameraVideoFill /> : <BsCameraVideoOffFill />}
                  </button>
                  <button onClick={leaveSession}>
                    <BiExit />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
     
    </div>
  );
}

export default DesktopLive;
