import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { OpenVidu } from 'openvidu-browser';
import { BsMicFill, BsMicMuteFill } from 'react-icons/bs';
import { BsCameraVideoFill, BsCameraVideoOffFill } from 'react-icons/bs';
import { BiExit } from 'react-icons/bi';
import DesktopLiveAndMyPage from '../../components/DesktopNav/DesktopLiveAndMyPage';
import './DesktopLive.css';
import Memo2 from '../../components/Memo/Memo2';
import axios from 'axios';


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
  const [propertyList, setPropertyList] = useState([]);
  const [completedProperties, setCompletedProperties] = useState(new Set());

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

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`/api/lives/${sessionId}/properties`, {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMyLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAyOTM4LCJleHAiOjE3NDAxMTI1Mzh9.nE5i5y2LWQR8Cws172k0Ti15LumNkDd0uihFYHQdnUg'
          }
        });
        // livePropertyId 기준으로 정렬
        const properties = response.data.sort((a, b) => a.livePropertyId - b.livePropertyId);
        console.log('Sorted properties:', properties);
        setPropertyList(properties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    if (sessionId) {
      fetchProperties();
    }
  }, [sessionId]);

  // 시그널 리스너 추가
  useEffect(() => {
    if (session) {
      session.on('signal:property-completed', (event) => {
        const { propertyId } = JSON.parse(event.data);
        setCompletedProperties(prev => new Set([...prev, propertyId]));
      });
    }
  }, [session]);

  return (
    <div className='desktop-live-page'>
      <DesktopLiveAndMyPage />
      <div className='desktop-live-page__content'>
        <div className='desktop-live-page__left-content'>
          <div className='desktop-live-page__left-content__live-video'>
            {subscribers.map((sub, i) => (
              <div key={i} className="subscriber-video">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  autoPlay
                  ref={(video) => video && sub.addVideoElement(video)}
                />
              </div>
            ))}
          </div>
          <div className='desktop-live-page__left-content__bottom-content'>
            <div className='desktop-live-page__left-content__bottom-content__ai-checklist'></div>
            <div className='desktop-live-page__left-content__bottom-content__live-order-list'>
              <p>매물 순서</p>
              <div className="property-list">

                {propertyList.map((property, index) => (
                  <div key={property.livePropertyId} className="property-item">
                    <div className="property-left-content">
                      <span className="property-number">{index + 1}</span>
                      <div className="property-info">
                        <p className="property-price">
                          {property.deposit?.toLocaleString()} / 
                          {property.monthlyRent?.toLocaleString()}
                        </p>
                        <p className="property-description">
                          {property.description || "설명 없음"}
                        </p>
                      </div>
                    </div>
                    <div className="property-checkbox">
                      <input 
                        type="checkbox"
                        checked={completedProperties.has(property.livePropertyId)}
                        onChange={() => {}}
                        className="property-checkbox-input"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className='desktop-live-page__right-content'>
          <div className='desktop-live-page__right-content__memo'>
            <Memo2 sessionId={sessionId} />
          </div>
          <div className='desktop-live-page__right-content__my-cam'>
            {publisher && (
              <div className="publisher-container">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  autoPlay
                  ref={(video) => video && publisher.addVideoElement(video)}
                />
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
