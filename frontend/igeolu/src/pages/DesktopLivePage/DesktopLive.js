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
import { objectQuestions } from '../../utils/questions.js';

// axios 기본 설정 추가
// axios.defaults.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjM1LCJyb2xlIjoiUk9MRV9NRU1CRVIiLCJpYXQiOjE3Mzg5MDQyMjAsImV4cCI6MTc0MDExMzgyMH0.rvdPE4gWoUx9zHUoAWjPe_rmyNH4h2ssNqiTcIRqIpE';
// axios.defaults.headers.common['Content-Type'] = 'application/json';

// axios 기본 설정
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';


function DesktopLive() {
  const location = useLocation();
  const { sessionId, token, role } = location.state || {};
  
  // 상태 초기화
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const OV = useRef((() => {
    const ov = new OpenVidu();
    ov.enableProdMode();
    return ov;
  })());
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [propertyList, setPropertyList] = useState([]);
  const [completedProperties, setCompletedProperties] = useState(new Set());
  const [showRatingModal, setShowRatingModal] = useState(false);
  const subscriberVideoRef = useRef(null);
  const detectionCanvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [displayedQuestions, setDisplayedQuestions] = useState(new Set());
  const [hiddenQuestions, setHiddenQuestions] = useState(new Set());
  const [showDetectionOverlay, setShowDetectionOverlay] = useState(true);
  const [selectedMemoText, setSelectedMemoText] = useState('');
  const [hostLocation, setHostLocation] = useState(null);
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  const [hostAddress, setHostAddress] = useState('');
  const [processedObjects, setProcessedObjects] = useState(new Set());

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
      const response = await axios.get(`/api/lives/${sessionId}/rating/eligibility`);
      console.log('Rating eligibility response:', response.data);
      
      if (response.data) {
        setShowRatingModal(true);
      } else {
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
        console.error('Session initialization error:', error);
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

  // 매물 목록 불러오기
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`/api/lives/${sessionId}/properties`);
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

  // signal 리스너 useEffect 수정
  useEffect(() => {
    if (session) {
      session.on('signal:property-completed', (event) => {
        try {
          const data = JSON.parse(event.data);
          const { propertyId, location } = data;
          
          // 완료된 속성 업데이트
          setCompletedProperties(prev => new Set([...prev, propertyId]));
          
          // 위치 정보 업데이트
          if (location) {
            setHostLocation({
              latitude: location.latitude,
              longitude: location.longitude,
              accuracy: location.accuracy
            });
          }

          // AI 체크리스트 초기화
          setDisplayedQuestions(new Set());
          setHiddenQuestions(new Set());
          setProcessedObjects(new Set());
          
        } catch (error) {
          console.error('Error processing property-completed signal:', error);
        }
      });

      // 새로운 host-location-update 시그널 리스너 추가
      session.on('signal:host-location-update', (event) => {
        try {
          const data = JSON.parse(event.data);
          setHostLocation({
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            accuracy: data.location.accuracy
          });
        } catch (error) {
          console.error('Error processing host-location-update signal:', error);
        }
      });
    }
  }, [session]);

  // detectVideo 관련 useEffect 제거하고 새로운 useEffect 추가
  useEffect(() => {
    if (subscriberVideoRef.current && model && detectionCanvasRef.current) {
      const videoElement = subscriberVideoRef.current;
      
      // 캔버스 visibility 제어
      if (detectionCanvasRef.current) {
        detectionCanvasRef.current.style.visibility = showDetectionOverlay ? 'visible' : 'hidden';
      }
      
      const detectFrame = async () => {
        if (!videoElement.paused && !videoElement.ended) {
          try {
            const predictions = await detect(
              videoElement,
              model,
              detectionCanvasRef.current
            );
            
            if (predictions && predictions.length > 0) {
              if (showDetectionOverlay) {
                const boxes_data = predictions.flatMap(pred => pred.bbox);
                const scores_data = predictions.map(pred => pred.confidence);
                const classes_data = predictions.map(pred => labels.indexOf(pred.class));
                
                const xRatio = videoElement.videoWidth / detectionCanvasRef.current.width;
                const yRatio = videoElement.videoHeight / detectionCanvasRef.current.height;
                
                renderBoxes(
                  detectionCanvasRef.current,
                  boxes_data,
                  scores_data,
                  classes_data,
                  [xRatio, yRatio]
                );
              }

              // 아직 처리되지 않은 객체들만 필터링
              const newObjects = predictions.filter(pred => !processedObjects.has(pred.class));
              
              if (newObjects.length > 0) {
                // 새로운 객체들에 대한 모든 질문을 수집
                const allNewQuestions = newObjects.flatMap(pred => {
                  const questions = objectQuestions[pred.class] || [];
                  // 해당 객체를 처리된 것으로 표시
                  setProcessedObjects(prev => new Set([...prev, pred.class]));
                  return questions;
                });

                // 수집된 질문들 중 랜덤하게 3개 선택
                const selectedQuestions = allNewQuestions
                  .sort(() => 0.5 - Math.random()) // 질문들을 랜덤하게 섞기
                  .slice(0, 3); // 앞에서 3개만 선택

                // 선택된 질문들을 displayedQuestions에 추가
                setDisplayedQuestions(prev => new Set([...prev, ...selectedQuestions]));
              }
            }
          } catch (error) {
            console.error('Detection error:', error);
          }
        }
        requestAnimationFrame(detectFrame);
      };

      if (videoElement.readyState === 4) {
        detectionCanvasRef.current.width = videoElement.videoWidth;
        detectionCanvasRef.current.height = videoElement.videoHeight;
        detectFrame();
      } else {
        videoElement.addEventListener('loadeddata', () => {
          detectionCanvasRef.current.width = videoElement.videoWidth;
          detectionCanvasRef.current.height = videoElement.videoHeight;
          detectFrame();
        });
      }
    }
  }, [model, subscriberVideoRef.current, detectionCanvasRef.current, showDetectionOverlay, processedObjects]);

  // 질문 클릭 핸들러 추가
  const handleQuestionClick = (question) => {
    setSelectedMemoText((prevText) => {
      // 이전 텍스트가 있으면 줄바꿈 추가
      const prefix = prevText ? prevText + '\n' : '';
      return prefix + question;
    });
  };

  // 지도 초기화를 위한 useEffect 추가
  useEffect(() => {
    if (window.kakao && mapContainer.current && !map) {
      const options = {
        center: new window.kakao.maps.LatLng(35.8714354, 128.601445), // 대구 중심 좌표
        level: 3
      };
      const newMap = new window.kakao.maps.Map(mapContainer.current, options);
      setMap(newMap);
    }
  }, [mapContainer, map]);

  // hostLocation이 변경될 때마다 지도 위치 업데이트
  useEffect(() => {
    if (map && hostLocation?.latitude && hostLocation?.longitude) {
      const hostPosition = new window.kakao.maps.LatLng(
        hostLocation.latitude,
        hostLocation.longitude
      );
      
      map.setCenter(hostPosition);
      map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC);
      
      const marker = new window.kakao.maps.Marker({
        position: hostPosition,
        map: map
      });

      // 좌표를 주소로 변환
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.coord2Address(hostLocation.longitude, hostLocation.latitude, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const address = result[0].address.address_name;
          setHostAddress(address);
        }
      });

      // 정확도 원 그리기
      if (hostLocation.accuracy) {
        const circle = new window.kakao.maps.Circle({
          center: hostPosition,
          radius: hostLocation.accuracy,
          strokeWeight: 1,
          strokeColor: '#01ADFF',
          strokeOpacity: 0.7,
          strokeStyle: 'solid',
          fillColor: '#01ADFF',
          fillOpacity: 0.2,
          map: map
        });
      }
    }
  }, [map, hostLocation]);

  // 질문 숨기기 핸들러 추가
  const handleHideQuestion = (question, event) => {
    event.stopPropagation(); // 상위 요소의 클릭 이벤트 전파 방지
    setHiddenQuestions(prev => new Set([...prev, question]));
  };

  return (
    <div className="desktop-live-page">
      <DesktopLiveAndMyPage />
      <div className='desktop-live-page__content'>
        <div className='desktop-live-page__left-content'>
          <div className='desktop-live-page__left-content__top-content'>
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
                  <button 
                    className="overlay-toggle-button"
                    onClick={() => {
                      console.log('Toggle button clicked. Current state:', showDetectionOverlay);
                      setShowDetectionOverlay(!showDetectionOverlay);
                      console.log('New state will be:', !showDetectionOverlay);
                    }}
                  >
                    {showDetectionOverlay ? '객체 인식 끄기' : '객체 인식 켜기'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          </div>
          <div className='desktop-live-page__left-content__bottom-content'>
            
            <div className='desktop-live-page__left-content__bottom-content__live-order-list'>
              <p>매물 순서</p>
              <div className="property-list">

                {propertyList.map((property, index) => (
                  <div key={property.livePropertyId} className="property-item">
                    <div className="property-left-content">
                      <span className="property-number">{index + 1}</span>
                      <div className="property-info">
                        <p className="property-address">
                          {property.address || "주소 없음"}
                        </p>
                        <p className="property-price">
                          {property.deposit?.toLocaleString()} / 
                          {property.monthlyRent?.toLocaleString()}
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
            
            <div className='desktop-live-page__left-content__bottom-content__host-location'>
              <div className='desktop-live-page__left-content__bottom-content__host-location__address'>
                <p>호스트 위치 : {hostAddress || '현재 전달받은 위치가 없습니다.'}</p>
              </div>
              <div 
                ref={mapContainer}
                style={{
                  width: 'calc(100% - 20px)',
                  height: '290px',
                  borderRadius: '8px',
                 
                }}
              />
            </div>
          </div>
        </div>
        <div className='desktop-live-page__right-content'>
        <div className='desktop-live-page__left-content__bottom-content__ai-checklist'>
              <p>AI 체크리스트</p>
              <div className="ai-questions-list">
                {Array.from(displayedQuestions)
                  .filter(question => !hiddenQuestions.has(question))
                  .map((question, index) => (
                    <div 
                      key={index} 
                      className="ai-question-item"
                      onClick={() => handleQuestionClick(question)}
                    >
                      <span>{question}</span>
                      <button 
                        className="question-hide-button"
                        onClick={(e) => handleHideQuestion(question, e)}
                      >
                        ✕
                      </button>
                    </div>
                ))}
              </div>
            </div>
          <div className='desktop-live-page__right-content__memo'>
            <Memo2 
              sessionId={sessionId} 
              selectedMemoText={selectedMemoText}
              setSelectedMemoText={setSelectedMemoText}
            />
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
