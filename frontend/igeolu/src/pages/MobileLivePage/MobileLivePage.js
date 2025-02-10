import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { OpenVidu } from 'openvidu-browser';
import { BsMicFill, BsMicMuteFill, BsCameraVideoFill, BsCameraVideoOffFill, BsStopCircleFill, BsRecordCircleFill } from 'react-icons/bs';
import { BiExit } from 'react-icons/bi';
import { MdFlipCameraIos, MdNavigateNext } from 'react-icons/md';
import axios from 'axios';

import './MobileLivePage.css';

function MobileLivePage() {
    const location = useLocation();
    const { sessionId, token, role } = location.state;  // 백엔드에서 받은 token 사용
    const [session, setSession] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const OV = useRef(new OpenVidu());
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [devices, setDevices] = useState([]);
    const [currentSubscriberIndex, setCurrentSubscriberIndex] = useState(0);
    const [liveList, setLiveList] = useState([]);
    const [propertyList, setPropertyList] = useState({});  // liveId를 key로 사용
    const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
    const [currentLivePropertyId, setCurrentLivePropertyId] = useState(null);
    const [recordingId, setRecordingId] = useState(null);

    useEffect(() => {
        const getVideoDevices = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true });
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setDevices(videoDevices);
            } catch (error) {
                console.error('Error getting video devices:', error);
            }
        };

        const initializeSession = async () => {
            try {
                await getVideoDevices();
                const newSession = OV.current.initSession();
                setSession(newSession);

                newSession.on('streamCreated', (event) => {
                    const subscriber = newSession.subscribe(event.stream, undefined);
                    setSubscribers((subscribers) => [...subscribers, subscriber]);
                });

                newSession.on('streamDestroyed', (event) => {
                    setSubscribers((subscribers) =>
                        subscribers.filter((sub) => sub !== event.stream.streamManager)
                    );
                });

                await newSession.connect(token);
                console.log('Session connected with token:', token);

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

                await newSession.publish(publisher);
                setPublisher(publisher);
                console.log('Publisher created:', publisher);

            } catch (error) {
                console.error('Error initializing session:', error.message);
                console.error('Full error:', error);
            }
        };

        const fetchLiveList = async () => {
            try {
                const propertyResponse = await axios.get(`/api/lives/${sessionId}/properties`, {
                    headers: {
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMyLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAyOTM4LCJleHAiOjE3NDAxMTI1Mzh9.nE5i5y2LWQR8Cws172k0Ti15LumNkDd0uihFYHQdnUg',
                        'userId': '32'
                    }
                });
                
                setLiveList([{ liveId: sessionId }]);
                
                const properties = propertyResponse.data.sort((a, b) => a.livePropertyId - b.livePropertyId);
                console.log('Sorted properties:', properties);
                
                setPropertyList({
                    [sessionId]: properties
                });

                if (properties && Array.isArray(properties) && properties.length > 0) {
                    const initialProperty = properties[0];
                    console.log('Setting initial property:', initialProperty);
                    setCurrentLivePropertyId(initialProperty.livePropertyId);
                    console.log('Initial livePropertyId:', initialProperty.livePropertyId);
                } else {
                    console.log('No properties found in response');
                }
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };

        if (token && sessionId) {
            initializeSession();
            fetchLiveList();
        }

        return () => {
            if (session) {
                session.disconnect();
            }
        };
    }, [sessionId, token, session]);

    const toggleMicrophone = () => {
        if (publisher) {
            publisher.publishAudio(!isMicOn);
            setIsMicOn(!isMicOn);
        }
    };

    const toggleCamera = () => {
        if (publisher) {
            publisher.publishVideo(!isCameraOn);
            setIsCameraOn(!isCameraOn);
        }
    };

    const switchCamera = async () => {
        try {
            if (devices.length < 2) {
                console.log('Not enough cameras available');
                return;
            }

            const currentConstraints = publisher.stream.getMediaStream().getVideoTracks()[0].getConstraints();
            const isCurrentFront = currentConstraints.facingMode === 'user';

            const videoConfig = {
                facingMode: isCurrentFront ? 'environment' : 'user'
            };

            if (publisher) {
                publisher.stream.getMediaStream().getTracks().forEach(track => track.stop());
                
                await publisher.replaceVideo(videoConfig);
                console.log('Camera switched successfully to:', videoConfig.facingMode);
            }
        } catch (error) {
            console.error('Error switching camera:', error);
            alert('카메라 전환 중 오류가 발생했습니다.');
        }
    };

    const toggleRecording = async () => {
        try {
            if (!isRecording) {
                if (currentLivePropertyId) {
                    console.log('Starting recording for property:', currentLivePropertyId);
                    console.log('Session ID:', sessionId);
                    
                    const response = await axios.post(`/api/live-properties/${currentLivePropertyId}/start`, {
                        sessionId: sessionId
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMyLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAyOTM4LCJleHAiOjE3NDAxMTI1Mzh9.nE5i5y2LWQR8Cws172k0Ti15LumNkDd0uihFYHQdnUg'
                        }
                    });
                    
                    if (response.data && response.data.id) {
                        console.log('Recording started successfully. Full response:', response.data);
                        console.log('Recording ID:', response.data.id);
                        setRecordingId(response.data.id);
                    } else {
                        console.error('Recording start failed - Invalid response format:', response.data);
                        throw new Error('녹화 시작 응답이 올바르지 않습니다.');
                    }
                } else {
                    console.error('No property selected for recording');
                    throw new Error('현재 선택된 매물이 없습니다.');
                }
            } else {
                if (!recordingId) {
                    console.error('No recording ID found for stopping recording');
                    throw new Error('녹화 ID를 찾을 수 없습니다.');
                }

                console.log('Stopping recording:', {
                    sessionId: sessionId,
                    recordingId: recordingId,
                    livePropertyId: currentLivePropertyId
                });
                
                const response = await axios.post(`/api/live-properties/${currentLivePropertyId}/stop`, {
                    sessionId: sessionId,
                    recordingId: recordingId,
                    livePropertyId: currentLivePropertyId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMyLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAyOTM4LCJleHAiOjE3NDAxMTI1Mzh9.nE5i5y2LWQR8Cws172k0Ti15LumNkDd0uihFYHQdnUg'
                    }
                });
                
                console.log('Recording stopped successfully. Response:', response.data);
                setRecordingId(null);
            }
            setIsRecording(!isRecording);
            console.log('Recording state updated:', !isRecording);
        } catch (error) {
            console.error('Error in toggleRecording:', error);
            console.error('API Error Response:', error.response?.data);
            alert(error.message || '녹화 기능 실행 중 오류가 발생했습니다.');
        }
    };

    const leaveSession = () => {
        if (session) {
            session.disconnect();
            window.location.href = '/mobile-main';
        }
    };

    const handlePrevSubscriber = () => {
        setCurrentSubscriberIndex((prev) => 
            prev === 0 ? subscribers.length - 1 : prev - 1
        );
    };

    const handleNextSubscriber = () => {
        setCurrentSubscriberIndex((prev) => 
            prev === subscribers.length - 1 ? 0 : prev + 1
        );
    };

    const handleNextProperty = async (liveId) => {
        const properties = propertyList[liveId]?.sort((a, b) => a.livePropertyId - b.livePropertyId) || [];
        if (currentPropertyIndex === properties.length - 1) {
            return;
        }
        
        try {
            const currentProperty = properties[currentPropertyIndex];
            await session.signal({
                data: JSON.stringify({
                    propertyId: currentProperty.livePropertyId,
                    completedAt: new Date().toISOString()
                }),
                type: 'property-completed'
            });
            
            console.log(`Property ${currentProperty.livePropertyId} marked as completed`);
            
            const nextIndex = currentPropertyIndex + 1;
            setCurrentLivePropertyId(properties[nextIndex].livePropertyId);
            console.log('Changed to property ID:', properties[nextIndex].livePropertyId);
            
            setCurrentPropertyIndex(nextIndex);
        } catch (error) {
            console.error('Error sending property completion signal:', error);
            alert('매물 상태 업데이트 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="mobile-live-page-container">
            <div className="mobile-live-page">
                <div className="mobile-live-page__live-cam" id="video-container">
                    <div className="session-code">
                        <p>세션 코드: {sessionId}</p>
                    </div>
                    {publisher && role === 'host' && (
                        <>
                        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                            <video
                                autoPlay
                                ref={(video) => video && publisher.addVideoElement(video)}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {devices.length > 1 && (
                                <button 
                                    className="camera-switch-button"
                                    onClick={switchCamera}
                                >
                                    <MdFlipCameraIos size={24} />
                                </button>
                            )}
                        </>
                    )}
                </div>
                <div className="mobile-live-page__right-content">
                    <div className="mobile-live-page__right-content__my-cam">
                        {subscribers.length > 0 && (
                            <>
                            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                                <video
                                    autoPlay
                                    ref={(video) => video && subscribers[currentSubscriberIndex].addVideoElement(video)}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                {subscribers.length > 1 && (
                                    <>
                                        <button 
                                            className="subscriber-nav-button left"
                                            onClick={handlePrevSubscriber}
                                        >
                                            &#8249;
                                        </button>
                                        <button 
                                            className="subscriber-nav-button right"
                                            onClick={handleNextSubscriber}
                                        >
                                            &#8250;
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    <div className="mobile-live-page__right-content__live-list">
                        {liveList.map((live) => {
                            const sortedProperties = propertyList[live.liveId]
                                ?.sort((a, b) => a.livePropertyId - b.livePropertyId) || [];
                            const currentProperty = sortedProperties[currentPropertyIndex];

                            return (
                                <div key={live.liveId} className="live-item">
                                    {sortedProperties.length > 0 && (
                                        <>
                                            <div className="property-item">
                                                <img 
                                                    src={currentProperty.images[0]} 
                                                    alt="Property" 
                                                    className="property-image"
                                                />
                                                <div className="property-info">
                                                    <p className="price">
                                                        {(currentProperty.deposit ?? 0).toLocaleString()}/
                                                        {(currentProperty.monthlyRent ?? 0).toLocaleString()}
                                                    </p>
                                                    <p className="description">
                                                        {currentProperty.description || "매물 설명이 없습니다."}
                                                    </p>
                                                </div>
                                            </div>
                                            <button 
                                                className="property-nav-button"
                                                onClick={() => handleNextProperty(live.liveId)}
                                            >
                                                <MdNavigateNext size={20} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="mobile-live-page__right-content__live-option">
                        <div className="toolbar">
                            <button onClick={toggleMicrophone} className={isMicOn ? 'active' : ''}>
                                {isMicOn ? <BsMicFill /> : <BsMicMuteFill />}
                            </button>
                            <button onClick={toggleCamera} className={isCameraOn ? 'active' : ''}>
                                {isCameraOn ? <BsCameraVideoFill /> : <BsCameraVideoOffFill />}
                            </button>
                            <button onClick={toggleRecording} className={isRecording ? 'active' : ''}>
                                {isRecording ? <BsStopCircleFill /> : <BsRecordCircleFill />}
                            </button>
                            <button onClick={leaveSession}>
                                <BiExit />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MobileLivePage;
