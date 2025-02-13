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
import RatingModal from '../../components/RatingModal/RatingModal';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import { detect } from '../../utils/detect';
import labels from '../../utils/labels.json';
import { renderBoxes } from '../../utils/renderBox';

// axios 기본 설정 추가
axios.defaults.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjM1LCJyb2xlIjoiUk9MRV9NRU1CRVIiLCJpYXQiOjE3Mzg5MDQyMjAsImV4cCI6MTc0MDExMzgyMH0.rvdPE4gWoUx9zHUoAWjPe_rmyNH4h2ssNqiTcIRqIpE';
axios.defaults.headers.common['Content-Type'] = 'application/json';

function DesktopLive() {
  const location = useLocation();
  console.log('Location state:', location.state); // 디버깅을 위해 추가
  
  // location.state에서 값을 추출할 때 기본값 설정
  const { sessionId, token, role } = location.state || {};
  
  // 상태 초기화
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const OV = useRef(new OpenVidu());
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [propertyList, setPropertyList] = useState([]);
  const [completedProperties, setCompletedProperties] = useState(new Set());
  const [showRatingModal, setShowRatingModal] = useState(false);
  const subscriberVideoRef = useRef(null);
  const detectionCanvasRef = useRef(null);
  const [model, setModel] = useState(null);

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
  const leaveSession = async () => {
    try {
      // 토큰 정보 로깅
      const authToken = axios.defaults.headers.common['Authorization'];
      console.log('Current Authorization Token:', authToken);
      
      // API 요청 시 헤더 정보 로깅
      console.log('Request Headers:', {
        Authorization: authToken,
        'Content-Type': axios.defaults.headers.common['Content-Type']
      });
      
      // 평점 등록 자격 확인 및 응답 로깅
      const response = await axios.get(`/api/lives/${sessionId}/rating/eligibility`);
      console.log('Rating eligibility response:', response.data);
      
      if (response.data) {
        // 평점 등록 자격이 있는 경우 모달 표시
        setShowRatingModal(true);
      } else {
        // 자격이 없는 경우 바로 세션 종료
        if (session) {
          session.disconnect();
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Error checking rating eligibility:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      // 에러 발생 시 세션 종료
      if (session) {
        session.disconnect();
        window.location.href = '/';
      }
    }
  };

  const handleRatingSubmit = async (rating) => {
    try {
      // 여기에 평점 제출 API 호출 추가
      await axios.post('/api/lives/rating', {
        sessionId,
        rating
      });
      
      // 세션 종료 및 페이지 이동
      if (session) {
        session.disconnect();
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('평점 제출 중 오류가 발생했습니다.');
    }
  };

  const handleModalClose = () => {
    setShowRatingModal(false);
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

  // YOLOv8 모델 로드
  useEffect(() => {
    const loadModel = async () => {
      console.log('🔄 모델 로딩 시작...');
      try {
        const modelPath = '/yolov8n_web_model/model.json';
        const loadedModel = await tf.loadGraphModel(modelPath);
        console.log('✅ 모델 로딩 성공:', loadedModel);
        
        setModel({
          net: loadedModel,
          inputShape: loadedModel.inputs[0].shape
        });
      } catch (error) {
        console.error('❌ 모델 로딩 중 오류 발생:', error);
      }
    };
    loadModel();
  }, []);

  useEffect(() => {
    console.log('Starting session initialization...');
    // 현재 Authorization 헤더 정보 즉시 로깅
    console.log('Current Headers:', {
      Authorization: axios.defaults.headers.common['Authorization'],
      'Content-Type': axios.defaults.headers.common['Content-Type']
    });

    const initializeSession = async () => {
      try {
        const newSession = OV.current.initSession();
        console.log('Session initialized:', newSession);
        setSession(newSession);

        // 스트림 생성 이벤트 핸들러 수정
        newSession.on('streamCreated', (event) => {
          console.log('Stream created - Connection Data:', event.stream.connection.data);
          try {
            const connectionData = JSON.parse(event.stream.connection.data);
            console.log('Parsed connection data:', connectionData);
            
            if (connectionData.role === 'host') {
              console.log('Host stream found, subscribing...');
              const subscriber = newSession.subscribe(event.stream, undefined);
              
              subscriber.on('videoElementCreated', (event) => {
                const videoElement = event.element;
                console.log('Video element created for subscriber:', videoElement);
                
                videoElement.addEventListener('loadeddata', async () => {
                  console.log('Video loaded, initializing YOLO detection');
                  
                  if (model && detectionCanvasRef.current) {
                    detectionCanvasRef.current.width = videoElement.videoWidth;
                    detectionCanvasRef.current.height = videoElement.videoHeight;
                    
                    const detectFrame = async () => {
                      if (!videoElement.paused && !videoElement.ended) {
                        try {
                          const predictions = await detect(
                            videoElement,
                            model,
                            detectionCanvasRef.current
                          );
                          
                          if (predictions && predictions.length > 0) {
                            console.log('Detected objects:', predictions.map(pred => ({
                              class: pred.class,
                              confidence: pred.confidence.toFixed(2)
                            })));
                          }
                        } catch (error) {
                          console.error('Detection error:', error);
                        }
                      }
                      requestAnimationFrame(detectFrame);
                    };
                    
                    detectFrame();
                  }
                });
              });
              
              setSubscribers((subscribers) => [...subscribers, subscriber]);
            } else {
              console.log('Non-host stream, skipping subscription');
            }
          } catch (error) {
            console.error('Error in stream creation:', error);
          }
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

        // viewer로 연결
        const clientData = JSON.stringify({ role: 'viewer' });
        console.log('Connecting as viewer with data:', clientData);
        await newSession.connect(token, clientData);
        console.log('Connected to session successfully');

        // 퍼블리셔 초기화
        const publisher = await OV.current.initPublisherAsync(undefined, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: '640x480',
          frameRate: 30,
          insertMode: 'APPEND',
          mirror: true,
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

  // detectVideo 관련 useEffect 제거하고 새로운 useEffect 추가
  useEffect(() => {
    if (subscriberVideoRef.current && model && detectionCanvasRef.current) {
      const videoElement = subscriberVideoRef.current;
      
      const detectFrame = async () => {
        if (!videoElement.paused && !videoElement.ended) {
          try {
            const predictions = await detect(
              videoElement,
              model,
              detectionCanvasRef.current
            );
            
            if (predictions && predictions.length > 0) {
              // predictions에서 필요한 데이터 추출
              const boxes_data = predictions.flatMap(pred => pred.bbox);
              const scores_data = predictions.map(pred => pred.confidence);
              const classes_data = predictions.map(pred => labels.indexOf(pred.class));
              
              // 비디오와 캔버스 크기에 따른 비율 계산
              const xRatio = videoElement.videoWidth / detectionCanvasRef.current.width;
              const yRatio = videoElement.videoHeight / detectionCanvasRef.current.height;
              
              // renderBoxes 함수를 사용하여 감지된 객체를 캔버스에 그립니다
              renderBoxes(
                detectionCanvasRef.current,
                boxes_data,
                scores_data,
                classes_data,
                [xRatio, yRatio]
              );
              
              console.log('Detected objects:', predictions.map(pred => ({
                class: pred.class,
                confidence: pred.confidence.toFixed(2)
              })));
            }
          } catch (error) {
            console.error('Detection error:', error);
          }
        }
        requestAnimationFrame(detectFrame);
      };

      if (videoElement.readyState === 4) {
        console.log('Video is ready');
        detectionCanvasRef.current.width = videoElement.videoWidth;
        detectionCanvasRef.current.height = videoElement.videoHeight;
        detectFrame();
      } else {
        console.log('Waiting for video to be ready...');
        videoElement.addEventListener('loadeddata', () => {
          console.log('Video loaded');
          detectionCanvasRef.current.width = videoElement.videoWidth;
          detectionCanvasRef.current.height = videoElement.videoHeight;
          detectFrame();
        });
      }
    }
  }, [model, subscriberVideoRef.current, detectionCanvasRef.current]);

  return (
    <div className="desktop-live-page">
      <DesktopLiveAndMyPage />
      <div className='desktop-live-page__content'>
        <div className='desktop-live-page__left-content'>
          <div className='desktop-live-page__left-content__live-video'>
            {subscribers.map((sub, i) => (
              <div key={i} className="subscriber-video-container">
                <div className="video-overlay-container">
                  <video
                    autoPlay
                    ref={(video) => {
                      video && sub.addVideoElement(video);
                      subscriberVideoRef.current = video;
                    }}
                    className="subscriber-video"
                  />
                  <canvas
                    ref={detectionCanvasRef}
                    className="detection-canvas"
                  />
                </div>
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
      <RatingModal 
        isOpen={showRatingModal}
        onClose={handleModalClose}
        sessionId={sessionId}
      />
    </div>
  );
}

export default DesktopLive;
